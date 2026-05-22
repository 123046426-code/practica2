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
}

function actualizarTotalCaja() {
  totalAcumuladoCaja = pedidos.reduce((sum, { total }) => sum + total, 0);
  document.getElementById("total-acumulado-caja").innerHTML = 
    `Total acumulado (con IVA): ${config.moneda}${totalAcumuladoCaja.toFixed(2)}`;
}

function agregarPedido(mesa, items, notas = "") {
  if (!mesa || !items.length) return false;

const subtotal = items.reduce((sum, nombreItem) => {
    const prod = productos.find(p => p.nombre === nombreItem && p.estado === "activo");
    return sum + (prod ? prod.precio : 0);
  }, 0);

  const iva = subtotal * config.ivaTasa;
  const total = subtotal + iva;

  const ahora = new Date();
  const hora = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, "0")}`;

const nuevoPedido = {
    id: `P-00${estadoGlobal.siguienteIdPedido++}`,
    mesa: mesa,
    items: [...items],
    estado: "pendiente",
    hora: hora,
    notas: notas,
    subtotal: subtotal,
    iva: iva,
    total: total
  };
  
  pedidos.unshift(nuevoPedido);
  actualizarTotalCaja();
  if (document.getElementById("view-pedidos").classList.contains("active")) renderizarPedidos();
  mostrarToast(`Pedido creado para ${mesa}`);
  return true;
}

function renderizarPedidos() {
  const contenedor = document.getElementById("lista-pedidos");
  if (!pedidos.length) {
    contenedor.innerHTML = `<div class="empty-state"><i class="ti ti-clipboard-off"></i><p>No hay pedidos</p></div>`;
    return;
  }
  
  contenedor.innerHTML = pedidos.map(p => {
    const info = estadosPedido[p.estado];
    // Usamos destructuring para extraer subtotal, iva, total
    const { subtotal, iva, total } = p;
    return `
      <div class="card order-card ${p.estado}">
        <div class="order-header">
          <span class="order-num"><i class="ti ti-receipt"></i> ${p.id} — ${p.mesa}</span>
          <span class="badge ${info.clase}">${info.etiqueta}</span>
        </div>
        <div class="order-meta"><i class="ti ti-clock"></i> ${p.hora} ${p.notas ? `· ${p.notas}` : ""}</div>
        <div class="order-items">${p.items.join(" · ")}</div>
        <div style="margin: 0.5rem 0; border-top: 1px solid #eee; padding-top: 0.5rem;">
          <div><strong>Subtotal:</strong> ${config.moneda}${subtotal.toFixed(2)}</div>
          <div><strong>IVA (${(config.ivaTasa * 100)}%):</strong> ${config.moneda}${iva.toFixed(2)}</div>
          <div><strong>Total:</strong> ${config.moneda}${total.toFixed(2)}</div>
        </div>
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

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}