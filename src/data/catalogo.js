// Catálogo inicial de productos (dummy data)
// Preparado para migrar a API mañana

export const CATALOGO_INICIAL = [
  {
    sku: "ALI-001",
    nombre: "Medallón de carne vacuna x6",
    precio: 3200,
    iva: 10.5,
    stock: 24,
    stockMin: 10,
    categoria: "Congelados",
    esCombo: false,
    unidad: "pack"
  },
  {
    sku: "ALI-002",
    nombre: "Pan de hamburguesa x8 und",
    precio: 1800,
    iva: 10.5,
    stock: 48,
    stockMin: 15,
    categoria: "Panificados",
    esCombo: false,
    unidad: "pack"
  },
  {
    sku: "ALI-003",
    nombre: "Papas fritas congeladas 1kg",
    precio: 2400,
    iva: 10.5,
    stock: 18,
    stockMin: 8,
    categoria: "Congelados",
    esCombo: false,
    unidad: "kg"
  },
  {
    sku: "ALI-004",
    nombre: "Milanesa de soja 500g",
    precio: 2900,
    iva: 10.5,
    stock: 0,
    stockMin: 5,
    categoria: "Congelados",
    esCombo: false,
    unidad: "pack"
  },
  {
    sku: "ALI-005",
    nombre: "Ketchup porción 20g",
    precio: 350,
    iva: 21,
    stock: 200,
    stockMin: 50,
    categoria: "Otros",
    esCombo: false,
    unidad: "unidad"
  },
  {
    sku: "BEB-001",
    nombre: "Gaseosa 500ml",
    precio: 1200,
    iva: 21,
    stock: 60,
    stockMin: 20,
    categoria: "Bebidas",
    esCombo: false,
    unidad: "unidad"
  },
  {
    sku: "BEB-002",
    nombre: "Agua mineral 500ml",
    precio: 900,
    iva: 21,
    stock: 40,
    stockMin: 20,
    categoria: "Bebidas",
    esCombo: false,
    unidad: "unidad"
  },
  {
    sku: "COM-001",
    nombre: "Combo Hamburguesa Completa",
    precio: 5200,
    iva: 10.5,
    stock: 0,
    stockMin: 5,
    categoria: "Combos",
    esCombo: true,
    unidad: "unidad",
    subItems: [
      { sku: "ALI-001", nombre: "Medallón de carne x6", cantidad: 1 },
      { sku: "ALI-002", nombre: "Pan de hamburguesa x8", cantidad: 1 },
      { sku: "ALI-005", nombre: "Ketchup porción", cantidad: 2 }
    ]
  },
  {
    sku: "COM-002",
    nombre: "Promo Familiar x4 hamburguesas",
    precio: 18000,
    iva: 10.5,
    stock: 0,
    stockMin: 2,
    categoria: "Combos",
    esCombo: true,
    unidad: "unidad",
    subItems: [
      { sku: "ALI-001", nombre: "Medallón de carne x6", cantidad: 4 },
      { sku: "ALI-002", nombre: "Pan de hamburguesa x8", cantidad: 2 },
      { sku: "ALI-003", nombre: "Papas fritas 1kg", cantidad: 2 },
      { sku: "ALI-005", nombre: "Ketchup porción", cantidad: 8 }
    ]
  },
  {
    sku: "COM-003",
    nombre: "Promo Veggie",
    precio: 7500,
    iva: 10.5,
    stock: 0,
    stockMin: 3,
    categoria: "Combos",
    esCombo: true,
    unidad: "unidad",
    subItems: [
      { sku: "ALI-004", nombre: "Milanesa de soja 500g", cantidad: 2 },
      { sku: "ALI-003", nombre: "Papas fritas 1kg", cantidad: 1 },
      { sku: "BEB-002", nombre: "Agua mineral 500ml", cantidad: 2 }
    ]
  }
];
