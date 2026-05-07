import { useState } from 'react';
import { useVentas } from '../../context/VentasContext';
import { useCatalogo } from '../../context/CatalogoContext';
import { useUI } from '../../context/UIContext';
import { fmt, parse } from '../../utils/format';
import ProductSearch from './ProductSearch';
import ItemRow from './ItemRow';
import PaymentPanel from './PaymentPanel';

const TIPO_COMPROBANTE = ['Ticket', 'Factura B', 'Factura A', 'Factura C'];

export default function PosPanel() {
  const { state, toggleEmitir, setIva, setTipoComprobante, setConcepto, emitirTicket } = useVentas();
  const { state: catalogoState, descontarYActualizar } = useCatalogo();
  const { openModal } = useUI();

  const [inpCuit, setInpCuit] = useState('');
  const [inpRazon, setInpRazon] = useState('');
  const [inpCondIva, setInpCondIva] = useState('Consumidor Final');
  const [montoLibre, setMontoLibre] = useState('');

  const [printingState, setPrintingState] = useState('idle');
  const [printProgress, setPrintProgress] = useState(0);

  const total = state.itemsVenta.length > 0
    ? state.itemsVenta.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    : parse(montoLibre);

  const neto = state.alicuotaIva === 0 ? total : total / (1 + state.alicuotaIva / 100);
  const ivaVal = total - neto;

  const handleEmitir = async () => {
    if (total <= 0) return alert('Monto debe ser mayor a 0');
    if (!state.emitirComprobante) return alert('Comprobante deshabilitado');

    setPrintingState('connecting');
    setPrintProgress(0);

    await new Promise(resolve => setTimeout(resolve, 800));
    setPrintingState('printing');

    const printInterval = setInterval(() => {
      setPrintProgress(prev => {
        if (prev >= 100) {
          clearInterval(printInterval);
          setPrintingState('fiscal-auth');
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 3000));
    setPrintingState('done');

    const result = await emitirTicket({
      items: state.itemsVenta,
      total,
      recibido: state.recibido,
      medioPago: state.medioPago,
      tipoComprobante: state.tipoComprobante,
      cuit: inpCuit,
      razon: inpRazon,
      condIva: inpCondIva,
      alicuotaIva: state.alicuotaIva,
    });

    if (state.itemsVenta.length > 0 && descontarYActualizar) {
      descontarYActualizar(state.itemsVenta);
    }

    openModal('ticket', result);
    setPrintingState('idle');
    setPrintProgress(0);
    setMontoLibre('');
    setInpCuit('');
    setInpRazon('');
  };

  const IVA_OPTIONS = [
    { value: 21, label: '21%' },
    { value: 10.5, label: '10,5%' },
    { value: 0, label: 'Exento' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">Nueva Venta</h2>
              <p className="text-text-secondary text-sm">Seleccioná productos y emití el comprobante</p>
            </div>
            <span className={`badge ${state.emitirComprobante ? 'badge-green' : 'badge-amber'}`}>
              {state.emitirComprobante ? 'Fiscal ON' : 'Fiscal OFF'}
            </span>
          </div>

          {/* Tipo comprobante */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Tipo de Comprobante
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIPO_COMPROBANTE.map(tipo => (
                <button
                  key={tipo}
                  onClick={() => setTipoComprobante(tipo)}
                  className={`btn btn-sm ${state.tipoComprobante === tipo ? 'btn-primary' : 'btn-outline'}`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          {/* Concepto toggle */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Concepto
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Productos', 'Servicios', 'Ambos'].map(c => (
                <button
                  key={c}
                  onClick={() => setConcepto(c)}
                  className={`btn btn-sm ${state.concepto === c ? 'btn-primary' : 'btn-outline'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle emitir */}
          <div className="mb-4 bg-card2 rounded-lg p-3 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Emitir comprobante fiscal</div>
                <div className="text-xs text-text-secondary">
                  {state.emitirComprobante ? 'Se genera comprobante con CAE' : 'Venta sin comprobante fiscal'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  onClick={toggleEmitir}
                  className={`toggle ${state.emitirComprobante ? 'on' : ''}`}
                  role="switch"
                  aria-checked={state.emitirComprobante}
                  tabIndex={0}
                >
                  <div className="toggle-knob"></div>
                </div>
                <span className={`text-xs font-bold ${state.emitirComprobante ? 'text-green-500' : 'text-red-500'}`}>
                  {state.emitirComprobante ? 'SÍ' : 'NO'}
                </span>
              </div>
            </div>
          </div>

          {/* Datos del receptor */}
          <div className="mb-4 space-y-3">
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Datos del Cliente
            </label>
            <input
              type="text"
              value={inpCuit}
              onChange={e => setInpCuit(e.target.value)}
              placeholder="CUIT / DNI (Ej: 20-12345678-9)"
            />
            <input
              type="text"
              value={inpRazon}
              onChange={e => setInpRazon(e.target.value)}
              placeholder="Razón Social"
            />
          </div>

          {/* Buscador */}
          <div className="mb-4">
            <ProductSearch />
          </div>

          {/* Lista de items */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Items ({state.itemsVenta.length})</h3>
              {state.itemsVenta.length > 0 && (
                <span className="text-sm font-bold text-green-500">{fmt(total)}</span>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {state.itemsVenta.map((item, idx) => (
                <ItemRow key={idx} item={item} idx={idx} />
              ))}
              {state.itemsVenta.length === 0 && (
                <div className="text-center py-8 text-text-secondary text-sm">
                  No hay productos agregados
                </div>
              )}
            </div>
          </div>

          {/* Monto libre */}
          {state.itemsVenta.length === 0 && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Monto Libre
              </label>
              <input
                type="text"
                value={montoLibre}
                onChange={e => setMontoLibre(e.target.value)}
                placeholder="$0,00"
                className="text-xl font-bold"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <PaymentPanel total={total} neto={neto} ivaVal={ivaVal} onEmitir={handleEmitir} printingState={printingState} printProgress={printProgress} />
      </div>

      {/* Printer Simulation Overlay */}
      {printingState !== 'idle' && printingState !== 'done' && (
        <div className="modal-overlay">
          <div className="modal-box max-w-md">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-4">
                {printingState === 'connecting' && 'Conectando con Controlador Fiscal'}
                {printingState === 'printing' && 'Imprimiendo Ticket'}
                {printingState === 'fiscal-auth' && 'Autorizando con ARCA'}
              </h3>

              <div className="bg-card2 rounded-lg p-6 mb-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold">Hasar SMH/P-614F</span>
                  <div className="flex gap-2">
                    <div className={`w-3 h-3 rounded-full ${printingState !== 'idle' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${printingState === 'fiscal-auth' ? 'bg-amber-500 animate-pulse' : 'bg-gray-600'}`}></div>
                  </div>
                </div>

                {printingState === 'connecting' && (
                  <div className="py-8">
                    <div className="w-12 h-12 border-4 border-border border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-text-secondary">Estableciendo conexión con impresora...</p>
                  </div>
                )}

                {printingState === 'printing' && (
                  <div className="py-6">
                    <div className="w-full bg-card rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${printProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">Imprimiendo comprobante...</p>
                    <div className="text-xs text-text-secondary">{printProgress}%</div>
                    <div className="mt-4 text-xs text-text-secondary font-mono bg-card rounded p-2">
                      ━━━━━━━━━━━━━━━━━<br />
                      FISCALPOS · Ticket #{state.ticketNumero}<br />
                      ━━━━━━━━━━━━━━━━━<br />
                      <span className="animate-pulse">Imprimiendo líneas...</span>
                    </div>
                  </div>
                )}

                {printingState === 'fiscal-auth' && (
                  <div className="py-8">
                    <div className="text-4xl mb-3">&#x1f512;</div>
                    <p className="text-sm font-semibold mb-2">Solicitando CAE a ARCA</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                      WS FEv1 · Esperando respuesta...
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-text-secondary">
                {printingState === 'connecting' && 'Inicializando controlador fiscal...'}
                {printingState === 'printing' && 'No desconectar la impresora'}
                {printingState === 'fiscal-auth' && 'Verificando datos con AFIP...'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
