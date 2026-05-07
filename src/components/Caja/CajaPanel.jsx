import { useVentas } from '../../context/VentasContext';
import { useUI } from '../../context/UIContext';
import { fmt } from '../../utils/format';
import { useState } from 'react';

export default function CajaPanel() {
  const { state, cierreZ } = useVentas();
  const { openModal } = useUI();
  const [arqueo, setArqueo] = useState({});
  const [showArqueo, setShowArqueo] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Caja</h2>
        <p className="text-text-secondary text-sm">Resumen diario y cierres fiscales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-4">Resumen del Día</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-text-secondary">Comprobantes emitidos</span>
              <span className="font-bold">{state.cierreZData.comprobantes}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-text-secondary">Total facturado</span>
              <span className="font-bold text-green-500">{fmt(state.cierreZData.total)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-text-secondary">IVA 21%</span>
              <span className="font-bold">{fmt(state.cierreZData.iva21)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-text-secondary">IVA 10,5%</span>
              <span className="font-bold">{fmt(state.cierreZData.iva105)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Acciones de Caja</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                const ultimaVenta = state.historialVentas[0];
                if (ultimaVenta) openModal('ticket', ultimaVenta);
                else alert('No hay ventas para reimprimir');
              }}
              className="btn btn-secondary w-full justify-center"
            >
              🖨️ Reimprimir último ticket
            </button>
            <button
              onClick={() => alert('Cierre X: ' + fmt(state.cierreZData.total))}
              className="btn btn-outline w-full justify-center"
            >
              📄 Cierre X (parcial)
            </button>
            <button
              onClick={() => openModal('cierreZ')}
              className="btn btn-danger w-full justify-center"
            >
              🔒 Cierre Z (fiscal)
            </button>
            <button
              onClick={() => setShowArqueo(!showArqueo)}
              className="btn btn-outline w-full justify-center"
            >
              💰 Arqueo de billetes
            </button>
            <div className="text-xs text-text-secondary mt-2 bg-dim p-3 rounded-lg">
              El Cierre Z no se puede deshacer. Solicita autorización.
            </div>
          </div>
        </div>
      </div>

      {/* Arqueo de billetes */}
      {showArqueo && (
        <div className="card mt-4">
          <h3 className="font-semibold mb-4">Arqueo de Billetes</h3>
          <ArqueoBilletes arqueo={arqueo} setArqueo={setArqueo} />
        </div>
      )}
    </div>
  );
}

function ArqueoBilletes({ arqueo, setArqueo }) {
  const billetes = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
  const total = billetes.reduce((sum, b) => sum + (arqueo[b] || 0) * b, 0);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {billetes.map(b => (
          <div key={b} className="bg-card2 rounded p-2">
            <div className="text-xs text-text-secondary mb-1">${b}</div>
            <input
              type="number"
              min="0"
              value={arqueo[b] || ''}
              onChange={e => setArqueo(prev => ({ ...prev, [b]: parseInt(e.target.value) || 0 }))}
              className="w-full text-center font-bold"
              placeholder="0"
            />
            <div className="text-xs text-right mt-1">{(arqueo[b] || 0) * b}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border">
        <span className="font-semibold">Total arqueo:</span>
        <span className="text-2xl font-bold text-green-500">{fmt(total)}</span>
      </div>
    </div>
  );
}
