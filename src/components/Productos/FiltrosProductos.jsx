export default function FiltrosProductos({ filtros, setFiltros, categorias }) {
  return (
    <div className="card p-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted font-semibold mb-1 block">Buscar</label>
          <input
            type="text"
            value={filtros.q}
            onChange={e => setFiltros(prev => ({ ...prev, q: e.target.value }))}
            placeholder="SKU o nombre..."
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-muted font-semibold mb-1 block">Categoría</label>
          <select
            value={filtros.categoria}
            onChange={e => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
            className="w-full"
          >
            <option value="">Todos</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted font-semibold mb-1 block">Tipo</label>
          <select
            value={filtros.tipo}
            onChange={e => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
            className="w-full"
          >
            <option value="">Todos</option>
            <option value="simple">Producto simple</option>
            <option value="combo">Combo/Promo</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted font-semibold mb-1 block">Stock</label>
          <select
            value={filtros.stock}
            onChange={e => setFiltros(prev => ({ ...prev, stock: e.target.value }))}
            className="w-full"
          >
            <option value="">Todos</option>
            <option value="ok">Stock OK</option>
            <option value="bajo">Stock bajo</option>
            <option value="vacio">Sin stock</option>
          </select>
        </div>
      </div>
    </div>
  );
}
