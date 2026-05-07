import { fmt } from '../../utils/format';
import { estadoStock, getStockClass, getStockLabel } from '../../utils/stockUtils';

export default function ProductosTable({ productos, onEdit, onDelete, onDuplicate }) {
  if (!productos.length) {
    return (
      <div className="text-center py-10 text-muted">
        <div className="text-4xl mb-2">📦</div>
        <div>No hay productos que coincidan</div>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="text-left">
          <th className="p-2 text-xs text-muted uppercase tracking-wide">SKU</th>
          <th className="p-2 text-xs text-muted uppercase tracking-wide">Descripción</th>
          <th className="p-2 text-xs text-muted uppercase tracking-wide">Categoría</th>
          <th className="p-2 text-xs text-muted uppercase tracking-wide">Precio</th>
          <th className="p-2 text-xs text-muted uppercase tracking-wide">IVA%</th>
          <th className="p-2 text-xs text-muted uppercase tracking-wide">Stock</th>
          <th className="p-2 text-xs text-muted uppercase tracking-wide">Mín.</th>
          <th className="p-2 text-xs text-muted uppercase tracking-wide">Tipo</th>
          <th className="p-2 text-xs text-muted uppercase tracking-wide">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p, idx) => {
          const es = estadoStock(p);
          const cls = getStockClass(es);
          const label = getStockLabel(es);
          return (
            <tr key={p.sku} className="hover:bg-card2">
              <td className="p-2">{p.sku}</td>
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.categoria}</td>
              <td className="p-2">{fmt(p.precio)}</td>
              <td className="p-2">{p.iva === 0 ? 'Exento' : p.iva + '%'}</td>
              <td className={`p-2 ${cls}`}>{p.esCombo ? '—' : p.stock}</td>
              <td className="p-2">{p.esCombo ? '—' : p.stockMin}</td>
              <td className="p-2">{p.esCombo ? 'Combo' : 'Simple'}</td>
              <td className="p-2">
                <button onClick={() => onEdit(p)} className="btn btn-outline btn-sm mr-1" title="Editar">✏️</button>
                <button onClick={() => onDuplicate && onDuplicate(p)} className="btn btn-outline btn-sm mr-1" title="Duplicar">📋</button>
                <button onClick={() => onDelete(p.sku)} className="btn btn-danger btn-sm" title="Eliminar">🗑</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
