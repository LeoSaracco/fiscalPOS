import { useUI } from '../../context/UIContext';

  const tabs = [
    { id: 'pos', icon: '🧾', label: 'POS' },
    { id: 'productos', icon: '📦', label: 'Productos' },
    { id: 'stock', icon: '📊', label: 'Stock' },
    { id: 'ventas', icon: '🧾', label: 'Ventas' },
    { id: 'caja', icon: '💰', label: 'Caja' },
    { id: 'notascredito', icon: '📝', label: 'NC' },
    { id: 'importar', icon: '📥', label: 'Importar' },
    { id: 'fiscal', icon: '🏛️', label: 'Fiscal' },
    { id: 'config', icon: '⚙️', label: 'Config' },
  ];

function BottomNav() {
  const { activeTab, setActiveTab } = useUI();

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`bottom-tab ${isActive ? 'active' : ''}`}
            aria-label={tab.label}
          >
            <span className="bottom-tab-icon">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
