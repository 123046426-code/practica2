// cocina.js - Módulo Cocina: CRUD de productos

function renderizarProductos() {
  const tbody = document.getElementById("prod-tbody");
  if (!productos.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay productos registrados</td></tr>`;
    return;
  }
  tbody.innerHTML = productos.map(p => {
    let stockClass = "";
    let stockHtml = "";
    if (p.stock === 0) {
      stockClass = "stock-out";
      stockHtml = `<i class="ti ti-alert-circle"></i> Sin stock`;
    } else if (p.stock <= config.stockBajoEn) {
      stockClass = "stock-low";
      stockHtml = `<i class="ti ti-alert-triangle"></i> ${p.stock}`;
    } else {
      stockClass = "stock-ok";
      stockHtml = `${p.stock}`;
    }
    return `
      <tr>
        <td><div class="prod-nombre">${p.nombre}</div>${p.desc ? `<div class="prod-desc">${p.desc}</div>` : ""}</td>
        <td><span class="cat-pill">${p.categoria}</span></td>
        <td>${config.moneda}${p.precio.toFixed(2)}</td>
        <td class="${stockClass}">${stockHtml}</td>
        <td><span class="${p.estado === "activo" ? "badge-activo" : "badge-inactivo"}">${p.estado === "activo" ? "Activo" : "Inactivo"}</span></td>
        <td>
          <button class="btn btn-sm" onclick="abrirModal(${p.id})" style="margin-right:6px;"><i class="ti ti-edit"></i> Editar</button>
          <button class="btn btn-sm btn-danger" onclick="pedirConfirmacionEliminar(${p.id})"><i class="ti ti-trash"></i></button>
        </td>
      </tr>
    `;
  }).join("");
}

function abrirModal(id) {
  document.getElementById("modal-producto")
    .classList.add("open");
  const catSelect = document.getElementById("p-cat");
  catSelect.innerHTML = config.categorias.map(cat =>
    `<option value="${cat}">${cat}</option>`
  ).join("");


  if (id !== null) {

    const p = productos.find(x => x.id === id);

    document.getElementById("modal-titulo")
      .textContent = "Editar producto";
    document.getElementById("edit-id").value = p.id;
    document.getElementById("p-nombre").value = p.nombre;
    document.getElementById("p-cat").value = p.categoria;
    document.getElementById("p-precio").value = p.precio;
    document.getElementById("p-stock").value = p.stock;
    document.getElementById("p-desc").value = p.desc;
    document.getElementById("p-estado").value = p.estado;
  } else {

    document.getElementById("modal-titulo")
      .textContent = "Agregar producto";
    document.getElementById("edit-id").value = "";
    ["p-nombre", "p-precio", "p-stock", "p-desc"]
      .forEach(campo =>
        document.getElementById(campo).value = ""
      );
    document.getElementById("p-cat").value =
      config.categorias[0];
    document.getElementById("p-estado").value =
      "activo";
  }
}
function cerrarModal() {

  document.getElementById("modal-producto")
    .classList.remove("open");
}

function guardarProducto() {
  const nombre =
    document.getElementById("p-nombre")
      .value.trim();
  const precio =
    parseFloat(
      document.getElementById("p-precio").value
    );
  const stock =
    parseInt(
      document.getElementById("p-stock").value
    );

  if (!nombre || isNaN(precio) || isNaN(stock)) {
    mostrarToast("Completa todos los campos requeridos");
    return;
  }


  const datosProd = {
    nombre,
    precio,
    stock,
    categoria:
      document.getElementById("p-cat").value,
    desc:
      document.getElementById("p-desc")
        .value.trim(),
    estado:
      document.getElementById("p-estado").value,
  };


  const idEdicion =
    document.getElementById("edit-id").value;
  if (idEdicion) {
    const idx = productos.findIndex(
      p => p.id == idEdicion
    );
    productos[idx] = {
      ...productos[idx],
      ...datosProd
    };

    mostrarToast("Producto actualizado");
  } else {
    productos.push({
      id: estadoGlobal.siguienteIdProducto++,
      ...datosProd
    });

    mostrarToast("Producto agregado");
  }
  cerrarModal();
  renderizarProductos();
}
function pedirConfirmacionEliminar(id) {
  estadoGlobal.productoAEliminar = id;
  document.getElementById("confirm-overlay")
    .classList.add("open");
}

function cerrarConfirmacion() {
  document.getElementById("confirm-overlay")
    .classList.remove("open");
  estadoGlobal.productoAEliminar = null;
}


function confirmarEliminar() {
  if (estadoGlobal.productoAEliminar !== null) {

    productos = productos.filter(
      p => p.id !== estadoGlobal.productoAEliminar
    );
    mostrarToast("Producto eliminado");
    cerrarConfirmacion();
    renderizarProductos();
  }
}


// funciones agregadas
function productosBaratos() {

  const baratos = productos.filter(p =>
    p.precio <= 100
  );

  renderizarProductos(baratos);
}

function productosCaros() {

  const caros = productos.filter(p =>
    p.precio > 100
  );

  renderizarProductos(caros);
}

function mostrarBebidas() {

  const bebidas = productos.filter(p =>
    p.categoria.toLowerCase() === "bebidas"
  );

  renderizarProductos(bebidas);
}


function mostrarPostres() {

  const postres = productos.filter(p =>
    p.categoria.toLowerCase() === "postres"
  );

  renderizarProductos(postres);
}


function buscarProducto(nombreBuscado) {

  const producto = productos.find(p =>
    p.nombre.toLowerCase() === nombreBuscado.toLowerCase()
  );


  if (producto) {

    renderizarProductos([producto]);

  } else {

    alert("Producto no encontrado");
  }
}

function mostrarTodos() {

  renderizarProductos(productos);
}