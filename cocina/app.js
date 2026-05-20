
const config = {
nombreSistema: "La Cafetería",
modulo:        "Cocina",
moneda:        "$",
  stockBajoEn:   5,         // propiedad numérica: límite de stock bajo
  categorias:    ["Bebidas", "Alimentos", "Postres", "Snacks"],  // propiedad que es un array
};


// ── ARRAY DE OBJETOS: catálogo de productos ───────────────────────
// Cada elemento del array es un objeto con sus propias propiedades.
let productos = [
{ id: 1,  nombre: "Café Americano",     categoria: "Bebidas",   precio: 35, stock: 50, estado: "activo",   desc: "Café negro sin leche" },
{ id: 2,  nombre: "Cappuccino",         categoria: "Bebidas",   precio: 45, stock: 40, estado: "activo",   desc: "Espresso con leche vaporizada" },
{ id: 3,  nombre: "Latte",              categoria: "Bebidas",   precio: 48, stock: 35, estado: "activo",   desc: "" },
{ id: 4,  nombre: "Té Verde",           categoria: "Bebidas",   precio: 30, stock: 5,  estado: "activo",   desc: "" },
{ id: 5,  nombre: "Chocolate Caliente", categoria: "Bebidas",   precio: 42, stock: 0,  estado: "inactivo", desc: "" },
{ id: 6,  nombre: "Croissant",          categoria: "Alimentos", precio: 28, stock: 15, estado: "activo",   desc: "Recién horneado" },
{ id: 7,  nombre: "Bagel con queso",    categoria: "Alimentos", precio: 38, stock: 10, estado: "activo",   desc: "" },
{ id: 8,  nombre: "Cheesecake",         categoria: "Postres",   precio: 55, stock: 8,  estado: "activo",   desc: "De zarzamora" },
{ id: 9,  nombre: "Brownie",            categoria: "Postres",   precio: 32, stock: 3,  estado: "activo",   desc: "" },
{ id: 10, nombre: "Granola Bar",        categoria: "Snacks",    precio: 22, stock: 20, estado: "activo",   desc: "" },
];


// ── ARRAY DE OBJETOS: pedidos activos ────────────────────────────
// Propiedad "items" es un array de strings dentro de cada objeto pedido.
let pedidos = [
  { id: "P-001", mesa: "Mesa 2",  items: ["Café Americano", "Croissant"],          estado: "en-preparacion", hora: "10:15", notas: "" },
  { id: "P-002", mesa: "Mesa 5",  items: ["Latte", "Cheesecake"],                  estado: "pendiente",       hora: "10:22", notas: "Sin azúcar" },
  { id: "P-003", mesa: "Juan R.", items: ["Cappuccino"],                            estado: "listo",           hora: "10:05", notas: "" },
  { id: "P-004", mesa: "Mesa 1",  items: ["Té Verde", "Brownie", "Granola Bar"],   estado: "pendiente",       hora: "10:28", notas: "Para llevar" },
];


// ── OBJETO: estado de la aplicación ─────────────────────────────
// Agrupa en un solo objeto todas las variables de estado,
// en lugar de tenerlas sueltas.
const estado = {
  siguienteIdProducto: 11,
  siguienteIdPedido:   5,
  filtroPedidos:       "todos",
  itemsSeleccionados:  [],     // array vacío: se llena al crear pedido
  productoAEliminar:   null,
};


// ── OBJETO: etiquetas y clases para los estados de un pedido ────
// Permite centralizar las traducciones sin repetir if/else en todo el código.
const estadosPedido = {
  pendiente:        { etiqueta: "Pendiente",       clase: "badge-pendiente" },
  "en-preparacion": { etiqueta: "En preparación",  clase: "badge-prep"      },
  listo:            { etiqueta: "Listo",            clase: "badge-listo"     },
  cancelado:        { etiqueta: "Cancelado",        clase: "badge-cancel"    },
};


// ════════════════════════════════════════════════════════════════
//  NAVEGACIÓN
// ════════════════════════════════════════════════════════════════

function mostrarVista(vista) {
  document.querySelectorAll(".view").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));
  document.getElementById("view-" + vista).classList.add("active");
  document.getElementById("tab-" + vista).classList.add("active");

  if (vista === "pedidos")      renderizarPedidos();
  if (vista === "productos")    renderizarProductos();
  if (vista === "nuevo-pedido") renderizarSelectorItems();
}


// ════════════════════════════════════════════════════════════════
//  PEDIDOS
// ════════════════════════════════════════════════════════════════

function renderizarStats() {
  // filter() recorre el array y devuelve un nuevo array con los que cumplan la condición.
  // .length da la cantidad de elementos del array resultante.
  const total = pedidos.length;
  const pend  = pedidos.filter(p => p.estado === "pendiente").length;
  const prep  = pedidos.filter(p => p.estado === "en-preparacion").length;
  const listo = pedidos.filter(p => p.estado === "listo").length;

  document.getElementById("stats-grid").innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total pedidos</div>
      <div class="stat-val">${total}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Pendientes</div>
      <div class="stat-val">${pend}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">En preparación</div>
      <div class="stat-val">${prep}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Listos</div>
      <div class="stat-val">${listo}</div>
    </div>
  `;
}

function renderizarPedidos() {
  renderizarStats();

  // Filtramos el array de pedidos según la propiedad "estado" de cada objeto.
  const filtrados = estado.filtroPedidos === "todos"
    ? pedidos
    : pedidos.filter(p => p.estado === estado.filtroPedidos);

  const contenedor = document.getElementById("lista-pedidos");

  if (!filtrados.length) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-clipboard-off"></i>
        <p>No hay pedidos en esta categoría</p>
      </div>`;
    return;
  }

  // map() transforma cada objeto del array en HTML.
  contenedor.innerHTML = filtrados.map(p => {
    // Accedemos a las propiedades del objeto estadosPedido con notación de corchetes.
    const info = estadosPedido[p.estado];

    return `
      <div class="card order-card ${p.estado}">
        <div class="order-header">
          <span class="order-num">
            <i class="ti ti-receipt"></i> ${p.id} — ${p.mesa}
          </span>
          <span class="badge ${info.clase}">${info.etiqueta}</span>
        </div>
        <div class="order-meta">
          <i class="ti ti-clock"></i> ${p.hora}
          ${p.notas ? `&nbsp;·&nbsp; ${p.notas}` : ""}
        </div>
        <div class="order-items">
          ${p.items.join(" · ")}
        </div>
        <div class="order-actions">
          ${p.estado === "pendiente" ? `
            <button class="btn btn-sm" onclick="cambiarEstadoPedido('${p.id}', 'en-preparacion')">
              <i class="ti ti-chef-hat"></i> Preparar
            </button>` : ""}
          ${p.estado === "en-preparacion" ? `
            <button class="btn btn-accent btn-sm" onclick="cambiarEstadoPedido('${p.id}', 'listo')">
              <i class="ti ti-check"></i> Marcar listo
            </button>` : ""}
          ${(p.estado !== "cancelado" && p.estado !== "listo") ? `
            <button class="btn btn-danger btn-sm" onclick="cambiarEstadoPedido('${p.id}', 'cancelado')">
              <i class="ti ti-x"></i> Cancelar
            </button>` : ""}
        </div>
      </div>`;
  }).join("");
}

function cambiarEstadoPedido(id, nuevoEstado) {
  // find() busca en el array el primer objeto cuya propiedad "id" coincida.
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) {
    pedido.estado = nuevoEstado;   // modificamos la propiedad del objeto
    renderizarPedidos();
    mostrarToast(`Pedido ${id}: ${estadosPedido[nuevoEstado].etiqueta}`);
  }
}

function filtrarPedidos(filtro, btn) {
  estado.filtroPedidos = filtro;   // actualizamos la propiedad del objeto estado
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderizarPedidos();
}


// ════════════════════════════════════════════════════════════════
//  CRUD PRODUCTOS
// ════════════════════════════════════════════════════════════════

function renderizarProductos() {
  const busqueda  = document.getElementById("buscar-prod").value.toLowerCase();
  const categoria = document.getElementById("filtro-cat").value;

  // filter() sobre el array de productos, revisando propiedades de cada objeto.
  const filtrados = productos.filter(p => {
    const coincideNombre = !busqueda  || p.nombre.toLowerCase().includes(busqueda);
    const coincideCat    = !categoria || p.categoria === categoria;
    return coincideNombre && coincideCat;
  });

  const tbody = document.getElementById("prod-tbody");

  if (!filtrados.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:2rem;color:var(--txt-sec);">
          No se encontraron productos
        </td>
      </tr>`;
    return;
  }

  // map() convierte cada objeto producto en una fila de la tabla.
  tbody.innerHTML = filtrados.map(p => `
    <tr>
      <td>
        <div class="prod-nombre">${p.nombre}</div>
        ${p.desc ? `<div class="prod-desc">${p.desc}</div>` : ""}
      </td>
      <td><span class="cat-pill">${p.categoria}</span></td>
      <td>${config.moneda}${p.precio.toFixed(2)}</td>
      <td class="${claseStock(p.stock)}">${etiquetaStock(p.stock)}</td>
      <td>
        <span class="badge ${p.estado === "activo" ? "badge-activo" : "badge-inactivo"}">
          ${p.estado === "activo" ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td>
        <button class="btn btn-sm" onclick="abrirModal(${p.id})" style="margin-right:6px;">
          <i class="ti ti-edit"></i> Editar
        </button>
        <button class="btn btn-sm btn-danger" onclick="pedirConfirmacionEliminar(${p.id})">
          <i class="ti ti-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

// Devuelve la clase CSS según la propiedad stock del objeto producto.
function claseStock(stock) {
  if (stock === 0)                   return "stock-out";
  if (stock <= config.stockBajoEn)   return "stock-low";
  return "stock-ok";
}

function etiquetaStock(stock) {
  if (stock === 0)                   return `<i class="ti ti-alert-circle"></i> Sin stock`;
  if (stock <= config.stockBajoEn)   return `<i class="ti ti-alert-triangle"></i> ${stock}`;
  return `${stock}`;
}

// AGREGAR ─────────────────────────────────────────────────────────
function abrirModal(id) {
  document.getElementById("modal-producto").classList.add("open");

  if (id !== null) {
    // find() localiza el objeto con el id dado en el array.
    const p = productos.find(x => x.id === id);
    document.getElementById("modal-titulo").textContent = "Editar producto";
    document.getElementById("edit-id").value  = p.id;
    document.getElementById("p-nombre").value = p.nombre;
    document.getElementById("p-cat").value    = p.categoria;
    document.getElementById("p-precio").value = p.precio;
    document.getElementById("p-stock").value  = p.stock;
    document.getElementById("p-desc").value   = p.desc;
    document.getElementById("p-estado").value = p.estado;
  } else {
    document.getElementById("modal-titulo").textContent = "Agregar producto";
    document.getElementById("edit-id").value = "";
    ["p-nombre", "p-precio", "p-stock", "p-desc"].forEach(campo => {
      document.getElementById(campo).value = "";
    });
    document.getElementById("p-cat").value    = "Bebidas";
    document.getElementById("p-estado").value = "activo";
  }
}

function cerrarModal() {
  document.getElementById("modal-producto").classList.remove("open");
}

// GUARDAR ─────────────────────────────────────────────────────────
function guardarProducto() {
  const nombre = document.getElementById("p-nombre").value.trim();
  const precio = parseFloat(document.getElementById("p-precio").value);
  const stock  = parseInt(document.getElementById("p-stock").value);

if (!nombre || isNaN(precio) || isNaN(stock)) {
    mostrarToast("Completa todos los campos requeridos");
    return;
}

  // Creamos un objeto nuevo con las propiedades capturadas del formulario.
const datosProd = {
    nombre:    nombre,
    categoria: document.getElementById("p-cat").value,
    precio:    precio,
    stock:     stock,
    desc:      document.getElementById("p-desc").value.trim(),
    estado:    document.getElementById("p-estado").value,
};

const idEdicion = document.getElementById("edit-id").value;

if (idEdicion) {
    // EDITAR: findIndex() busca la posición en el array, luego actualizamos el objeto.
    const idx = productos.findIndex(p => p.id == idEdicion);
    productos[idx] = { ...productos[idx], ...datosProd };  // spread: combina propiedades
    mostrarToast("Producto actualizado");
} else {
    // AGREGAR: push() añade un nuevo objeto al final del array.
    productos.push({ id: estado.siguienteIdProducto++, ...datosProd });
    mostrarToast("Producto agregado");
}

cerrarModal();
renderizarProductos();
}

// ELIMINAR ────────────────────────────────────────────────────────
function pedirConfirmacionEliminar(id) {
  estado.productoAEliminar = id;   // guardamos el id en la propiedad del objeto estado
document.getElementById("confirm-overlay").classList.add("open");
}

function cerrarConfirmacion() {
document.getElementById("confirm-overlay").classList.remove("open");
estado.productoAEliminar = null;
}

function confirmarEliminar() {
if (estado.productoAEliminar !== null) {
    // filter() crea un nuevo array excluyendo el objeto con el id a eliminar.
    productos = productos.filter(p => p.id !== estado.productoAEliminar);
    mostrarToast("Producto eliminado");
    cerrarConfirmacion();
    renderizarProductos();
}
}


// ════════════════════════════════════════════════════════════════
//  NUEVO PEDIDO
// ════════════════════════════════════════════════════════════════

function renderizarSelectorItems() {
  // filter() sobre el array: solo productos activos con stock disponible.
const disponibles = productos.filter(p => p.estado === "activo" && p.stock > 0);

  // map() convierte cada objeto producto en un botón HTML.
document.getElementById("item-picker").innerHTML = disponibles.map(p => {
    const seleccionado = estado.itemsSeleccionados.includes(p.nombre);
    return `
    <button class="item-chip ${seleccionado ? "selected" : ""}"
        onclick="toggleItem('${p.nombre}')">
        ${p.nombre}
        <span class="chip-precio">${config.moneda}${p.precio}</span>
</button>`;
}).join("");

actualizarSeleccionActual();
}

function toggleItem(nombre) {
  // includes() verifica si el string existe en el array.
if (estado.itemsSeleccionados.includes(nombre)) {
    // filter() devuelve un nuevo array sin el elemento quitado.
    estado.itemsSeleccionados = estado.itemsSeleccionados.filter(i => i !== nombre);
} else {
    // push() agrega el string al array.
    estado.itemsSeleccionados.push(nombre);
}
renderizarSelectorItems();
}

function actualizarSeleccionActual() {
const el = document.getElementById("seleccion-actual");

if (!estado.itemsSeleccionados.length) {
    el.innerHTML = `<span class="placeholder-txt">Ningún producto seleccionado</span>`;
    return;
}

  // map() sobre el array de strings seleccionados.
el.innerHTML = estado.itemsSeleccionados.map(nombre => `
    <span class="seleccion-tag">
${nombre}
<button onclick="toggleItem('${nombre}')" title="Quitar">×</button>
    </span>
`).join("");
}

function limpiarNuevoPedido() {
  estado.itemsSeleccionados = [];   // vaciamos el array (propiedad del objeto estado)
document.getElementById("pedido-mesa").value  = "";
document.getElementById("pedido-notas").value = "";
renderizarSelectorItems();
}

function crearPedido() {
const mesa = document.getElementById("pedido-mesa").value.trim();

if (!mesa) {
    mostrarToast("Escribe la mesa o nombre del cliente");
    return;
}
if (!estado.itemsSeleccionados.length) {
    mostrarToast("Selecciona al menos un producto");
    return;
}

const ahora = new Date();
const hora  = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, "0")}`;

  // Creamos un objeto nuevo para el pedido y lo añadimos al inicio del array con unshift().
const nuevoPedido = {
    id:     `P-00${estado.siguienteIdPedido++}`,
    mesa:   mesa,
    items:  [...estado.itemsSeleccionados],   // copiamos el array con spread
    estado: "pendiente",
    hora:   hora,
    notas:  document.getElementById("pedido-notas").value.trim(),
};

  pedidos.unshift(nuevoPedido);   // unshift() agrega al inicio del array

mostrarToast(`Pedido creado para ${mesa}`);
limpiarNuevoPedido();
mostrarVista("pedidos");
}



function mostrarToast(mensaje) {
const toast = document.getElementById("toast");
toast.textContent = mensaje;
toast.classList.add("show");
setTimeout(() => toast.classList.remove("show"), 2400);
}

mostrarVista("pedidos");