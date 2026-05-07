import { useState } from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import { fmt } from '../../utils/format';

export default function CierreZModal({ onClose, onConfirm, cierreZData }) {
  return (
    <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span>⚡ Cierre Z Diario</span>
          <button onClick={onClose} className="btn btn-outline btn-sm">✕</button>
        </div>
        <div className="p-4">
          <div className="text-sm text-muted mb-4">Resumen fiscal — No se puede deshacer</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="card p-2.5 text-center">
              <div className="text-xs text-muted">Comprobantes</div>
              <div className="text-xl font-extrabold">{cierreZData.comprobantes}</div>
            </div>
            <div className="card p-2.5 text-center">
              <div className="text-xs text-muted">Total día</div>
              <div className="text-xl font-extrabold text-green-500">{fmt(cierreZData.total)}</div>
            </div>
            <div className="card p-2.5 text-center">
              <div className="text-xs text-muted">IVA 21%</div>
              <div className="text-lg font-bold">{fmt(cierreZData.iva21)}</div>
            </div>
            <div className="card p-2.5 text-center">
              <div className="text-xs text-muted">IVA 10,5%</div>
              <div className="text-lg font-bold">{fmt(cierreZData.iva105)}</div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="btn btn-outline">Cancelar</button>
            <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-primary">Ejecutar Cierre Z</button>
          </div>
        </div>
      </div>
    </div>
  );
}
