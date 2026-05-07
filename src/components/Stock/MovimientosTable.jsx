import { useCatalogo } from '../../context/CatalogoContext';
import { fmt } from '../../utils/format';

export default function MovimientosTable() {
  const { state } = useCatalogo();

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="p-2 text-left text-xs text-muted uppercase">FECHA</th>
          <th className="p-2 text-left text-xs text-muted uppercase">PRODUCTO</th>
          <th className="p-2 text-left text-xs text-muted uppercase">TIPO</th>
          <th className="p-2 text-left text-xs text-muted uppercase">CANT</th>
          <th className="p-2 text-left text-xs text-muted uppercase">ANTES</th>
          <th className="p-2 text-left text-xs text-muted uppercase">DESPUÉS</th>
          <th className="p-2 text-left text-xs text-muted uppercase">MOTIVO</th>
        </tr>
      </thead>
      <tbody>
        {[...state.movimientos].reverse().map((m, idx) => {
          const prod = state.catalogo.find(p => p.sku === m.sku);
          return (
            <tr key={idx} className="hover:bg-card2">
              <td className="p-2">{m.fecha}</td>
              <td className="p-2">{prod ? prod.nombre : m.sku}</td>
              <td className="p-2">{m.tipo.toUpperCase()}</td>
              <td className="p-2">{m.cantidad > 0 ? '+' : ''}{m.cantidad}</td>
              <td className="p-2">{m.stockAntes}</td>
              <td className="p-2">{m.stockDespues}</td>
              <td className="p-2">{m.motivo}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
