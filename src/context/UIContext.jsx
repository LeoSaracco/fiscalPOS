import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [activeTab, setActiveTab] = useState('pos');
  const [modals, setModals] = useState({
    ticket: false,
    cierreZ: false,
    producto: false,
    stockMov: false,
    selCombo: false,
  });
  const [editingProducto, setEditingProducto] = useState(null);
  const [stockMovData, setStockMovData] = useState({ sku: null, tipo: null });
  const [modalData, setModalData] = useState(null);

  const openModal = (name, data = null) => {
    if (name === 'producto') setEditingProducto(data);
    if (name === 'stockMov') setStockMovData(data);
    setModalData(data);
    setModals(prev => ({ ...prev, [name]: true }));
  };

  const closeModal = (name) => {
    if (name === 'producto') setEditingProducto(null);
    if (name === 'stockMov') setStockMovData({ sku: null, tipo: null });
    setModalData(null);
    setModals(prev => ({ ...prev, [name]: false }));
  };

  return (
    <UIContext.Provider value={{
      activeTab,
      setActiveTab,
      modals,
      modalData,
      openModal,
      closeModal,
      editingProducto,
      setEditingProducto,
      stockMovData,
      setStockMovData,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
}
