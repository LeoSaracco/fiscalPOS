import { createContext, useContext, useReducer, useEffect } from 'react';
import { emitirTicket as emitirTicketAPI, fetchCierreZ } from '../data/api';
import { useConfig } from './ConfigContext';
import { randCAE } from '../utils/format';

const VentasContext = createContext();

function createInitialState(alicuotaIva) {
  return {
    itemsVenta: [],
    medioPago: 'Efectivo',
    alicuotaIva,
    tipoComprobante: 'Ticket',
    concepto: 'Productos',
    emitirComprobante: true,
    cierreZData: { comprobantes: 0, total: 0, iva21: 0, iva105: 0 },
    ticketNumero: 1,
    recibido: 0,
    historialVentas: [],
    historialNC: [],
    ncNumero: 1,
  };
}

function ventasReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, itemsVenta: [...state.itemsVenta, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, itemsVenta: state.itemsVenta.filter((_, idx) => idx !== action.payload) };
    case 'UPDATE_ITEM_CANT':
      const newItems = [...state.itemsVenta];
      newItems[action.payload.idx].cantidad = Math.max(1, newItems[action.payload.idx].cantidad + action.payload.delta);
      return { ...state, itemsVenta: newItems };
    case 'CLEAR_ITEMS':
      return { ...state, itemsVenta: [] };
    case 'SET_MEDIO_PAGO':
      return { ...state, medioPago: action.payload };
    case 'SET_IVA':
      return { ...state, alicuotaIva: action.payload };
    case 'SET_TIPO_COMPROBANTE':
      return { ...state, tipoComprobante: action.payload };
    case 'SET_CONCEPTO':
      return { ...state, concepto: action.payload };
    case 'TOGGLE_EMITIR':
      return { ...state, emitirComprobante: !state.emitirComprobante };
    case 'SET_RECIBIDO':
      return { ...state, recibido: action.payload };
    case 'EMITIR_TICKET':
      const nuevaVenta = {
        nro: state.ticketNumero,
        fecha: new Date().toISOString(),
        tipo: action.payload.tipoComprobante,
        total: action.payload.total,
        medioPago: action.payload.medioPago,
        cae: action.payload.cae,
        items: action.payload.items,
      };
      return {
        ...state,
        ticketNumero: state.ticketNumero + 1,
        itemsVenta: [],
        recibido: 0,
        historialVentas: [nuevaVenta, ...state.historialVentas],
        cierreZData: {
          ...state.cierreZData,
          comprobantes: state.cierreZData.comprobantes + 1,
          total: state.cierreZData.total + action.payload.total,
          [action.payload.iva === 21 ? 'iva21' : 'iva105']:
            state.cierreZData[action.payload.iva === 21 ? 'iva21' : 'iva105'] +
            action.payload.total - (action.payload.total / (1 + action.payload.iva / 100))
        }
      };
    case 'CIERRE_Z':
      return { ...state, cierreZData: { comprobantes: 0, total: 0, iva21: 0, iva105: 0 } };
    case 'GENERAR_NC':
      const nuevaNC = {
        nro: state.ncNumero,
        fecha: new Date().toISOString(),
        facturaOrig: action.payload.facturaOrig,
        motivo: action.payload.motivo,
        monto: action.payload.monto,
        cae: action.payload.cae,
      };
      return {
        ...state,
        ncNumero: state.ncNumero + 1,
        historialNC: [nuevaNC, ...state.historialNC],
      };
    case 'SET_ALICUOTA_IVA':
      return { ...state, alicuotaIva: action.payload };
    default:
      return state;
  }
}

export function VentasProvider({ children }) {
  const { config } = useConfig();
  const [state, dispatch] = useReducer(ventasReducer, createInitialState(config.alicuotaIva));

  useEffect(() => {
    if (config.alicuotaIva !== undefined) {
      dispatch({ type: 'SET_ALICUOTA_IVA', payload: config.alicuotaIva });
    }
  }, [config.alicuotaIva]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (idx) => dispatch({ type: 'REMOVE_ITEM', payload: idx });
  const updateItemCant = (idx, delta) => dispatch({ type: 'UPDATE_ITEM_CANT', payload: { idx, delta } });
  const clearItems = () => dispatch({ type: 'CLEAR_ITEMS' });
  const setMedioPago = (pago) => dispatch({ type: 'SET_MEDIO_PAGO', payload: pago });
  const setIva = (iva) => dispatch({ type: 'SET_IVA', payload: iva });
  const setTipoComprobante = (tipo) => dispatch({ type: 'SET_TIPO_COMPROBANTE', payload: tipo });
  const setConcepto = (concepto) => dispatch({ type: 'SET_CONCEPTO', payload: concepto });
  const toggleEmitir = () => dispatch({ type: 'TOGGLE_EMITIR' });
  const setRecibido = (val) => dispatch({ type: 'SET_RECIBIDO', payload: val });

  const emitirTicket = async (ticketData) => {
    const result = await emitirTicketAPI(ticketData);
    const extraData = {
      walletName: ticketData.medioPago,
      txId: `pi_${Math.random().toString(36).slice(2, 14)}`,
    };
    const merged = { ...ticketData, ...result, ticketNumero: state.ticketNumero };
    dispatch({ type: 'EMITIR_TICKET', payload: merged });
    return { ...merged, ...extraData };
  };

  const cierreZ = () => {
    dispatch({ type: 'CIERRE_Z' });
    return { ...state.cierreZData, fecha: new Date().toISOString() };
  };

  const generarNC = async ({ facturaOrig, motivo, monto }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const cae = randCAE();
    const payload = { facturaOrig, motivo, monto, cae };
    dispatch({ type: 'GENERAR_NC', payload });
    return { ...payload, cae };
  };

  return (
    <VentasContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateItemCant,
      clearItems,
      setMedioPago,
      setIva,
      setTipoComprobante,
      setConcepto,
      toggleEmitir,
      setRecibido,
      emitirTicket,
      cierreZ,
      generarNC,
    }}>
      {children}
    </VentasContext.Provider>
  );
}

export function useVentas() {
  const context = useContext(VentasContext);
  if (!context) throw new Error('useVentas must be used within a VentasProvider');
  return context;
}
