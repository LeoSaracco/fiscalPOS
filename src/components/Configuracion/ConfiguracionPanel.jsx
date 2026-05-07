import { useConfig } from '../../context/ConfigContext';

const IVA_OPTIONS = [
  { value: 21, label: '21%' },
  { value: 10.5, label: '10,5%' },
  { value: 0, label: 'Exento' },
];

export default function ConfiguracionPanel() {
  const { config, updateConfig } = useConfig();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Configuración</h2>
        <p className="text-text-secondary text-sm">Ajustes del sistema y preferencias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IVA por defecto */}
        <div className="card">
          <h3 className="font-semibold mb-4">Alícuota de IVA</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                IVA por defecto en ventas
              </label>
              <div className="flex gap-2">
                {IVA_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateConfig({ alicuotaIva: opt.value })}
                    className={`btn btn-sm flex-1 ${config.alicuotaIva === opt.value ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-text-secondary bg-card2 rounded p-2 border border-border">
              Este valor se aplicará automáticamente al crear nuevas ventas. Podés cambiarlo desde el panel POS si es necesario.
            </div>
          </div>
        </div>

        {/* Interfaz */}
        <div className="card">
          <h3 className="font-semibold mb-4">Interfaz</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Tema
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateConfig({ tema: 'oscuro' })}
                  className={`btn btn-sm ${config.tema === 'oscuro' ? 'btn-primary' : 'btn-outline'}`}
                >Oscuro</button>
                <button
                  onClick={() => updateConfig({ tema: 'claro' })}
                  className={`btn btn-sm ${config.tema === 'claro' ? 'btn-primary' : 'btn-outline'}`}
                >Claro</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Moneda
              </label>
              <select
                value={config.moneda}
                onChange={e => updateConfig({ moneda: e.target.value })}
              >
                <option value="ARS">$ ARS - Peso Argentino</option>
                <option value="USD">USD - Dólar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Impresión */}
        <div className="card">
          <h3 className="font-semibold mb-4">Impresión</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium text-sm">Imprimir ticket automático</div>
                <div className="text-xs text-text-secondary">Al emitir una venta</div>
              </div>
              <div
                onClick={() => updateConfig({ imprimirAutomatico: !config.imprimirAutomatico })}
                className={`toggle ${config.imprimirAutomatico ? 'on' : ''}`}
                role="switch"
                aria-checked={config.imprimirAutomatico}
                tabIndex={0}
              >
                <div className="toggle-knob"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <div className="font-medium text-sm">Abrir cajón monedas</div>
                <div className="text-xs text-text-secondary">Al completar venta</div>
              </div>
              <div
                onClick={() => updateConfig({ abrirCajon: !config.abrirCajon })}
                className={`toggle ${config.abrirCajon ? 'on' : ''}`}
                role="switch"
                aria-checked={config.abrirCajon}
                tabIndex={0}
              >
                <div className="toggle-knob"></div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Impresora
              </label>
              <select
                value={config.impresora}
                onChange={e => updateConfig({ impresora: e.target.value })}
              >
                <option value="fiscal">Hasar SMH/P-614F (Fiscal)</option>
                <option value="termica">Impresora térmica genérica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="card">
          <h3 className="font-semibold mb-4">Seguridad</h3>
          <div className="space-y-2">
            <button
              onClick={() => alert('Funcionalidad de cambio de PIN\nImplementar con validator + localStorage')}
              className="btn btn-outline w-full justify-center"
            >
              Cambiar PIN
            </button>
            <button
              onClick={() => alert('Gestión de usuarios\nImplementar con roles + permissions')}
              className="btn btn-outline w-full justify-center"
            >
              Gestionar usuarios
            </button>
            <button
              onClick={() => {
                const data = { exportDate: new Date().toISOString(), version: '1.0.0' };
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'fiscalpos_backup.json';
                a.click();
              }}
              className="btn btn-outline w-full justify-center"
            >
              Exportar datos
            </button>
          </div>
        </div>

        {/* Acerca de */}
        <div className="card md:col-span-2">
          <h3 className="font-semibold mb-4">Acerca de</h3>
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex justify-between">
              <span>Versión</span>
              <span className="text-text font-medium">FiscalPOS v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span className="text-text font-medium">{new Date().toISOString().split('T')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>Tecnología</span>
              <span className="text-text font-medium">React + Vite + Tailwind</span>
            </div>
            <div className="pt-3">
              <button className="btn btn-outline btn-sm w-full justify-center">
                Buscar actualizaciones
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
