// Stock-related utility functions

export function estadoStock(p) {
  if (p.esCombo) return 'combo';
  if (p.stock <= 0) return 'vacio';
  if (p.stock <= p.stockMin) return 'bajo';
  return 'ok';
}

export function descontarStock(items, catalogo) {
  items.forEach(item => {
    if (item.esCombo && item.subItems) {
      item.subItems.forEach(sub => {
        const prod = catalogo.find(p => p.sku === sub.sku);
        if (prod) prod.stock = Math.max(0, prod.stock - sub.cantidad * item.cantidad);
      });
    } else if (item.sku) {
      const prod = catalogo.find(p => p.sku === item.sku);
      if (prod) prod.stock = Math.max(0, prod.stock - item.cantidad);
    }
  });
}

export function getStockClass(estado) {
  switch(estado) {
    case 'ok': return 'text-green-500 font-bold';
    case 'bajo': return 'text-amber-500 font-bold';
    case 'vacio': return 'text-red-500 font-bold';
    case 'combo': return 'text-muted font-bold';
    default: return '';
  }
}

export function getStockLabel(estado) {
  switch(estado) {
    case 'ok': return '🟢 OK';
    case 'bajo': return '🟡 BAJO';
    case 'vacio': return '🔴 VACÍO';
    case 'combo': return '⚪ COMBO';
    default: return '';
  }
}
