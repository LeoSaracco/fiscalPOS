import { useState, useEffect } from 'react';
import { useVentas } from '../../context/VentasContext';
import { fmt, parse } from '../../utils/format';

const MEDIOS_PAGO = [
  { id: 'Efectivo', icon: '💵' },
  { id: 'Débito', icon: '💳' },
  { id: 'Crédito', icon: '💳' },
  { id: 'QR/MP', icon: '📱' },
];

export default function PaymentPanel({ total, neto, ivaVal, onEmitir, printingState, printProgress }) {
  const { state, setMedioPago, setRecibido, cierreZ, clearItems } = useVentas();
  const [recibidoInput, setRecibidoInput] = useState('');
  
  const recibido = parse(recibidoInput);
  const vuelto = recibido > total ? recibido - total : 0;
  
  useEffect(() => {
    setRecibido(parse(recibidoInput));
  }, [recibidoInput, setRecibido]);
  
  const isPrinting = printingState && printingState !== 'idle' && printingState !== 'done';
  
  const handleLimpiar = () => {
    clearItems();
    setRecibidoInput('');
  };

  return (
    <div className="card">
      <h3 className="font-bold mb-4">Cobro y Emisión</h3>
      
      {/* Medio de pago */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Medio de pago
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MEDIOS_PAGO.map(pago => (
            <button
              key={pago.id}
              onClick={() => setMedioPago(pago.id)}
              className={`btn btn-sm ${state.medioPago === pago.id ? 'btn-primary' : 'btn-outline'}`}
            >
              {pago.icon} {pago.id}
            </button>
          ))}
        </div>
      </div>

      {/* Campos efectivo */}
      {state.medioPago === 'Efectivo' && (
        <div className="mb-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
              Importe Recibido $
            </label>
            <input
              type="text"
              value={recibidoInput}
              onChange={e => setRecibidoInput(e.target.value)}
              placeholder="$0,00"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
              Vuelto $
            </label>
            <input
              type="text"
              value={vuelto > 0 ? fmt(vuelto) : ''}
              readOnly
              className="text-green-500 font-bold"
            />
          </div>
        </div>
      )}

      {/* Resumen fiscal */}
      <div className="mb-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Neto gravado</span>
            <span>{fmt(neto)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">IVA {state.alicuotaIva}%</span>
            <span>{fmt(ivaVal)}</span>
          </div>
          {recibido > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Recibido</span>
              <span>{fmt(recibido)}</span>
            </div>
          )}
          {vuelto > 0 && (
            <div className="flex justify-between text-sm text-green-500">
              <span>Vuelto</span>
              <span>{fmt(vuelto)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-base">TOTAL</span>
              <span className="font-extrabold text-xl text-green-500">{fmt(total)}</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-text-secondary mt-2 bg-card2 rounded px-2 py-1.5 border border-border">
          IVA {state.alicuotaIva}% configurado en <span className="text-blue-500 cursor-pointer">Configuración</span>
        </div>
      </div>

      {/* Controlador Fiscal */}
      <div className="mb-4 bg-card2 rounded-lg p-3 border border-border">
        <div className="text-xs font-semibold mb-2">Controlador Fiscal</div>
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Hasar SMH/P-614F</span>
          <span>COM3</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">Papel:</span>
          <span className={printingState === 'printing' ? 'text-amber-500 font-semibold animate-pulse' : 'text-green-500 font-semibold'}>
            {printingState === 'printing' ? 'IMPRIMIENDO' : 'OK'}
          </span>
        </div>
      </div>

      {/* Botón emitir */}
      <button
        onClick={onEmitir}
        disabled={total <= 0 || !state.emitirComprobante || isPrinting}
        className="btn btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPrinting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {printingState === 'connecting' && 'Conectando...'}
            {printingState === 'printing' && `Imprimiendo ${printProgress}%`}
            {printingState === 'fiscal-auth' && 'Autorizando...'}
          </span>
        ) : (
          'Emitir Ticket Fiscal'
        )}
      </button>

      <div className="flex gap-2 mt-2">
        <button onClick={cierreZ} className="btn btn-outline flex-1 btn-sm">
          Cierre Z
        </button>
        <button
          onClick={handleLimpiar}
          className="btn btn-outline flex-1 btn-sm"
        >
          Limpiar
        </button>
      </div>

      <div className="text-xs text-text-secondary text-center mt-2">
        F8=Emitir · F10=Cierre Z · ESC=Cerrar
      </div>
    </div>
  );
}
