import { useState, useEffect } from 'react';
import { COMERCIO } from '../../data/comercio';
import { fmt, randCAE } from '../../utils/format';
import { QRCodeSVG } from 'qrcode.react';

export default function TicketModal({ onClose, ventaData }) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!ventaData) return null;

  const { items, total, recibido, medioPago, tipoComprobante, cuit, razon, condIva, ticketNumero } = ventaData;
  const alicuotaIva = ventaData.alicuotaIva ?? 21;
  const neto = alicuotaIva === 0 ? total : total / (1 + alicuotaIva / 100);
  const ivaVal = total - neto;
  const vuelto = recibido > total ? recibido - total : 0;
  const caeFinal = ventaData.cae || randCAE();
  const vtoCae = new Date();
  vtoCae.setDate(vtoCae.getDate() + 10);
  const nroTicket = ticketNumero || Math.floor(Math.random() * 90000 + 1000);
  const now = new Date();
  const fecha = now.toLocaleDateString('es-AR');
  const hora = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

  const tipoMap = {
    Ticket: 'T I C K E T',
    'Factura B': 'F A C T U R A   B',
    'Factura A': 'F A C T U R A   A',
    'Factura C': 'F A C T U R A   C',
  };
  const ivaLbl = alicuotaIva === 0 ? 'Exento' : `IVA ${alicuotaIva}%`;
  const txId = ventaData.txId || `pi_${Math.random().toString(36).slice(2, 14)}`;

  const s = {
    overlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,.88)',
      zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      backdropFilter: 'blur(8px)',
      opacity: closing ? 0 : 1,
      transition: 'opacity .2s ease',
    },
    wrap: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      transform: closing ? 'scale(.92) translateY(20px)' : 'scale(1) translateY(0)',
      opacity: closing ? 0 : 1,
      transition: 'all .25s ease',
      maxHeight: '95vh',
    },
    printerTop: {
      width: 260,
      background: 'linear-gradient(180deg,#3c3c3c,#2d2d2d)',
      borderRadius: '12px 12px 0 0',
      padding: '12px 16px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
      boxShadow: '0 -4px 20px rgba(0,0,0,.6)',
    },
    brand: { fontFamily: "'Courier New',monospace", fontSize: 8, color: '#888', letterSpacing: 1.5, textTransform: 'uppercase', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    lights: { display: 'flex', gap: 5 },
    lightG: { width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'blink 2s infinite' },
    lightA: { width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' },
    sub: { fontFamily: "'Courier New',monospace", fontSize: 7, color: '#555', letterSpacing: .8, textTransform: 'uppercase' },
    slot: { width: 196, height: 5, background: '#111', borderRadius: 2, marginBottom: 4, boxShadow: 'inset 0 1px 4px rgba(0,0,0,.9)' },
    ticket: {
      width: 230,
      background: '#fefcf7',
      padding: '14px 14px 20px',
      fontFamily: "'Courier New',monospace",
      color: '#111',
      fontSize: 8.5,
      lineHeight: 1.65,
      overflowY: 'auto',
      maxHeight: '60vh',
      boxShadow: '2px 0 8px rgba(0,0,0,.2), -2px 0 8px rgba(0,0,0,.15)',
      animation: visible ? 'printTicket .9s cubic-bezier(.05,.9,.2,1) forwards' : 'none',
    },
    cut: {
      width: 230, height: 12, flexShrink: 0,
      background: 'radial-gradient(circle at 6px 0,transparent 5px,#fefcf7 5px) 0 0/12px 12px, radial-gradient(circle at 6px 12px,#0a0c14 5px,transparent 5px) 0 0/12px 12px',
      backgroundColor: '#0a0c14',
    },
    bottom: {
      width: 260,
      background: 'linear-gradient(180deg,#2d2d2d,#222)',
      borderRadius: '0 0 10px 10px',
      padding: '10px 16px 14px',
      display: 'flex', gap: 6,
      boxShadow: '0 8px 24px rgba(0,0,0,.5)',
    },
    btnClose: { flex: 1, padding: 8, borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: '#1a1a1a', color: '#888', border: '1px solid #333', transition: 'all .15s' },
    btnNew: { flex: 1, padding: 8, borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: '#1a56db', color: '#fff', border: 'none', transition: 'all .15s' },
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && handleClose()}>
      <div style={s.wrap}>
        {/* Printer top */}
        <div style={s.printerTop}>
          <div style={s.brand}>
            <span>Hasar SMH / P-614F</span>
            <div style={s.lights}>
              <div style={s.lightG}></div>
              <div style={s.lightA}></div>
            </div>
          </div>
          <div style={s.sub}>Controlador Fiscal Homologado · ARCA</div>
          <div style={s.slot}></div>
        </div>

        {/* Ticket paper */}
        <div style={s.ticket}>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 11 }}>{COMERCIO.nombre}</div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>{COMERCIO.direccion}</div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>Tel: {COMERCIO.tel}</div>
          <hr style={{ border: 'none', borderTop: '1px dashed #bbb', margin: '4px 0' }} />
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>CUIT: {COMERCIO.cuit}</div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>{COMERCIO.condIVA}</div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>IIBB: {COMERCIO.iibb}</div>
          <hr style={{ border: 'none', borderTop: '2px solid #333', margin: '4px 0' }} />
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 13, letterSpacing: 1.5, margin: '3px 0' }}>{tipoMap[tipoComprobante] || 'T I C K E T'}</div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>Pto. Vta: {COMERCIO.puntoVenta} · Nro: {String(nroTicket).padStart(8, '0')}</div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>{fecha}  {hora}</div>
          <hr style={{ border: 'none', borderTop: '1px dashed #bbb', margin: '4px 0' }} />
          {razon && (
            <>
              <div style={{ color: '#666', fontSize: 8 }}>Sr/a: <b>{razon}</b></div>
              <div style={{ color: '#666', fontSize: 8 }}>CUIT/DNI: {cuit || '–'}</div>
              {condIva && <div style={{ color: '#666', fontSize: 8 }}>Cond. IVA: {condIva}</div>}
              <hr style={{ border: 'none', borderTop: '1px dashed #bbb', margin: '4px 0' }} />
            </>
          )}
          <div style={{ color: '#666', fontSize: 8, marginBottom: 2 }}>
            Descripción{'\u00A0'.repeat(8)}Importe
          </div>
          {items?.length ? (
            items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 4, fontSize: 8.5 }}>
                <span>{item.nombre.substring(0, 20)}</span>
                <span>{fmt(item.precio * item.cantidad)}</span>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
              <span>Artículos Varios</span><span>{fmt(total)}</span>
            </div>
          )}
          <hr style={{ border: 'none', borderTop: '1px dashed #bbb', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            <span style={{ color: '#666', fontSize: 8 }}>Neto gravado:</span><span>{fmt(neto)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            <span style={{ color: '#666', fontSize: 8 }}>{ivaLbl}:</span><span>{fmt(ivaVal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
            <span style={{ color: '#666', fontSize: 8 }}>Otros tributos:</span><span>$0,00</span>
          </div>
          <hr style={{ border: 'none', borderTop: '2px solid #333', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, fontWeight: 'bold', margin: '3px 0' }}>
            <span style={{ fontSize: 11 }}>TOTAL</span>
            <span style={{ fontSize: 14 }}>{fmt(total)}</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px dashed #bbb', margin: '4px 0' }} />
          <div style={{ color: '#666', fontSize: 8 }}>Medio de pago: {medioPago}</div>
          {recibido > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
              <span style={{ color: '#666', fontSize: 8 }}>Recibido:</span><span>{fmt(recibido)}</span>
            </div>
          )}
          {vuelto > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
              <span style={{ color: '#666', fontSize: 8 }}>Vuelto:</span>
              <span style={{ color: '#059669', fontWeight: 'bold' }}>{fmt(vuelto)}</span>
            </div>
          )}
          {medioPago === 'QR/MP' && (
            <>
              <hr style={{ border: 'none', borderTop: '1px dashed #bbb', margin: '4px 0' }} />
              <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#111', fontSize: 9, marginBottom: 3 }}>PAGO QR DIGITAL</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                <span style={{ color: '#666', fontSize: 8 }}>Billetera:</span><span style={{ color: '#1a7a1a', fontWeight: 'bold' }}>{medioPago}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                <span style={{ color: '#666', fontSize: 8 }}>Estado:</span><span style={{ color: '#1a7a1a', fontWeight: 'bold' }}>APROBADO ✓</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                <span style={{ color: '#666', fontSize: 8 }}>ID transacción:</span>
              </div>
              <div style={{ textAlign: 'center', color: '#666', fontSize: 7.5, wordBreak: 'break-all' }}>{txId}</div>
              <hr style={{ border: 'none', borderTop: '1px dashed #bbb', margin: '4px 0' }} />
            </>
          )}
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8, marginBottom: 2 }}>Comprobante autorizado por ARCA</div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 9 }}>CAE N°: {caeFinal}</div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>Vto. CAE: {vtoCae.toLocaleDateString('es-AR')}</div>
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>WSFEv1 · FECAESolicitar · R.G. 4.291</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '5px 0' }}>
            <QRCodeSVG value={JSON.stringify({ cuit: COMERCIO.cuit, ptoVta: COMERCIO.puntoVenta, tipoCmp: '11', nroCmp: nroTicket, importe: total.toFixed(2), moneda: 'PES', ctz: '1.00', fecha: now.toISOString().split('T')[0], tipoCodAut: 'E', codAut: caeFinal })} size={60} level="M" includeMargin={false} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 7, color: '#999' }}>serviciosweb.arca.gob.ar</div>
          <hr style={{ border: 'none', borderTop: '1px dashed #bbb', margin: '4px 0' }} />
          <div style={{ textAlign: 'center', color: '#666', fontSize: 8 }}>Hasar SMH/P-614F · Serie: 12345678</div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 4, fontSize: 9 }}>¡Gracias por su compra!</div>
        </div>

        {/* Zigzag cut edge */}
        <div style={s.cut}></div>

        {/* Printer bottom with buttons */}
        <div style={s.bottom}>
          <button
            style={s.btnClose}
            onClick={handleClose}
            onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.borderColor = '#555'; }}
            onMouseLeave={e => { e.target.style.color = '#888'; e.target.style.borderColor = '#333'; }}
          >
            ✕ Cerrar
          </button>
          <button
            style={s.btnNew}
            onClick={handleClose}
            onMouseEnter={e => { e.target.style.background = '#1e40af'; }}
            onMouseLeave={e => { e.target.style.background = '#1a56db'; }}
          >
            + Nueva venta
          </button>
        </div>
      </div>
    </div>
  );
}
