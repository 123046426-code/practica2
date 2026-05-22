let productosCocina = [
    {
        id: 1,
        nombre: "Cafe Americano",
        precio: 35,
        categoria: "bebida",
        estado: "activo",
        stock: 10,
        promocion: false
    },
    {
        id: 2,
        nombre: "Cappuccino",
        precio: 55,
        categoria: "bebida",
        estado: "activo",
        stock: 8,
        promocion: true
    },
    {
        id: 3,
        nombre: "Te Verde",
        precio: 30,
        categoria: "bebida",
        estado: "activo",
        stock: 15,
        promocion: false
    },
    {
        id: 4,
        nombre: "Brownie",
        precio: 45,
        categoria: "postre",
        estado: "activo",
        stock: 5,
        promocion: true
    },
    {
        id: 5,
        nombre: "Sandwich Club",
        precio: 120,
        categoria: "comida",
        estado: "activo",
        stock: 3,
        promocion: false
    },
    {
        id: 6,
        nombre: "pan de azucar",
        precio: 10,
        categoria: "postre",
        estado: "activo",
        stock: 19,
        promocion: false
    }
];

export function inicializarCocina(productosGlobal) {
    productosCocina = productosGlobal;
    console.log("Modulo Cocina inicializado");
}

export function productosBaratosCocina() {
    return productosCocina.filter(
        p => p.precio < 50 && p.estado === "activo"
    );
}

export function productosCarosCocina() {
    return productosCocina.filter(
        p => p.precio >= 100 && p.estado === "activo"
    );
}

export function bebidasCocina() {
    return productosCocina.filter(
        p => p.categoria === "bebida" && p.estado === "activo"
    );
}

export function postresCocina() {
    return productosCocina.filter(
        p => p.categoria === "postre" && p.estado === "activo"
    );
}

export function buscarNombreCocina(nombre) {
    return productosCocina.find(
        p => p.nombre.toLowerCase() === nombre.toLowerCase()
    );
}

export function buscarIdCocina(id) {
    return productosCocina.find(
        p => p.id === id
    );
}

function mostrarCocina(lista) {
    if(lista.length === 0) {
        console.log("No se encontraron productos");
        return;
    }
    lista.forEach(p => {
        console.log(
            `${p.nombre} - $${p.precio} [${p.categoria}]`
        );
    });
}

export function mostrarMenuCocina() {
    console.log("\n====== COCINA ======");
    console.log("1. Productos baratos");
    console.log("2. Productos caros");
    console.log("3. Bebidas");
    console.log("4. Postres");
    console.log("5. Buscar por nombre");
    console.log("6. Buscar por ID");
    console.log("7. Agregar producto");
    console.log("8. Editar producto");
    console.log("9. Eliminar producto");
    console.log("10. Listar productos");
    console.log("11. Salir");
}

export function verBaratosCocina() {
    console.log("\n====== PRODUCTOS BARATOS ======\n");
    mostrarCocina(productosBaratosCocina());
}

export function verCarosCocina() {
    console.log("\n====== PRODUCTOS CAROS ======\n");
    mostrarCocina(productosCarosCocina());
}

export function verBebidasCocina() {
    console.log("\n====== BEBIDAS ======\n");
    mostrarCocina(bebidasCocina());
}

export function verPostresCocina() {
    console.log("\n====== POSTRES ======\n");
    mostrarCocina(postresCocina());
}

export function agregarProductoCocina(nombre, precio, categoria, stock, promocion) {
    const nuevosIds = productosCocina.map(p => p.id);
    const maxId = Math.max(...nuevosIds, 0);
    const nuevoId = maxId + 1;
    
    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        precio: precio,
        categoria: categoria,
        estado: "activo",
        stock: stock,
        promocion: promocion
    };
    productosCocina.push(nuevoProducto);
    console.log(`Producto "${nombre}" agregado con ID ${nuevoId}`);
    return nuevoProducto;
}

export function editarProductoCocina(id, nuevosDatos) {
    const producto = buscarIdCocina(id);
    if (!producto) {
        console.log(`Producto con ID ${id} no encontrado`);
        return null;
    }
    if (nuevosDatos.nombre) producto.nombre = nuevosDatos.nombre;
    if (nuevosDatos.precio) producto.precio = nuevosDatos.precio;
    if (nuevosDatos.categoria) producto.categoria = nuevosDatos.categoria;
    if (nuevosDatos.stock !== undefined) producto.stock = nuevosDatos.stock;
    if (nuevosDatos.promocion !== undefined) producto.promocion = nuevosDatos.promocion;
    console.log(`Producto ${id} actualizado`);
    return producto;
}

export function eliminarProductoCocina(id) {
    const producto = buscarIdCocina(id);
    if (!producto) {
        console.log(`Producto con ID ${id} no encontrado`);
        return false;
    }
    producto.estado = "eliminado";
    console.log(`Producto "${producto.nombre}" eliminado`);
    return true;
}

export function listarProductosCocina() {
    console.log("\n====== LISTA DE PRODUCTOS ACTIVOS ======\n");
    const activos = productosCocina.filter(p => p.estado === "activo");
    mostrarCocina(activos);
    return activos;
}