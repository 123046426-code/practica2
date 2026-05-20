// datos.js – Variables globales del sistema
const config = {
  nombreSistema: "La Cafetería",
  modulo: "Sistema",
  moneda: "$",
  stockBajoEn: 5,
  categorias: ["Bebidas", "Alimentos", "Postres", "Snacks"],
};

let productos = [
  { id: 1, nombre: "Café Americano", categoria: "Bebidas", precio: 35, stock: 50, estado: "activo", desc: "Café negro sin leche" },
  { id: 2, nombre: "Cappuccino", categoria: "Bebidas", precio: 45, stock: 40, estado: "activo", desc: "Espresso con leche vaporizada" },
  { id: 3, nombre: "Latte", categoria: "Bebidas", precio: 48, stock: 35, estado: "activo", desc: "" },
  { id: 4, nombre: "Té Verde", categoria: "Bebidas", precio: 30, stock: 5, estado: "activo", desc: "" },
  { id: 5, nombre: "Chocolate Caliente", categoria: "Bebidas", precio: 42, stock: 0, estado: "inactivo", desc: "" },
  { id: 6, nombre: "Croissant", categoria: "Alimentos", precio: 28, stock: 15, estado: "activo", desc: "Recién horneado" },
  { id: 7, nombre: "Bagel con queso", categoria: "Alimentos", precio: 38, stock: 10, estado: "activo", desc: "" },
  { id: 8, nombre: "Cheesecake", categoria: "Postres", precio: 55, stock: 8, estado: "activo", desc: "De zarzamora" },
  { id: 9, nombre: "Brownie", categoria: "Postres", precio: 32, stock: 3, estado: "activo", desc: "" },
  { id: 10, nombre: "Granola Bar", categoria: "Snacks", precio: 22, stock: 20, estado: "activo", desc: "" },
];

let pedidos = [
  { id: "P-001", mesa: "Mesa 2", items: ["Café Americano", "Croissant"], estado: "en-preparacion", hora: "10:15", notas: "", total: 63 },
  { id: "P-002", mesa: "Mesa 5", items: ["Latte", "Cheesecake"], estado: "pendiente", hora: "10:22", notas: "Sin azúcar", total: 103 },
  { id: "P-003", mesa: "Juan R.", items: ["Cappuccino"], estado: "listo", hora: "10:05", notas: "", total: 45 },
  { id: "P-004", mesa: "Mesa 1", items: ["Té Verde", "Brownie", "Granola Bar"], estado: "pendiente", hora: "10:28", notas: "Para llevar", total: 84 },
];

const estado = {
  siguienteIdProducto: 11,
  siguienteIdPedido: 5,
  filtroPedidos: "todos",
  itemsSeleccionados: [],
  productoAEliminar: null,
};

let totalAcumuladoCaja = pedidos.reduce((sum, p) => sum + (p.total || 0), 0);

const estadosPedido = {
  pendiente: { etiqueta: "Pendiente", clase: "badge-pendiente" },
  "en-preparacion": { etiqueta: "En preparación", clase: "badge-prep" },
  listo: { etiqueta: "Listo", clase: "badge-listo" },
  cancelado: { etiqueta: "Cancelado", clase: "badge-cancel" },
};