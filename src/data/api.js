// API Layer - Prepared for backend integration tomorrow
// Today: uses dummy data from ./data/
// Tomorrow: change implementations to fetch()

const API_BASE = '/api';  // Change to 'https://backend.com/api' tomorrow

// ========== CATALOGO ==========
let mockCatalogo = [
  { sku: 'ALI-001', nombre: 'Coca Cola 500ml', categoria: 'Bebidas', precio: 150, iva: 21, stock: 50, stockMin: 10, esCombo: false },
  { sku: 'ALI-002', nombre: 'Sabritas 45g', categoria: 'Snacks', precio: 120, iva: 21, stock: 30, stockMin: 5, esCombo: false },
  { sku: 'COM-001', nombre: 'Combo Familiar', categoria: 'Combos', precio: 500, iva: 21, esCombo: true, subItems: [{ sku: 'ALI-001', cantidad: 2 }, { sku: 'ALI-002', cantidad: 1 }] },
];

export async function fetchCatalogo() {
  return new Promise(resolve => {
    setTimeout(() => resolve([...mockCatalogo]), 300);
  });
}

export async function createProducto(producto) {
  // FUTURE: return fetch(`${API_BASE}/catalogo`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(producto)
  // }).then(r => r.json());

  return new Promise(resolve => {
    setTimeout(() => {
      const nuevo = { ...producto, _id: Date.now().toString() };
      mockCatalogo.push(nuevo);
      resolve(nuevo);
    }, 300);
  });
}

export async function updateProducto(sku, datos) {
  // FUTURE: return fetch(`${API_BASE}/catalogo/${sku}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(datos)
  // }).then(r => r.json());

  return new Promise(resolve => {
    setTimeout(() => {
      const idx = mockCatalogo.findIndex(p => p.sku === sku);
      if (idx !== -1) {
        mockCatalogo[idx] = { ...mockCatalogo[idx], ...datos };
        resolve(mockCatalogo[idx]);
      } else {
        resolve(datos);
      }
    }, 300);
  });
}

export async function deleteProducto(sku) {
  // FUTURE: return fetch(`${API_BASE}/catalogo/${sku}`, {
  //   method: 'DELETE'
  // }).then(r => r.json());

  return new Promise(resolve => {
    setTimeout(() => {
      mockCatalogo = mockCatalogo.filter(p => p.sku !== sku);
      resolve({ ok: true });
    }, 300);
  });
}

// ========== VENTAS ==========
export async function emitirTicket(ventaData) {
  const cae = String(Math.floor(Math.random() * 90000000000000 + 10000000000000));
  const ticketNumero = Math.floor(Math.random() * 90000 + 1000);
  return {
    cae,
    ticketNumero,
    fecha: new Date().toLocaleDateString('es-AR'),
    ...ventaData
  };
}

export async function fetchCierreZ() {
  // FUTURE: return fetch(`${API_BASE}/cierre-z`).then(r => r.json());
  return {
    comprobantes: 0,
    total: 0,
    iva21: 0,
    iva105: 0
  };
}

// ========== STOCK ==========
export async function postMovimientoStock(movimiento) {
  // FUTURE: return fetch(`${API_BASE}/stock/movimiento`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(movimiento)
  // }).then(r => r.json());

  return {
    ...movimiento,
    id: Date.now(),
    fecha: new Date().toLocaleDateString('es-AR')
  };
}

// ========== NOTES FOR TOMORROW ==========
// 1. Replace API_BASE with real backend URL
// 2. Uncomment fetch() calls and remove dummy returns
// 3. Add error handling: try/catch around fetch()
// 4. Add authentication headers if needed
// 5. Components import from this file - they don't know if data is local or remote
