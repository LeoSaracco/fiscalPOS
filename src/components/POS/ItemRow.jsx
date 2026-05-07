import { useVentas } from '../../context/VentasContext';
import { fmt } from '../../utils/format';

export default function ItemRow({ item, idx }) {
  const { removeItem, updateItemCant } = useVentas();

  return (
    <div className="flex items-center gap-2 py-2 border-b border-border last:border-b-0 text-sm">
      <div className="flex-1 min-w-0">
        <strong className="truncate block">{item.nombre}</strong>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => updateItemCant(idx, -1)}
          className="w-7 h-7 rounded border border-border bg-card2 text-text flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors"
        >
          −
        </button>
        <span className="inline-block w-6 text-center font-semibold">{item.cantidad}</span>
        <button
          onClick={() => updateItemCant(idx, 1)}
          className="w-7 h-7 rounded border border-border bg-card2 text-text flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors"
        >
          +
        </button>
      </div>

      <div className="min-w-[50px] sm:min-w-[70px] text-right text-text-secondary flex-shrink-0">{fmt(item.precio)}</div>
      <div className="min-w-[50px] sm:min-w-[70px] text-right font-bold flex-shrink-0">{fmt(item.precio * item.cantidad)}</div>

      <button
        onClick={() => removeItem(idx)}
        className="w-7 h-7 rounded flex items-center justify-center text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
