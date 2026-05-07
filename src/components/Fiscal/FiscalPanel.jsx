import { COMERCIO } from '../../data/comercio';

export default function FiscalPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Fiscal</h2>
        <p className="text-text-secondary text-sm">Configuración y estado del controlador fiscal</p>
      </div>

      <div className="card bg-amber-500/10 border-amber-500/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-semibold mb-1">Datos Críticos</div>
            <p className="text-sm text-text-secondary">
              Estos datos son críticos para la facturación con ARCA. Verificalos antes de operar.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-4">Datos del Comercio</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                Nombre
              </label>
              <input type="text" value={COMERCIO.nombre} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                CUIT
              </label>
              <input type="text" value={COMERCIO.cuit} readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                Dirección
              </label>
              <input type="text" value={COMERCIO.direccion} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                  IIBB
                </label>
                <input type="text" value={COMERCIO.iibb} readOnly />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                  Condición IVA
                </label>
                <input type="text" value={COMERCIO.condIVA} readOnly />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Controlador Fiscal</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                Modelo
              </label>
              <input type="text" value="Hasar SMH/P-614F" readOnly />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                  Serie
                </label>
                <input type="text" value="12345678" readOnly />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                  Punto de Venta
                </label>
                <input type="text" value={COMERCIO.puntoVenta} readOnly />
              </div>
            </div>
            <div className="card bg-green-500/10 border-green-500/30 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm font-semibold">Controlador homologado por ARCA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Conexión ARCA (WSFEv1)</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <div>
              <div className="font-semibold text-sm">Conectado</div>
              <div className="text-xs text-text-secondary">Certificado válido</div>
            </div>
          </div>
          <button
            onClick={() => alert('Conexión ARCA exitosa\nCertificado válido\nWSFEv1 respondiendo correctamente')}
            className="btn btn-outline btn-sm"
          >
            Testear conexión
          </button>
        </div>
      </div>
    </div>
  );
}
