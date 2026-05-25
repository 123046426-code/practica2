import { prepararPedido } from "./cocina.js";
let productosCliente = [];
let pedidosCliente = [];

export function inicializarCliente(productosGlobal, pedidosGlobal) {
    productosCliente = productosGlobal;
    pedidosCliente = pedidosGlobal;
    console.log("Modulo Cliente inicializado");
}

export function verProductosCliente() {
    console.log("Mostrando productos");

    let disponibles = [];

    for (let i = 0; i < productosCliente.length; i++) {
        if (productosCliente[i].stock > 0 && productosCliente[i].estado === "activo") {
            disponibles.push(productosCliente[i]);
        }
    }

    if (disponibles.length === 0) {
        console.log("No hay productos disponibles");
        return;
    }

    console.log("\n====== PRODUCTOS ======\n");

    const lista = disponibles.map(producto => {
        let promo = producto.promocion ? "PROMO" : "";
        return `${producto.id}. ${producto.nombre} - $${producto.precio} (Stock: ${producto.stock}) ${promo}`;
    });

    lista.forEach(linea => {
        console.log(linea);
    });
}

export function verPromocionesCliente() {
    console.log("Mostrando promociones");

    let promociones = [];

    for (let i = 0; i < productosCliente.length; i++) {
        if (
            productosCliente[i].promocion === true &&
            productosCliente[i].stock > 0 &&
            productosCliente[i].estado === "activo"
        ) {
            promociones.push(productosCliente[i]);
        }
    }

    if (promociones.length === 0) {
        console.log("No hay promociones disponibles");
        return;
    }

    console.log("\n====== PROMOCIONES ======\n");

    promociones.forEach(producto => {
        console.log(`${producto.id}. ${producto.nombre} - $${producto.precio}`);
    });
}

export async function hacerPedidoCliente(idProducto) {

    const idNumerico = parseInt(idProducto);

    console.log(
        `\n🛒 Cliente realizando pedido...`
    );

    let productoEncontrado = null;

    for (let i = 0; i < productosCliente.length; i++) {

        if (
            productosCliente[i].id === idNumerico &&
            productosCliente[i].stock > 0 &&
            productosCliente[i].estado === "activo"
        ) {

            productoEncontrado =
                productosCliente[i];

            break;
        }
    }

    // PRODUCTO NO EXISTE
    if (productoEncontrado === null) {

        console.log(
            " Producto no disponible"
        );

        return false;
    }

    try {

        // ENVIAR A COCINA
        const respuestaCocina =
            await prepararPedido(
                productoEncontrado.nombre
            );

        console.log(
            "\n====== COCINA ======"
        );

        console.log(respuestaCocina);

        // GENERAR PEDIDO
        const ahora = new Date();

        const hora =
            `${ahora.getHours()}:` +
            `${String(
                ahora.getMinutes()
            ).padStart(2, "0")}`;

        const nuevoPedido = {

            id: pedidosCliente.length + 1,

            mesa: "Cliente",

            items: [
                productoEncontrado.nombre
            ],

            estado: "preparado",

            hora: hora,

            notas: "",

            subtotal:
                productoEncontrado.precio,

            iva:
                productoEncontrado.precio * 0.16,

            total:
                productoEncontrado.precio * 1.16
        };

        pedidosCliente.push(nuevoPedido);

        // NOTIFICACION
        console.log(
            "\n====== CLIENTE ======"
        );

        console.log(
            ` Pedido #${nuevoPedido.id} listo`
        );

        console.log(
            `Total: $${nuevoPedido.total.toFixed(2)}`
        );

        return true;

    } catch (error) {

        console.log(
            "\n====== ERROR ======"
        );

        console.log(error);

        return false;
    }
}
export function verPedidosCliente() {
    console.log("Mostrando pedidos");

    if (pedidosCliente.length === 0) {
        console.log("No hay pedidos registrados");
        return;
    }

    console.log("\n====== MIS PEDIDOS ======\n");

    for (let i = 0; i < pedidosCliente.length; i++) {
        const pedido = pedidosCliente[i];
        console.log(`Pedido #${pedido.id} - ${pedido.hora}`);
        console.log(`Items: ${pedido.items.join(", ")}`);
        console.log(`Total: $${pedido.total.toFixed(2)}`);
        console.log(`Estado: ${pedido.estado}`);
        console.log("");
    }
}

export function mostrarMenuCliente() {
    console.log("\n===== CLIENTE =====");
    console.log("1. Ver productos");
    console.log("2. Hacer pedido");
    console.log("3. Ver pedidos");
    console.log("4. Ver promociones");
    console.log("5. Salir");
}