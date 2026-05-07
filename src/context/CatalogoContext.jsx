import { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchCatalogo, createProducto, updateProducto, deleteProducto, postMovimientoStock } from '../data/api';
import { descontarStock } from '../utils/stockUtils';

const CatalogoContext = createContext();

const initialState = {
  catalogo: [],
  movimientos: [],
  loading: true,
};

function catalogoReducer(state, action) {
  switch (action.type) {
    case 'LOAD_CATALOGO':
      return { ...state, catalogo: action.payload, loading: false };
    case 'ADD_PRODUCTO':
      return { ...state, catalogo: [...state.catalogo, action.payload] };
    case 'EDIT_PRODUCTO':
      return {
        ...state,
        catalogo: state.catalogo.map(p =>
          p.sku === action.payload.sku ? action.payload : p
        )
      };
    case 'DELETE_PRODUCTO':
      return {
        ...state,
        catalogo: state.catalogo.filter(p => p.sku !== action.payload)
      };
    case 'ADD_MOVIMIENTO':
      const { movimiento, catalogo: newCatalogo } = action.payload;
      return {
        ...state,
        movimientos: [movimiento, ...state.movimientos],
        catalogo: newCatalogo
      };
    default:
      return state;
  }
}

export function CatalogoProvider({ children }) {
  const [state, dispatch] = useReducer(catalogoReducer, initialState);

  useEffect(() => {
    fetchCatalogo().then(data => {
      dispatch({ type: 'LOAD_CATALOGO', payload: data });
    });
  }, []);

  const addProducto = async (producto) => {
    const nuevo = await createProducto(producto);
    dispatch({ type: 'ADD_PRODUCTO', payload: nuevo });
  };

  const editProducto = async (sku, datos) => {
    const editado = await updateProducto(sku, datos);
    dispatch({ type: 'EDIT_PRODUCTO', payload: editado });
  };

  const removeProducto = async (sku) => {
    await deleteProducto(sku);
    dispatch({ type: 'DELETE_PRODUCTO', payload: sku });
  };

  const addMovimiento = async (movimiento, catalogo) => {
    const nuevoMov = await postMovimientoStock(movimiento);
    dispatch({
      type: 'ADD_MOVIMIENTO',
      payload: { movimiento: nuevoMov, catalogo }
    });
  };

  const descontarYActualizar = (itemsVenta) => {
    const catalogoActual = [...state.catalogo];
    descontarStock(itemsVenta, catalogoActual);
    catalogoActual.forEach(prod => {
      const original = state.catalogo.find(p => p.sku === prod.sku);
      if (original && original.stock !== prod.stock) {
        dispatch({ type: 'EDIT_PRODUCTO', payload: prod });
      }
    });
  };

  return (
    <CatalogoContext.Provider value={{
      state,
      addProducto,
      editProducto,
      removeProducto,
      addMovimiento,
      descontarYActualizar,
    }}>
      {children}
    </CatalogoContext.Provider>
  );
}

export function useCatalogo() {
  const context = useContext(CatalogoContext);
  if (!context) throw new Error('useCatalogo must be used within a CatalogoProvider');
  return context;
}
