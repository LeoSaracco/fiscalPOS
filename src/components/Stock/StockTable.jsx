import { estadoStock, getStockClass, getStockLabel } from '../../utils/stockUtils';
import { fmt } from '../../utils/format';
import { useCatalogo } from '../../context/CatalogoContext';

export default function StockTable({ onAjustar }) {
  const { state } = useCatalogo();

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="p-2 text-left text-xs text-muted uppercase">PRODUCTO</th>
          <th className="p-2 text-left text-xs text-muted uppercase">SKU</th>
          <th className="p-2 text-left text-xs text-muted uppercase">STOCK</th>
          <th className="p-2 text-left text-xs text-muted uppercase">MÍN</th>
          <th className="p-2 text-left text-xs text-muted uppercase">ESTADO</th>
          <th className="p-2 text-left text-xs text-muted uppercase">AJUSTAR</th>
        </tr>
      </thead>
      <tbody>
        {state.catalogo.map(p => {
          const es = estadoStock(p);
          const cls = getStockClass(es);
          const label = getStockLabel(es);
          return (
            <tr key={p.sku} className="hover:bg-card2">
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.sku}</td>
              <td className={`p-2 ${cls}`}>{p.esCombo ? '—' : p.stock}</td>
              <td className="p-2">{p.esCombo ? '—' : p.stockMin}</td>
              <td className={`p-2 ${cls}`}>{label}</td>
              <td className="p-2">
                {p.esCombo ? (
                  <span className="text-xs text-muted">auto</span>
                ) : (
                  <div className="flex gap-1">
                    <button onClick={() => onAjustar(p.sku, 'ingreso')} className="btn btn-outline btn-sm">[+]</button>
                    <button onClick={() => onAjustar(p.sku, 'egreso')} className="btn btn-outline btn-sm">[-]</button>
                    <button onClick={() => onAjustar(p.sku, 'ajuste')} className="btn btn-outline btn-sm">[=]</button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
