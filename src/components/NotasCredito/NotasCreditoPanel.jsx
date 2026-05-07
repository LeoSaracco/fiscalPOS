import { useVentas } from '../../context/VentasContext';
import { fmt } from '../../utils/format';
import { useState } from 'react';

export default function NotasCreditoPanel() {
  const { state, generarNC } = useVentas();
  const [facturaOrig, setFacturaOrig] = useState('');
  const [motivo, setMotivo] = useState('Devolución de mercadería');
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerar = async () => {
    if (!facturaOrig || !monto) return alert('Complete todos los campos');
    setLoading(true);
    await generarNC({ facturaOrig, motivo, monto: parseFloat(monto) });
    setLoading(false);
    setFacturaOrig('');
    setMonto('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Notas de Crédito</h2>
        <p className="text-text-secondary text-sm">Gestión de notas de crédito y devoluciones</p>
      </div>

      <div className="card bg-amber-500/10 border-amber-500/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-semibold mb-1">Requiere conexión con ARCA-WSFEv1</div>
            <p className="text-sm text-text-secondary">
              Las notas de crédito deben estar autorizadas por AFIP/ARCA para ser válidas.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Generar Nota de Crédito</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Número de Factura/Ticket original
            </label>
            <input
              type="text"
              value={facturaOrig}
              onChange={e => setFacturaOrig(e.target.value)}
              placeholder="Ej: 00000042"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Motivo
            </label>
            <select value={motivo} onChange={e => setMotivo(e.target.value)}>
              <option>Devolución de mercadería</option>
              <option>Error en facturación</option>
              <option>Descuento post-venta</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Monto
            </label>
            <input
              type="text"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              placeholder="$0,00"
            />
          </div>
          <button
            onClick={handleGenerar}
            disabled={loading}
            className="btn btn-primary w-full justify-center"
          >
            {loading ? 'Generando...' : 'Generar Nota de Crédito'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Historial de Notas de Crédito</h3>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Nro NC</th>
                <th>Factura Orig.</th>
                <th>Motivo</th>
                <th>Monto</th>
                <th>CAE</th>
              </tr>
            </thead>
            <tbody>
              {state.historialNC.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-text-secondary">
                    <div className="text-4xl mb-3">📝</div>
                    <p>No hay notas de crédito registradas</p>
                  </td>
                </tr>
              ) : (
                state.historialNC.map((nc, idx) => (
                  <tr key={idx} className="hover:bg-card2">
                    <td>{String(nc.nro).padStart(8, '0')}</td>
                    <td>{nc.facturaOrig}</td>
                    <td>{nc.motivo}</td>
                    <td className="font-bold">{fmt(nc.monto)}</td>
                    <td className="font-mono text-xs">{nc.cae}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
