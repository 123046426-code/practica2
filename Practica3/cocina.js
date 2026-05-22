///////modulo de cocina


let productos = [];

export function inicializarCocina(productosGlobal) {
    productos = productosGlobal;
    console.log("Modulo Cocina inicializado");
}

// filter - regresa varios resultados
export function productosBaratos() {
    return productos.filter(p => p.precio < 50 && p.estado === "activo");
}

export function productosCaros() {
    return productos.filter(p => p.precio >= 100 && p.estado === "activo");
}

export function bebidas() {
    return productos.filter(p => p.categoria === "bebida" && p.estado === "activo");
}

export function postres() {
    return productos.filter(p => p.categoria === "postre" && p.estado === "activo");
}

// find - regresa uno solo
export function buscarNombre(nombre) {
    return productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
}

export function buscarId(id) {
    return productos.find(p => p.id === id);
}

function mostrar(lista) {
    if (lista.length === 0) {
        console.log("No se encontraron productos");
        return;
    }
    lista.forEach(p => {
        console.log(`${p.nombre} - $${p.precio} [${p.categoria}]`);
    });
}

export function mostrarMenu() {
    console.log("\n====== COCINA ======");
    console.log("1. Productos baratos");
    console.log("2. Productos caros");
    console.log("3. Bebidas");
    console.log("4. Postres");
    console.log("5. Buscar por nombre");
    console.log("6. Buscar por ID");
    console.log("7. Salir");
}

export function verBaratos() {
    console.log("\n====== PRODUCTOS BARATOS ======\n");
    mostrar(productosBaratos());
}

export function verCaros() {
    console.log("\n====== PRODUCTOS CAROS ======\n");
    mostrar(productosCaros());
}

export function verBebidas() {
    console.log("\n====== BEBIDAS ======\n");
    mostrar(bebidas());
}

export function verPostres() {
    console.log("\n====== POSTRES ======\n");
    mostrar(postres());
}