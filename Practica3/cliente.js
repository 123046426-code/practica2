window.productos = [
    {
        id: 1,
        nombre: "Cafe Americano",
        precio: 45,
        stock: 10,
        promocion: true
    },
    {
        id: 2,
        nombre: "Capuccino",
        precio: 60,
        stock: 5,
        promocion: false
    },
    {
        id: 3,
        nombre: "Panini",
        precio: 70,
        stock: 3,
        promocion: true
    }
];

window.pedidos = [];

function mostrarSeccion(seccion) {
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('seccion-productos').style.display = 'none';
    document.getElementById('seccion-pedido').style.display = 'none';
    document.getElementById('seccion-lista-pedidos').style.display = 'none';
    document.getElementById('seccion-promociones').style.display = 'none';
    
    document.getElementById(seccion).style.display = 'block';
}

function verProductos() {
    console.log("Mostrando productos - Cliente");
    mostrarSeccion('seccion-productos');
    
    let disponibles = [];
    for(let i = 0; i < window.productos.length; i++) {
        if(window.productos[i].stock > 0) {
            disponibles.push(window.productos[i]);
        }
    }
    
    const container = document.getElementById('contenido-productos');
    
    // Investigaciob: map() - en este apartado transforma productos en tarjetas HTML
    const tarjetas = disponibles.map(producto => {
        let promoBadge = producto.promocion ? '<span class="badge-promo">PROMO</span>' : '';
        
        // Investigacion: template strings - Construye HTML dinámico
        return `
            <div class="producto-card">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio}</p>
                <p class="stock">Stock: ${producto.stock}</p>
                ${promoBadge}
                <button class="btn-agregar" onclick="agregarAlPedido(${producto.id})">
                    Agregar al pedido
                </button>
            </div>
        `;
    });
    
    // INnvestigacion: forEach() - Inserta cada tarjeta en el contenedor
    container.innerHTML = '';
    tarjetas.forEach(tarjeta => {
        container.innerHTML += tarjeta;
    });
}

function verPromociones() {
    console.log("Mostrando promociones - Cliente");
    mostrarSeccion('seccion-promociones');
    
    let promociones = [];
    for(let i = 0; i < window.productos.length; i++) {
        if(window.productos[i].promocion === true && window.productos[i].stock > 0) {
            promociones.push(window.productos[i]);
        }
    }
    
    const container = document.getElementById('contenido-promociones');
    
    if(promociones.length === 0) {
        container.innerHTML = '<p class="sin-resultados">No hay promociones disponibles</p>';
        return;
    }
    
    // Investigacion: map() - Transforma productos promocionales
    const tarjetasPromo = promociones.map(producto => {
        return `
            <div class="producto-card promo-card">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio}</p>
                <p class="precio-oferta">¡EN PROMOCIÓN!</p>
                <button class="btn-agregar" onclick="agregarAlPedido(${producto.id})">
                    Agregar al pedido
                </button>
            </div>
        `;
    });
    
    container.innerHTML = '';
    tarjetasPromo.forEach(tarjeta => {
        container.innerHTML += tarjeta;
    });
}

function hacerPedido() {
    console.log("Haciendo pedido - Cliente");
    mostrarSeccion('seccion-pedido');
    actualizarListaProductosPedido();
}

function actualizarListaProductosPedido() {
    const container = document.getElementById('lista-productos-pedido');
    const selectedContainer = document.getElementById('productos-seleccionados');
    
    let disponibles = [];
    for(let i = 0; i < window.productos.length; i++) {
        if(window.productos[i].stock > 0) {
            disponibles.push(window.productos[i]);
        }
    }
    
    // Investigacion: map() - Lista de productos disponibles
    const listaHTML = disponibles.map(producto => {
        return `
            <div class="item-pedido">
                <span><strong>${producto.id}</strong> - ${producto.nombre} - $${producto.precio}</span>
                <button class="btn-small" onclick="agregarProductoPedido(${producto.id})">
                    Agregar
                </button>
            </div>
        `;
    });
    
    container.innerHTML = '';
    listaHTML.forEach(item => {
        container.innerHTML += item;
    });
    
    if(window.pedidos.length > 0) {
        let total = 0;
        let seleccionadosHTML = '<h4>Productos seleccionados:</h4>';
        
        // Iinvestigacion: forEach() - Recorre pedidos actuales
        window.pedidos.forEach((producto, index) => {
            seleccionadosHTML += `
                <div class="item-seleccionado">
                    ${producto.nombre} - $${producto.precio}
                </div>
            `;
            total += producto.precio;
        });
        
        seleccionadosHTML += `<p class="total"><strong>TOTAL: $${total}</strong></p>`;
        seleccionadosHTML += `<button class="btn-finalizar" onclick="finalizarPedido()">Finalizar pedido</button>`;
        selectedContainer.innerHTML = seleccionadosHTML;
    } else {
        selectedContainer.innerHTML = '<p class="sin-resultados">No hay productos seleccionados</p>';
    }
}

function agregarProductoPedido(idProducto) {
    console.log(`Agregando producto ID: ${idProducto}`);
    
    let productoEncontrado = null;
    for(let i = 0; i < window.productos.length; i++) {
        if(window.productos[i].id === idProducto && window.productos[i].stock > 0) {
            productoEncontrado = window.productos[i];
            break;
        }
    }
    
    if(productoEncontrado !== null) {
        window.pedidos.push({...productoEncontrado});
        productoEncontrado.stock--;
        
        // Investigacion: template strings - Mensaje de confirmación
        alert(`${productoEncontrado.nombre} agregado al pedido`);
        actualizarListaProductosPedido();
        actualizarPedidosEnMenu();
    } else {
        alert("Producto no disponible");
    }
}

function verPedidos() {
    console.log("Ver pedidos - Cliente");
    mostrarSeccion('seccion-lista-pedidos');
    actualizarPedidosEnMenu();
}

function actualizarPedidosEnMenu() {
    const container = document.getElementById('contenido-pedidos');
    
    if(window.pedidos.length === 0) {
        container.innerHTML = '<p class="sin-resultados">No hay pedidos registrados</p>';
        return;
    }
    
    let total = 0;
    let pedidosHTML = '<div class="pedido-lista">';
    
    // Ivestigacion: forEach() - Recorre todos los pedidos
    window.pedidos.forEach((producto, index) => {
        pedidosHTML += `
            <div class="pedido-item">
                <span>${producto.nombre}</span>
                <span>$${producto.precio}</span>
            </div>
        `;
        total += producto.precio;
    });
    
    // Investigacion: template strings - Total del pedido
    pedidosHTML += `
        <div class="pedido-total">
            <strong>TOTAL: $${total}</strong>
        </div>
    `;
    
    container.innerHTML = pedidosHTML;
}

function finalizarPedido() {
    if(window.pedidos.length === 0) {
        alert("No hay productos en el pedido");
        return;
    }
    
    let total = 0;
    let resumen = "====== RESUMEN PEDIDO ======\n\n";
    
    window.pedidos.forEach(producto => {
        resumen += `${producto.nombre} - $${producto.precio}\n`;
        total += producto.precio;
    });
    
    resumen += `\nTOTAL: $${total}`;
    
    alert(resumen + "\n\nPedido enviado a caja para cobro");
    console.log("Pedido finalizado:", window.pedidos);
    
    window.pedidos = [];
    actualizarListaProductosPedido();
    actualizarPedidosEnMenu();
    mostrarMenuPrincipal();
}

function mostrarMenuPrincipal() {
    console.log("Mostrando menú principal - Cliente");
    mostrarSeccion('menu-principal');
}

function mostrarVista(vista) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const viewElement = document.getElementById(`view-${vista}`);
    if(viewElement) {
        viewElement.classList.add('active');
    }
    
    if(vista === 'cliente') {
        mostrarMenuPrincipal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarMenuPrincipal();
});