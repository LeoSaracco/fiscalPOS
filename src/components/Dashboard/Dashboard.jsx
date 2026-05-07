import { useCatalogo } from '../../context/CatalogoContext';
import { useVentas } from '../../context/VentasContext';
import { fmt } from '../../utils/format';

export default function Dashboard() {
  const { state: catalogoState } = useCatalogo();
  const { state: ventasState } = useVentas();

  const totalProductos = catalogoState.catalogo.length;
  const bajoStock = catalogoState.catalogo.filter(p => !p.esCombo && p.stock <= p.stockMin).length;
  const ventasHoy = ventasState.cierreZData.comprobantes;
  const totalHoy = ventasState.cierreZData.total;

  const stats = [
    {
      label: 'Productos',
      value: totalProductos,
      color: 'blue',
      icon: '📦',
    },
    {
      label: 'Bajo Stock',
      value: bajoStock,
      color: 'amber',
      icon: '⚠️',
    },
    {
      label: 'Ventas Hoy',
      value: ventasHoy,
      color: 'green',
      icon: '🧾',
    },
    {
      label: 'Total Hoy',
      value: fmt(totalHoy),
      color: 'green',
      icon: '💰',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
        <p className="text-text-secondary text-sm">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card hover:border-border-light transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`badge badge-${stat.color}`}>{stat.label}</span>
            </div>
            <div className={`text-3xl font-extrabold text-${stat.color}-500`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Ventas Recientes</h3>
          <div className="text-center py-8 text-text-secondary">
            <div className="text-4xl mb-3">📋</div>
            <p>No hay ventas registradas hoy</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Estado del Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Productos cargados</span>
              <span className="font-semibold">{totalProductos}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-text-secondary">Estado del stock</span>
              <span className={`font-semibold ${bajoStock > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                {bajoStock > 0 ? `${bajoStock} con bajo stock` : 'Óptimo'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-text-secondary">Comprobantes hoy</span>
              <span className="font-semibold">{ventasHoy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
