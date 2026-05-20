// cocina.js – Módulo Cocina: CRUD de productos

function renderizarProductos() {
  const busqueda = document.getElementById("buscar-prod").value.toLowerCase();
  const categoria = document.getElementById("filtro-cat").value;

  const filtrados = productos.filter(p => {
    const coincideNombre = !busqueda || p.nombre.toLowerCase().includes(busqueda);
    const coincideCat = !categoria || p.categoria === categoria;
    return coincideNombre && coincideCat;
  });

  const tbody = document.getElementById("prod-tbody");
  if (!filtrados.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;">No se encontraron productos</td></tr>`;
    return;
  }

  tbody.innerHTML = filtrados.map(p => `
    <tr>
      <td><div class="prod-nombre">${p.nombre}</div>${p.desc ? `<div class="prod-desc">${p.desc}</div>` : ""}</td>
      <td><span class="cat-pill">${p.categoria}</span></td>
      <td>${config.moneda}${p.precio.toFixed(2)}</td>
      <td class="${claseStock(p.stock)}">${etiquetaStock(p.stock)}</td>
      <td><span class="badge ${p.estado === "activo" ? "badge-activo" : "badge-inactivo"}">${p.estado === "activo" ? "Activo" : "Inactivo"}</span></td>
      <td>
        <button class="btn btn-sm" onclick="abrirModal(${p.id})" style="margin-right:6px;"><i class="ti ti-edit"></i> Editar</button>
        <button class="btn btn-sm btn-danger" onclick="pedirConfirmacionEliminar(${p.id})"><i class="ti ti-trash"></i></button>
      </td>
    </tr>
  `).join("");
}

function claseStock(stock) {
  if (stock === 0) return "stock-out";
  if (stock <= config.stockBajoEn) return "stock-low";
  return "stock-ok";
}

function etiquetaStock(stock) {
  if (stock === 0) return `<i class="ti ti-alert-circle"></i> Sin stock`;
  if (stock <= config.stockBajoEn) return `<i class="ti ti-alert-triangle"></i> ${stock}`;
  return `${stock}`;
}

function abrirModal(id) {
  document.getElementById("modal-producto").classList.add("open");
  const catSelect = document.getElementById("p-cat");
  catSelect.innerHTML = config.categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("");

  if (id !== null) {
    const p = productos.find(x => x.id === id);
    document.getElementById("modal-titulo").textContent = "Editar producto";
    document.getElementById("edit-id").value = p.id;
    document.getElementById("p-nombre").value = p.nombre;
    document.getElementById("p-cat").value = p.categoria;
    document.getElementById("p-precio").value = p.precio;
    document.getElementById("p-stock").value = p.stock;
    document.getElementById("p-desc").value = p.desc;
    document.getElementById("p-estado").value = p.estado;
  } else {
    document.getElementById("modal-titulo").textContent = "Agregar producto";
    document.getElementById("edit-id").value = "";
    ["p-nombre", "p-precio", "p-stock", "p-desc"].forEach(campo => document.getElementById(campo).value = "");
    document.getElementById("p-cat").value = config.categorias[0];
    document.getElementById("p-estado").value = "activo";
  }
}

function cerrarModal() {
  document.getElementById("modal-producto").classList.remove("open");
}

function guardarProducto() {
  const nombre = document.getElementById("p-nombre").value.trim();
  const precio = parseFloat(document.getElementById("p-precio").value);
  const stock = parseInt(document.getElementById("p-stock").value);
  if (!nombre || isNaN(precio) || isNaN(stock)) {
    mostrarToast("Completa todos los campos requeridos");
    return;
  }
  const datosProd = {
    nombre, precio, stock,
    categoria: document.getElementById("p-cat").value,
    desc: document.getElementById("p-desc").value.trim(),
    estado: document.getElementById("p-estado").value,
  };
  const idEdicion = document.getElementById("edit-id").value;
  if (idEdicion) {
    const idx = productos.findIndex(p => p.id == idEdicion);
    productos[idx] = { ...productos[idx], ...datosProd };
    mostrarToast("Producto actualizado");
  } else {
    productos.push({ id: estado.siguienteIdProducto++, ...datosProd });
    mostrarToast("Producto agregado");
  }
  cerrarModal();
  renderizarProductos();
}

function pedirConfirmacionEliminar(id) {
  estado.productoAEliminar = id;
  document.getElementById("confirm-overlay").classList.add("open");
}

function cerrarConfirmacion() {
  document.getElementById("confirm-overlay").classList.remove("open");
  estado.productoAEliminar = null;
}

function confirmarEliminar() {
  if (estado.productoAEliminar !== null) {
    productos = productos.filter(p => p.id !== estado.productoAEliminar);
    mostrarToast("Producto eliminado");
    cerrarConfirmacion();
    renderizarProductos();
  }
}