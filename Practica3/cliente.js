// INVESTIGACIÓN: console.log, funciones, template strings, map(), forEach()

let productosCliente = [];
let pedidosCliente = [];

function inicializarCliente(productosGlobal, pedidosGlobal) {

    productosCliente = productosGlobal;
    pedidosCliente = pedidosGlobal;

    console.log("Modulo Cliente inicializado");
}

// INVESTIGACIÓN: funciones
function verProductosCliente() {

    console.log("Mostrando productos");

    let disponibles = [];

    for(let i = 0; i < productosCliente.length; i++) {

        if(productosCliente[i].stock > 0) {

            disponibles.push(productosCliente[i]);

        }

    }

    if(disponibles.length === 0) {

        console.log("No hay productos disponibles");
        return;

    }

    console.log("\n====== PRODUCTOS ======\n");

    // INVESTIGACIÓN: map()
    const lista = disponibles.map(producto => {

        let promo = producto.promocion ? "PROMO" : "";

        // INVESTIGACIÓN: template strings
        return `${producto.id}. ${producto.nombre} - $${producto.precio} (Stock: ${producto.stock}) ${promo}`;

    });

    // INVESTIGACIÓN: forEach()
    lista.forEach(linea => {

        console.log(linea);

    });

}

// INVESTIGACIÓN: funciones
function verPromocionesCliente() {

    console.log("Mostrando promociones");

    let promociones = [];

    for(let i = 0; i < productosCliente.length; i++) {

        if(
            productosCliente[i].promocion === true &&
            productosCliente[i].stock > 0
        ) {

            promociones.push(productosCliente[i]);

        }

    }

    if(promociones.length === 0) {

        console.log("No hay promociones disponibles");
        return;

    }

    console.log("\n====== PROMOCIONES ======\n");

    // INVESTIGACIÓN: forEach()
    promociones.forEach(producto => {

        // INVESTIGACIÓN: template strings
        console.log(`${producto.nombre} - $${producto.precio}`);

    });

}

// INVESTIGACIÓN: funciones
function hacerPedidoCliente(idProducto) {

    console.log(`Haciendo pedido del producto ID: ${idProducto}`);

    let productoEncontrado = null;

    let indexProducto = -1;

    for(let i = 0; i < productosCliente.length; i++) {

        if(
            productosCliente[i].id === idProducto &&
            productosCliente[i].stock > 0
        ) {

            productoEncontrado = productosCliente[i];

            indexProducto = i;

            break;

        }

    }

    if(productoEncontrado !== null) {

        pedidosCliente.push({...productoEncontrado});

        productosCliente[indexProducto].stock--;

        // INVESTIGACIÓN: template strings
        console.log(`${productoEncontrado.nombre} agregado al pedido`);

        return true;

    } else {

        console.log("Producto no disponible");

        return false;

    }

}

// INVESTIGACIÓN: funciones
function verPedidosCliente() {

    console.log("Mostrando pedidos");

    if(pedidosCliente.length === 0) {

        console.log("No hay pedidos registrados");
        return;

    }

    console.log("\n====== PEDIDOS ======\n");

    let total = 0;

    // INVESTIGACIÓN: forEach()
    pedidosCliente.forEach(producto => {

        // INVESTIGACIÓN: template strings
        console.log(`${producto.nombre} - $${producto.precio}`);

        total += producto.precio;

    });

    // INVESTIGACIÓN: template strings
    console.log(`\nTOTAL: $${total}`);

}

// INVESTIGACIÓN: funciones
function mostrarMenuCliente() {

    console.log("\n===== CLIENTE =====");

    console.log("1. Ver productos");
    console.log("2. Hacer pedido");
    console.log("3. Ver pedidos");
    console.log("4. Ver promociones");
    console.log("5. Salir");

}