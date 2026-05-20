// caja.js – Módulo Caja: pedidos, total acumulado, utilidades

function mostrarVista(vista) {
  document.querySelectorAll(".view").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));
  document.getElementById("view-" + vista).classList.add("active");
  document.getElementById("tab-" + vista)?.classList.add("active");

  if (vista === "pedidos") {
    renderizarPedidos();
    actualizarTotalCaja();
  }
  if (vista === "productos") renderizarProductos();
  if (vista === "nuevo-pedido") renderizarSelectorItems();
}

function actualizarTotalCaja() {
  document.getElementById("total-acumulado-caja").innerHTML =
    `Total acumulado: ${config.moneda}${totalAcumuladoCaja.toFixed(2)}`;
}

function agregarPedido(mesa, items, notas = "") {
  if (!mesa || !items.length) return false;
  const ahora = new Date();
  const hora = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, "0")}`;
  let totalPedido = 0;
  for (let nombreItem of items) {
    const prod = productos.find(p => p.nombre === nombreItem && p.estado === "activo");
    if (prod) totalPedido += prod.precio;
  }

  const nuevoPedido = {
    id: `P-00${estado.siguienteIdPedido++}`,
    mesa: mesa,
    items: [...items],
    estado: "pendiente",
    hora: hora,
    notas: notas,
    total: totalPedido
  };

  pedidos.unshift(nuevoPedido);
  totalAcumuladoCaja += totalPedido;
  actualizarTotalCaja();
  if (document.getElementById("view-pedidos").classList.contains("active")) {
    renderizarPedidos();
  }
  mostrarToast(`Pedido creado para ${mesa}`);
  return true;
}

function renderizarStats() {
  const total = pedidos.length;
  const pend = pedidos.filter(p => p.estado === "pendiente").length;
  const prep = pedidos.filter(p => p.estado === "en-preparacion").length;
  const listo = pedidos.filter(p => p.estado === "listo").length;
  document.getElementById("stats-grid").innerHTML = `
    <div class="stat-card"><div class="stat-label">Total pedidos</div><div class="stat-val">${total}</div></div>
    <div class="stat-card"><div class="stat-label">Pendientes</div><div class="stat-val">${pend}</div></div>
    <div class="stat-card"><div class="stat-label">En preparación</div><div class="stat-val">${prep}</div></div>
    <div class="stat-card"><div class="stat-label">Listos</div><div class="stat-val">${listo}</div></div>
  `;
}

function renderizarPedidos() {
  renderizarStats();
  const filtrados = estado.filtroPedidos === "todos"
    ? pedidos
    : pedidos.filter(p => p.estado === estado.filtroPedidos);
  const contenedor = document.getElementById("lista-pedidos");
  if (!filtrados.length) {
    contenedor.innerHTML = `<div class="empty-state"><i class="ti ti-clipboard-off"></i><p>No hay pedidos</p></div>`;
    return;
  }
  contenedor.innerHTML = filtrados.map(p => {
    const info = estadosPedido[p.estado];
    return `
      <div class="card order-card ${p.estado}">
        <div class="order-header">
          <span class="order-num"><i class="ti ti-receipt"></i> ${p.id} — ${p.mesa}</span>
          <span class="badge ${info.clase}">${info.etiqueta}</span>
        </div>
        <div class="order-meta"><i class="ti ti-clock"></i> ${p.hora} ${p.notas ? `· ${p.notas}` : ""}</div>
        <div class="order-items">${p.items.join(" · ")}</div>
        <div style="font-weight:bold; margin-bottom:0.5rem;">Total: ${config.moneda}${p.total.toFixed(2)}</div>
        <div class="order-actions">
          ${p.estado === "pendiente" ? `<button class="btn btn-sm" onclick="cambiarEstadoPedido('${p.id}', 'en-preparacion')"><i class="ti ti-chef-hat"></i> Preparar</button>` : ""}
          ${p.estado === "en-preparacion" ? `<button class="btn btn-accent btn-sm" onclick="cambiarEstadoPedido('${p.id}', 'listo')"><i class="ti ti-check"></i> Marcar listo</button>` : ""}
          ${(p.estado !== "cancelado" && p.estado !== "listo") ? `<button class="btn btn-danger btn-sm" onclick="cambiarEstadoPedido('${p.id}', 'cancelado')"><i class="ti ti-x"></i> Cancelar</button>` : ""}
        </div>
      </div>`;
  }).join("");
}

function cambiarEstadoPedido(id, nuevoEstado) {
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) {
    pedido.estado = nuevoEstado;
    renderizarPedidos();
    mostrarToast(`Pedido ${id}: ${estadosPedido[nuevoEstado].etiqueta}`);
  }
}

function filtrarPedidos(filtro, btn) {
  estado.filtroPedidos = filtro;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderizarPedidos();
}

// Utilidad compartida: toast
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

// ─── Funciones para la vista "Nuevo pedido" ───
function renderizarSelectorItems() {
  const disponibles = productos.filter(p => p.estado === "activo" && p.stock > 0);
  document.getElementById("item-picker").innerHTML = disponibles.map(p => {
    const seleccionado = estado.itemsSeleccionados.includes(p.nombre);
    return `
      <button class="item-chip ${seleccionado ? "selected" : ""}" onclick="toggleItem('${p.nombre}')">
        ${p.nombre}
        <span class="chip-precio">${config.moneda}${p.precio}</span>
      </button>`;
  }).join("");
  actualizarSeleccionActual();
}

function toggleItem(nombre) {
  if (estado.itemsSeleccionados.includes(nombre)) {
    estado.itemsSeleccionados = estado.itemsSeleccionados.filter(i => i !== nombre);
  } else {
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
  el.innerHTML = estado.itemsSeleccionados.map(nombre => `
    <span class="seleccion-tag">
      ${nombre}
      <button onclick="toggleItem('${nombre}')" title="Quitar">×</button>
    </span>`).join("");
}

function limpiarNuevoPedido() {
  estado.itemsSeleccionados = [];
  document.getElementById("pedido-mesa").value = "";
  document.getElementById("pedido-notas").value = "";
  renderizarSelectorItems();
}

function crearPedido() {
  const mesa = document.getElementById("pedido-mesa").value.trim();
  const notas = document.getElementById("pedido-notas").value.trim();
  if (!mesa) { mostrarToast("Escribe la mesa o nombre del cliente"); return; }
  if (!estado.itemsSeleccionados.length) { mostrarToast("Selecciona al menos un producto"); return; }
  agregarPedido(mesa, estado.itemsSeleccionados, notas);
  limpiarNuevoPedido();
  mostrarVista("pedidos");
}