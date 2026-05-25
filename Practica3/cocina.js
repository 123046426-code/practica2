let productosCocina = [];


export function inicializarCocina(productosGlobal) {

    productosCocina = productosGlobal;

    console.log(" Modulo Cocina inicializado");
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
        p => p.categoria === "bebida" &&
            p.estado === "activo"
    );
}

export function postresCocina() {

    return productosCocina.filter(
        p => p.categoria === "postre" &&
            p.estado === "activo"
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

    if (lista.length === 0) {

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
export function listarProductosCocina() {

    console.log("\n====== PRODUCTOS ACTIVOS ======\n");

    const activos = productosCocina.filter(
        p => p.estado === "activo"
    );

    mostrarCocina(activos);

    return activos;
}



export function agregarProductoCocina(
    nombre,
    precio,
    categoria,
    stock,
    promocion
) {

    return new Promise((resolve, reject) => {

        console.log("\n Registrando producto...");

        setTimeout(() => {

            if (!nombre || precio <= 0) {

                reject(" Datos inválidos");
                return;
            }

            const nuevosIds = productosCocina.map(
                p => p.id
            );

            const maxId = Math.max(...nuevosIds, 0);

            const nuevoProducto = {

                id: maxId + 1,
                nombre,
                precio,
                categoria,
                estado: "activo",
                stock,
                promocion
            };

            productosCocina.push(nuevoProducto);

            resolve(
                ` Producto "${nombre}" agregado correctamente`
            );

        }, 2000);

    });
}


export function editarProductoCocina(id, nuevosDatos) {

    return new Promise((resolve, reject) => {

        console.log("\n Actualizando producto...");

        setTimeout(() => {

            const producto = buscarIdCocina(id);

            if (!producto) {

                reject(" Producto no encontrado");
                return;
            }

            if (nuevosDatos.nombre)
                producto.nombre = nuevosDatos.nombre;

            if (nuevosDatos.precio)
                producto.precio = nuevosDatos.precio;

            if (nuevosDatos.categoria)
                producto.categoria = nuevosDatos.categoria;

            if (nuevosDatos.stock !== undefined)
                producto.stock = nuevosDatos.stock;

            if (nuevosDatos.promocion !== undefined)
                producto.promocion = nuevosDatos.promocion;

            resolve(
                ` Producto ${id} actualizado`
            );

        }, 2000);

    });
}


export function eliminarProductoCocina(id) {

    return new Promise((resolve, reject) => {

        console.log("\n Eliminando producto...");

        setTimeout(() => {

            const producto = buscarIdCocina(id);

            if (!producto) {

                reject(" Producto no encontrado");
                return;
            }

            producto.estado = "eliminado";

            resolve(
                ` Producto "${producto.nombre}" eliminado`
            );

        }, 2000);

    });
}



export function prepararPedido(nombreProducto) {

    return new Promise((resolve, reject) => {

        console.log("\n Cocina preparando pedido...");

        setTimeout(() => {

            const producto = buscarNombreCocina(
                nombreProducto
            );

            // PRODUCTO NO EXISTE
            if (!producto) {

                reject(
                    "Error: producto inexistente"
                );

                return;
            }

            // PRODUCTO ELIMINADO
            if (producto.estado !== "activo") {

                reject(
                    " Producto no disponible"
                );

                return;
            }

            // SIN STOCK
            if (producto.stock <= 0) {

                reject(
                    " Ingredientes agotados"
                );

                return;
            }

            // SIMULACION DE MUCHOS PEDIDOS
            const cocinaOcupada =
                Math.random() < 0.2;

            if (cocinaOcupada) {

                reject(
                    " Cocina saturada"
                );

                return;
            }

            // DESCONTAR STOCK
            producto.stock--;

            resolve(
                ` Pedido listo: ${producto.nombre}
            | Stock restante: ${producto.stock}`
            );

        }, 3000);

    });
}