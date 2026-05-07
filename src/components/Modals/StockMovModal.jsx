import { useState } from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import { useUI } from '../../context/UIContext';
import { fmt } from '../../utils/format';

export default function StockMovModal() {
  const { state, addMovimiento } = useCatalogo();
  const { modals, closeModal, stockMovData } = useUI();
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [remito, setRemito] = useState('');
  const [obs, setObs] = useState('');

  const prod = state.catalogo.find(p => p.sku === stockMovData.sku);
  if (!prod) return null;

  const tipo = stockMovData.tipo || 'ingreso';
  
  const handleConfirm = () => {
    const cant = parseInt(cantidad) || 0;
    if (cant <= 0) return alert('Ingrese una cantidad válida');
    
    const stockAntes = prod.stock;
    if (tipo === 'ingreso') prod.stock += cant;
    else if (tipo === 'egreso') prod.stock = Math.max(0, prod.stock - cant);
    else prod.stock = cant;
    
    addMovimiento({
      fecha: new Date().toLocaleDateString('es-AR'),
      sku: prod.sku,
      tipo,
      cantidad: tipo === 'ingreso' ? cant : (tipo === 'egreso' ? -cant : cant),
      motivo: motivo || (tipo === 'ingreso' ? 'Compra a proveedor' : 'Ajuste'),
      remito,
      stockAntes,
      stockDespues: prod.stock
    }, state.catalogo);
    
    closeModal('stockMov');
  };

  const nuevoStock = tipo === 'ingreso' ? prod.stock + (parseInt(cantidad) || 0) :
    tipo === 'egreso' ? Math.max(0, prod.stock - (parseInt(cantidad) || 0)) :
    (parseInt(cantidad) || 0);

  return (
    <div className={`modal-overlay ${modals.stockMov ? 'active' : ''}`}>
      <div className="modal-box">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold">
            {tipo === 'ingreso' ? 'INGRESO DE STOCK' : 
             tipo === 'egreso' ? 'EGRESO DE STOCK' : 'AJUSTE DE INVENTARIO'}
          </span>
          <button onClick={() => closeModal('stockMov')} className="btn btn-outline btn-sm">✕</button>
        </div>
        <div className="p-4">
          <input type="hidden" value={stockMovData.sku || ''} />
          <div className="text-sm mb-1">{prod.nombre} ({prod.unidad})</div>
          <div className="text-xs text-muted mb-3">Stock actual: {prod.stock} unidades</div>
          
          <label className="text-xs text-muted font-semibold mb-1 block">Cantidad</label>
          <input
            type="number"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            className="mb-2"
          />
          
          <label className="text-xs text-muted font-semibold mb-1 block">Motivo</label>
          <select
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            className="mb-2 w-full"
          >
            {tipo === 'ingreso' ? (
              <>
                <option>Compra a proveedor</option>
                <option>Devolución</option>
                <option>Ajuste inventario</option>
                <option>Otro</option>
              </>
            ) : tipo === 'egreso' ? (
              <>
                <option>Venta</option>
                <option>Merma / vencimiento</option>
                <option>Rotura</option>
                <option>Ajuste inventario</option>
                <option>Otro</option>
              </>
            ) : (
              <>
                <option>Ajuste inventario</option>
                <option>Otro</option>
              </>
            )}
          </select>
          
          <label className="text-xs text-muted font-semibold mb-1 block">Nro. remito</label>
          <input
            type="text"
            value={remito}
            onChange={e => setRemito(e.target.value)}
            className="mb-2"
          />
          
          <label className="text-xs text-muted font-semibold mb-1 block">Observaciones</label>
          <input
            type="text"
            value={obs}
            onChange={e => setObs(e.target.value)}
            className="mb-3"
          />
          
          <div className="font-bold text-green-500 mb-3">Nuevo stock: {nuevoStock} unidades</div>
          
          <div className="flex gap-2 justify-end">
            <button onClick={() => closeModal('stockMov')} className="btn btn-outline">Cancelar</button>
            <button onClick={handleConfirm} className="btn btn-primary">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
