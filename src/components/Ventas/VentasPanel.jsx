import { useVentas } from '../../context/VentasContext';
import { useUI } from '../../context/UIContext';
import { fmt } from '../../utils/format';

export default function VentasPanel() {
  const { state, emitirTicket } = useVentas();
  const { openModal } = useUI();

  const handleVerTicket = (venta) => {
    openModal('ticket', venta);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Ventas</h2>
        <p className="text-text-secondary text-sm">Historial de comprobantes emitidos</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Comprobantes Emitidos</h3>
          <span className="badge badge-blue">
            {state.historialVentas.length} comprobantes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Nro</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Total</th>
                <th>Medio Pago</th>
                <th>CAE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.historialVentas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-text-secondary">
                    <div className="text-4xl mb-3">🧾</div>
                    <p>No hay ventas registradas</p>
                  </td>
                </tr>
              ) : (
                state.historialVentas.map((venta, idx) => (
                  <tr key={idx} className="hover:bg-card2">
                    <td>{String(venta.nro).padStart(8, '0')}</td>
                    <td>{new Date(venta.fecha).toLocaleDateString('es-AR')}</td>
                    <td>{venta.tipo}</td>
                    <td className="font-bold">{fmt(venta.total)}</td>
                    <td>{venta.medioPago}</td>
                    <td className="font-mono text-xs">{venta.cae || '-'}</td>
                    <td>
                      <button
                        onClick={() => handleVerTicket(venta)}
                        className="btn btn-outline btn-sm"
                      >
                        Ver
                      </button>
                    </td>
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
