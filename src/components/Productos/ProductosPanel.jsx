import { useState, useMemo } from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import { useUI } from '../../context/UIContext';
import { fmt } from '../../utils/format';
import { estadoStock, getStockClass, getStockLabel } from '../../utils/stockUtils';
import * as XLSX from 'xlsx';
import ProductoModal from './ProductoModal';
import ProductosTable from './ProductosTable';
import FiltrosProductos from './FiltrosProductos';

export default function ProductosPanel() {
  const { state, addProducto, editProducto, deleteProducto } = useCatalogo();
  const { modals, openModal, closeModal, editingProducto, setEditingProducto } = useUI();
  const [filtros, setFiltros] = useState({ q: '', categoria: '', tipo: '', stock: '' });

  const filtered = useMemo(() => {
    return state.catalogo.filter(p => {
      if (filtros.q) {
        const q = filtros.q.toLowerCase();
        if (!p.sku.toLowerCase().includes(q) && !p.nombre.toLowerCase().includes(q)) return false;
      }
      if (filtros.categoria && p.categoria !== filtros.categoria) return false;
      if (filtros.tipo) {
        if (filtros.tipo === 'simple' && p.esCombo) return false;
        if (filtros.tipo === 'combo' && !p.esCombo) return false;
      }
      if (filtros.stock) {
        const es = estadoStock(p);
        if (es !== filtros.stock) return false;
      }
      return true;
    });
  }, [state.catalogo, filtros]);

  const categorias = [...new Set(state.catalogo.map(p => p.categoria))].sort();

  const handleSave = async (producto) => {
    if (editingProducto && !editingProducto._isDuplicate) {
      await editProducto(editingProducto.sku, producto);
    } else {
      await addProducto(producto);
    }
    closeModal('producto');
    setEditingProducto(null);
  };

  const handleDuplicate = (producto) => {
    const duplicated = {
      ...producto,
      sku: `${producto.sku}-COPY`,
      nombre: `${producto.nombre} (copia)`,
      _isDuplicate: true,
    };
    delete duplicated._id;
    setEditingProducto(duplicated);
    openModal('producto');
  };

  const bajoStockCount = state.catalogo.filter(p => !p.esCombo && p.stock <= p.stockMin).length;

  const handleExportXLS = () => {
    const headers = ['SKU', 'Descripción', 'Categoría', 'Precio', 'IVA%', 'Stock', 'Stock Mín', 'Tipo'];
    const data = state.catalogo.map(p => [
      p.sku,
      p.nombre,
      p.categoria,
      p.precio,
      p.iva,
      p.esCombo ? '' : p.stock,
      p.esCombo ? '' : p.stockMin,
      p.esCombo ? 'Combo' : 'Simple'
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos_fiscalpos.xlsx');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Productos</h2>
        <p className="text-text-secondary text-sm">Gestioná el catálogo de productos y combos</p>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-text-secondary uppercase tracking-wide mb-1">Total</div>
          <div className="text-2xl font-bold">{state.catalogo.length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-text-secondary uppercase tracking-wide mb-1">Bajo Stock</div>
          <div className={`text-2xl font-bold ${bajoStockCount > 0 ? 'text-amber-500' : 'text-green-500'}`}>
            {bajoStockCount}
          </div>
        </div>
        <div className="card">
          <div className="text-xs text-text-secondary uppercase tracking-wide mb-1">Categorías</div>
          <div className="text-2xl font-bold">{categorias.length}</div>
        </div>
        <div className="card">
          <div className="text-xs text-text-secondary uppercase tracking-wide mb-1">Con Combos</div>
          <div className="text-2xl font-bold">{state.catalogo.filter(p => p.esCombo).length}</div>
        </div>
      </div>

      {/* Acciones y filtros */}
      <div className="card">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h3 className="font-semibold">Lista de Productos</h3>
          <div className="flex gap-2">
            <button
              onClick={() => { setEditingProducto(null); openModal('producto'); }}
              className="btn btn-primary btn-sm"
            >
              + Nuevo Producto
            </button>
            <button
              onClick={() => { setEditingProducto({ esCombo: true }); openModal('producto'); }}
              className="btn btn-secondary btn-sm"
            >
              + Nuevo Combo
            </button>
            <button
              onClick={() => {
                const tabs = document.querySelector('[class*="topbar"]')?._reactInternals?.return?.return?.stateNode;
                if (tabs && tabs.setActiveTab) tabs.setActiveTab('importar');
              }}
              className="btn btn-outline btn-sm"
            >
              Importar
            </button>
          </div>
        </div>
        <FiltrosProductos filtros={filtros} setFiltros={setFiltros} categorias={categorias} />
        <div className="mt-4 overflow-x-auto">
          <ProductosTable
            productos={filtered}
            onEdit={(p) => { setEditingProducto(p); openModal('producto'); }}
            onDelete={deleteProducto}
            onDuplicate={handleDuplicate}
          />
        </div>
      </div>

      {modals.producto && (
        <ProductoModal
          producto={editingProducto}
          onSave={handleSave}
          onClose={() => { closeModal('producto'); setEditingProducto(null); }}
          categorias={categorias}
        />
      )}
    </div>
  );
}
