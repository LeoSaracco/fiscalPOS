import { useState, useEffect } from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import { fmt } from '../../utils/format';

export default function ProductoModal({ producto, onSave, onClose, categorias }) {
  const { state } = useCatalogo();
  const [sku, setSku] = useState('');
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('Congelados');
  const [precio, setPrecio] = useState('');
  const [iva, setIva] = useState('10.5');
  const [tipo, setTipo] = useState('simple');
  const [stock, setStock] = useState('');
  const [stockMin, setStockMin] = useState('');
  const [unidad, setUnidad] = useState('unidad');
  const [comboItems, setComboItems] = useState([]);
  const [searchCombo, setSearchCombo] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (producto) {
      setSku(producto.sku || '');
      setNombre(producto.nombre || '');
      setCategoria(producto.categoria || 'Congelados');
      setPrecio(producto.precio?.toString() || '');
      setIva(producto.iva?.toString() || '10.5');
      setTipo(producto.esCombo ? 'combo' : 'simple');
      setStock(producto.stock?.toString() || '');
      setStockMin(producto.stockMin?.toString() || '');
      setUnidad(producto.unidad || 'unidad');
      setComboItems(producto.subItems ? JSON.parse(JSON.stringify(producto.subItems)) : []);
    } else {
      const prefix = tipo === 'combo' ? 'COM' : 'ALI';
      const existing = state.catalogo.filter(p => p.sku.startsWith(prefix)).length;
      setSku(`${prefix}-${(existing + 1).toString().padStart(3, '0')}`);
    }
  }, [producto, tipo]);

  const productosSimples = state.catalogo.filter(p => !p.esCombo);

  const matches = searchCombo.trim()
    ? productosSimples.filter(p =>
        p.sku.toLowerCase().includes(searchCombo.toLowerCase()) ||
        p.nombre.toLowerCase().includes(searchCombo.toLowerCase())
      ).slice(0, 6)
    : [];

  const addToCombo = (prod) => {
    setComboItems(prev => [...prev, { sku: prod.sku, nombre: prod.nombre, cantidad: 1 }]);
    setSearchCombo('');
    setShowSuggestions(false);
  };

  const updateComboCant = (idx, delta) => {
    setComboItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item
    ));
  };

  const removeComboItem = (idx) => {
    setComboItems(prev => prev.filter((_, i) => i !== idx));
  };

  const sumaComponentes = comboItems.reduce((sum, item) => {
    const prod = state.catalogo.find(p => p.sku === item.sku);
    return sum + (prod ? prod.precio * item.cantidad : 0);
  }, 0);

  const precioNum = parseFloat(precio) || 0;
  const ahorro = sumaComponentes - precioNum;
  const ahorroPct = sumaComponentes > 0 ? Math.round((ahorro / sumaComponentes) * 100) : 0;

  const handleSave = () => {
    if (!sku || !nombre || !precio) return alert('Complete los campos obligatorios');

    const data = {
      sku,
      nombre,
      categoria,
      precio: parseFloat(precio),
      iva: parseFloat(iva),
      esCombo: tipo === 'combo',
      unidad: tipo === 'simple' ? unidad : 'unidad',
      stock: tipo === 'simple' ? parseInt(stock) || 0 : 0,
      stockMin: tipo === 'simple' ? parseInt(stockMin) || 0 : 5,
    };

    if (tipo === 'combo') {
      data.subItems = comboItems;
    }

    onSave(data);
  };

  return (
    <div className={`modal-overlay ${producto ? 'active' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold">{producto ? 'EDITAR' : 'NUEVO'} {tipo === 'combo' ? 'COMBO / PROMO' : 'PRODUCTO'}</span>
          <button onClick={onClose} className="btn btn-outline btn-sm">✕</button>
        </div>
        <div className="p-4">
          <input type="hidden" value={producto?.sku || ''} />

          <label className="text-xs text-muted font-semibold mb-1 block">SKU*</label>
          <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="mb-2" />

          <label className="text-xs text-muted font-semibold mb-1 block">Descripción*</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="mb-2" />

          <label className="text-xs text-muted font-semibold mb-1 block">Categoría</label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)} className="mb-2">
            {categorias.map(cat => <option key={cat}>{cat}</option>)}
            <option>Otros</option>
          </select>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-xs text-muted font-semibold mb-1 block">Precio* ($ con IVA)</label>
              <input type="text" value={precio} onChange={e => setPrecio(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted font-semibold mb-1 block">Alícuota IVA</label>
              <select value={iva} onChange={e => setIva(e.target.value)}>
                <option value="21">21%</option>
                <option value="10.5">10,5%</option>
                <option value="0">Exento</option>
              </select>
            </div>
          </div>

          <label className="text-xs text-muted font-semibold mb-1 block">Tipo</label>
          <div className="flex gap-3 mb-3">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="tipoProd" checked={tipo === 'simple'} onChange={() => setTipo('simple')} />
              Producto simple
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="tipoProd" checked={tipo === 'combo'} onChange={() => setTipo('combo')} />
              Combo
            </label>
          </div>

          {tipo === 'simple' ? (
            <div>
              <div className="font-bold text-sm mb-2">STOCK</div>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="text-xs text-muted font-semibold mb-1 block">Stock actual*</label>
                  <input type="number" value={stock} onChange={e => setStock(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted font-semibold mb-1 block">Stock mínimo</label>
                  <input type="number" value={stockMin} onChange={e => setStockMin(e.target.value)} />
                </div>
              </div>
              <label className="text-xs text-muted font-semibold mb-1 block">Unidad medida</label>
              <select value={unidad} onChange={e => setUnidad(e.target.value)} className="mb-2">
                <option value="unidad">unidad</option>
                <option value="kg">kg</option>
                <option value="litro">litro</option>
                <option value="pack">pack</option>
              </select>
            </div>
          ) : (
            <div>
              <div className="font-bold text-sm mb-2">COMPONENTES DEL COMBO</div>
              <div className="mb-2 relative">
                <input
                  type="text"
                  placeholder="Buscar producto para agregar..."
                  value={searchCombo}
                  onChange={e => { setSearchCombo(e.target.value); setShowSuggestions(true); }}
                  className="mb-1"
                />
                {showSuggestions && matches.length > 0 && (
                  <div className="bg-card2 border border-border rounded-lg max-h-32 overflow-y-auto absolute z-10 w-full">
                    {matches.map(p => (
                      <div
                        key={p.sku}
                        onClick={() => addToCombo(p)}
                        className="p-2 cursor-pointer hover:bg-dim text-sm border-b border-border"
                      >
                        <strong>{p.sku}</strong> {p.nombre}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div id="comboItems" className="mb-2">
                {comboItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs mb-1">
                    <span className="flex-1">✓ {item.nombre}</span>
                    <button onClick={() => updateComboCant(idx, -1)} className="w-5 h-5 border border-border bg-card2 rounded">−</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => updateComboCant(idx, 1)} className="w-5 h-5 border border-border bg-card2 rounded">+</button>
                    <span>{fmt((state.catalogo.find(p => p.sku === item.sku)?.precio || 0) * item.cantidad)}</span>
                    <button onClick={() => removeComboItem(idx)} className="text-red-500 bg-none border-none cursor-pointer">✕</button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted">
                <div>Precio suma componentes: <span id="comboSuma">{fmt(sumaComponentes)}</span></div>
                <div>Ahorro del combo: <span className="text-green-500">{fmt(ahorro)} ({ahorroPct}%)</span></div>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end mt-4">
            <button onClick={onClose} className="btn btn-outline">Cancelar</button>
            <button onClick={handleSave} className="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
