import { useState, useMemo } from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import { useUI } from '../../context/UIContext';
import StockCards from './StockCards';
import StockTable from './StockTable';
import MovimientosTable from './MovimientosTable';

export default function StockPanel() {
  const { state } = useCatalogo();
  const { openModal } = useUI();

  const stats = useMemo(() => {
    let total = 0, ok = 0, bajo = 0, vacio = 0;
    state.catalogo.forEach(p => {
      if (p.esCombo) return;
      total++;
      if (p.stock <= 0) vacio++;
      else if (p.stock <= p.stockMin) bajo++;
      else ok++;
    });
    return { total, ok, bajo, vacio };
  }, [state.catalogo]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Stock</h2>
        <p className="text-text-secondary text-sm">Control y movimientos de inventario</p>
      </div>

      {/* Stats cards */}
      <StockCards stats={stats} />

      {/* Tabla de stock */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Estado de Stock</h3>
          <span className="text-sm text-text-secondary">
            {stats.total} productos
          </span>
        </div>
        <div className="overflow-x-auto">
          <StockTable onAjustar={(sku, tipo) => openModal('stockMov', { sku, tipo })} />
        </div>
      </div>

      {/* Historial */}
      <div className="card">
        <h3 className="font-semibold mb-4">Historial de Movimientos</h3>
        <div className="overflow-x-auto">
          <MovimientosTable />
        </div>
      </div>
    </div>
  );
}
