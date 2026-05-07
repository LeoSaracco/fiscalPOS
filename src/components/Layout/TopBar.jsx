import { useUI } from '../../context/UIContext';

const iconMap = {
  dashboard: '📊',
  pos: '🧾',
  productos: '📦',
  stock: '📊',
  caja: '💰',
  ventas: '📋',
  notascredito: '📝',
  importar: '📥',
  qr: '📱',
  fiscal: '🏛️',
  config: '⚙️',
  auditoria: '🔍',
};

export default function TopBar() {
  const { activeTab, setActiveTab } = useUI();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'pos', label: 'POS' },
    { id: 'productos', label: 'Productos' },
    { id: 'stock', label: 'Stock' },
    { id: 'caja', label: 'Caja' },
    { id: 'ventas', label: 'Ventas' },
    { id: 'notascredito', label: 'NC' },
    { id: 'importar', label: 'Importar' },
    { id: 'fiscal', label: 'Fiscal' },
    { id: 'config', label: 'Config' },
    { id: 'auditoria', label: 'Auditoría' },
  ];

  return (
    <header className="topbar">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="topbar-logo flex-shrink-0">FiscalPOS</div>
        <nav className="nav-tabs flex-1">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              title={tab.label}
            >
              <span className="text-base mr-1.5">{iconMap[tab.id]}</span>
              <span className="hidden lg:inline">{tab.label}</span>
            </div>
          ))}
        </nav>
      </div>
      <div className="topbar-info flex items-center gap-3 flex-shrink-0">
        <span className="badge badge-green text-xs">v1.0.0</span>
        <span className="topbar-clock text-sm">
          {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </header>
  );
}
