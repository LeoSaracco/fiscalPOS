export default function AuditoriaPanel() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">🔍 Auditoría</h2>
      
      <div className="alert-yellow mb-4">
        ⚠ Solo usuarios con perfil <strong>Admin</strong> pueden acceder a esta sección
      </div>
      
      <div className="card mb-4">
        <div className="font-bold mb-3">Filtros</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-muted font-semibold mb-1 block">Desde</label>
            <input type="date" className="w-full" id="audit-desde" />
          </div>
          <div>
            <label className="text-xs text-muted font-semibold mb-1 block">Hasta</label>
            <input type="date" className="w-full" id="audit-hasta" />
          </div>
          <div>
            <label className="text-xs text-muted font-semibold mb-1 block">Tipo</label>
            <select className="w-full" id="audit-tipo">
              <option value="todos">Todos</option>
              <option value="venta">Venta</option>
              <option value="stock">Stock</option>
              <option value="login">Login</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            const desde = document.getElementById('audit-desde')?.value;
            const hasta = document.getElementById('audit-hasta')?.value;
            const tipo = document.getElementById('audit-tipo')?.value;
            alert(`Búsqueda de auditoría:\nDesde: ${desde || 'N/A'}\nHasta: ${hasta || 'N/A'}\nTipo: ${tipo || 'todos'}\n\n(Función en desarrollo)`);
          }}
          className="btn btn-primary w-full mt-3"
        >🔍 Buscar</button>
      </div>
      
      <div className="card p-0 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                No hay registros de auditoría
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
