import { useState, useEffect, useRef } from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import { useVentas } from '../../context/VentasContext';
import { fmt } from '../../utils/format';

export default function ProductSearch() {
  const [q, setQ] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { state } = useCatalogo();
  const { addItem } = useVentas();
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matches = q.trim()
    ? state.catalogo.filter(p =>
        !p.esCombo && (
          p.sku.toLowerCase().includes(q.toLowerCase()) ||
          p.nombre.toLowerCase().includes(q.toLowerCase())
        )
      ).slice(0, 8)
    : [];

  const handleSelect = (prod) => {
    addItem({
      sku: prod.sku,
      nombre: prod.nombre,
      precio: prod.precio,
      iva: prod.iva,
      cantidad: 1,
      esCombo: prod.esCombo,
      subItems: prod.subItems ? JSON.parse(JSON.stringify(prod.subItems)) : null
    });
    setQ('');
    setShowSuggestions(false);
  };

  const [libreData, setLibreData] = useState(null);
  const [libreDesc, setLibreDesc] = useState('');
  const [librePrecio, setLibrePrecio] = useState('');

  const addLibre = () => {
    setLibreData({ desc: '', precio: '' });
  };

  const handleLibreSave = () => {
    if (!libreDesc) return alert('Ingrese descripción');
    const precio = parseFloat(librePrecio) || 0;
    addItem({
      sku: null,
      nombre: libreDesc,
      precio,
      iva: 10.5,
      cantidad: 1,
      esCombo: false,
      subItems: null
    });
    setLibreData(null);
    setLibreDesc('');
    setLibrePrecio('');
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
        Buscar producto
      </label>
      <input
        type="text"
        value={q}
        onChange={e => { setQ(e.target.value); setShowSuggestions(true); }}
        placeholder="Escriba para buscar..."
      />
      {showSuggestions && matches.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg max-h-48 overflow-y-auto shadow-lg">
          {matches.map(p => (
            <div
              key={p.sku}
              onClick={() => handleSelect(p)}
              className="px-3 py-2 cursor-pointer hover:bg-card2 border-b border-border last:border-b-0 text-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{p.sku}</span>
                  <span className="text-text-secondary ml-1">{p.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-bold text-sm">{fmt(p.precio)}</span>
                  <span className="text-xs text-text-secondary">st: {p.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-2">
        <button onClick={addLibre} className="btn btn-outline btn-sm">+ tem libre</button>
        <button
          onClick={() => {
            const comboItems = state.catalogo.filter(p => p.esCombo);
            if (comboItems.length === 0) return alert('No hay combos definidos');
            alert('Selector de combos\nImplementar modal de selección de combos');
          }}
          className="btn btn-outline btn-sm"
        >+ Combo</button>
      </div>

      {libreData !== null && (
        <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && setLibreData(null)}>
          <div className="modal-box">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold">ÍTEM LIBRE</span>
              <button onClick={() => setLibreData(null)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <div className="p-4">
              <label className="text-xs text-muted font-semibold mb-1 block">Descripción*</label>
              <input
                type="text"
                value={libreDesc}
                onChange={e => setLibreDesc(e.target.value)}
                placeholder="Descripción del ítem"
                className="mb-2"
              />
              <label className="text-xs text-muted font-semibold mb-1 block">Precio* ($)</label>
              <input
                type="text"
                value={librePrecio}
                onChange={e => setLibrePrecio(e.target.value)}
                placeholder="0,00"
                className="mb-3"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setLibreData(null)} className="btn btn-outline">Cancelar</button>
                <button onClick={handleLibreSave} className="btn btn-primary">Agregar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
