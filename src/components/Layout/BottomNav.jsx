import { useUI } from '../../context/UIContext';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useUI();

  const tabs = [
    { id: 'pos', icon: '🧾', label: 'POS' },
    { id: 'productos', icon: '📦', label: 'Prod' },
    { id: 'ventas', icon: '📋', label: 'Ventas' },
    { id: 'caja', icon: '💰', label: 'Caja' },
    { id: 'config', icon: '⚙️', label: 'Config' },
  ];

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
