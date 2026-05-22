// INVESTIGACIÓN: console.log, funciones, template strings, map(), forEach()

let productos = [];
let pedidos = [];

export function inicializarCliente(productosGlobal, pedidosGlobal) {
    productos = productosGlobal;
    pedidos = pedidosGlobal;
    console.log("Modulo Cliente inicializado");
}

// INVESTIGACIÓN: funciones
export function verProductos() {
    console.log("Mostrando productos");
    
    let disponibles = [];
    for(let i = 0; i < productos.length; i++) {
        if(productos[i].stock > 0) {
            disponibles.push(productos[i]);
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
export function verPromociones() {
    console.log("Mostrando promociones");
    
    let promociones = [];
    for(let i = 0; i < productos.length; i++) {
        if(productos[i].promocion === true && productos[i].stock > 0) {
            promociones.push(productos[i]);
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
export function hacerPedido(idProducto) {
    console.log(`Haciendo pedido del producto ID: ${idProducto}`);
    
    let productoEncontrado = null;
    let indexProducto = -1;
    
    for(let i = 0; i < productos.length; i++) {
        if(productos[i].id === idProducto && productos[i].stock > 0) {
            productoEncontrado = productos[i];
            indexProducto = i;
            break;
        }
    }
    
    if(productoEncontrado !== null) {
        pedidos.push({...productoEncontrado});
        productos[indexProducto].stock--;
        
        // INVESTIGACIÓN: template strings
        console.log(`${productoEncontrado.nombre} agregado al pedido`);
        return true;
    } else {
        console.log("Producto no disponible");
        return false;
    }
}

// INVESTIGACIÓN: funciones
export function verPedidos() {
    console.log("Mostrando pedidos");
    
    if(pedidos.length === 0) {
        console.log("No hay pedidos registrados");
        return;
    }
    
    console.log("\n====== PEDIDOS ======\n");
    
    let total = 0;
    
    // INVESTIGACIÓN: forEach()
    pedidos.forEach(producto => {
        // INVESTIGACIÓN: template strings
        console.log(`${producto.nombre} - $${producto.precio}`);
        total += producto.precio;
    });
    
    // INVESTIGACIÓN: template strings
    console.log(`\nTOTAL: $${total}`);
}

// INVESTIGACIÓN: funciones
export function mostrarMenu() {
    console.log("\n===== CLIENTE =====");
    console.log("1. Ver productos");
    console.log("2. Hacer pedido");
    console.log("3. Ver pedidos");
    console.log("4. Ver promociones");
    console.log("5. Salir");
}