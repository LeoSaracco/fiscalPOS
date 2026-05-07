import { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

const STORAGE_KEY = 'fiscalpos_config';

const defaultConfig = {
  alicuotaIva: 21,
  tema: 'oscuro',
  moneda: 'ARS',
  imprimirAutomatico: true,
  abrirCajon: true,
  impresora: 'fiscal',
};

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config.alicuotaIva, config.tema, config.moneda, config.imprimirAutomatico, config.abrirCajon, config.impresora]);

  const updateConfig = (updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
}
