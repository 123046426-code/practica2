
import { prepararPedido } from "./cocina.js";
let pedidosCaja = [];
let totalAcumuladoCaja = 0;

let estadoGlobalCaja = {
    siguienteIdPedido: 1
};

const configCaja = {
    moneda: "$",
    ivaTasa: 0.16
};

const estadosPedidoCaja = {
    "pendiente": {
        etiqueta: "Pendiente",
        clase: "pendiente"
    },
    "en-preparacion": {
        etiqueta: "En preparación",
        clase: "preparacion"
    },
    "listo": {
        etiqueta: "Listo",
        clase: "listo"
    },
    "cancelado": {
        etiqueta: "Cancelado",
        clase: "cancelado"
    }
};

let productosCaja = [];

export function inicializarCaja(pedidosGlobal, productosGlobal) {
    pedidosCaja = pedidosGlobal;
    productosCaja = productosGlobal;
    console.log("Modulo Caja inicializado");
}

function actualizarTotalCaja() {
    totalAcumuladoCaja = pedidosCaja.reduce((acumulador, pedido) => {
        return acumulador + pedido.total;
    }, 0);
}

export async function agregarPedidoCaja(
    mesa,
    items,
    notas = ""
) {

    if (!mesa || !items || items.length === 0) {

        console.log(
            "❌ Mesa y items requeridos"
        );

        return false;
    }

    const { ivaTasa } = configCaja;

    const { siguienteIdPedido } =
        estadoGlobalCaja;

    // CALCULAR SUBTOTAL
    const subtotal = items.reduce(
        (acumulador, nombreItem) => {

            const producto =
                productosCaja.find(
                    p =>
                        p.nombre === nombreItem &&
                        p.estado === "activo"
                );

            return acumulador +
                (producto ? producto.precio : 0);

        }, 0
    );

    const iva = subtotal * ivaTasa;

    const total = subtotal + iva;

    const ahora = new Date();

    const hora =
        `${ahora.getHours()}:` +
        `${String(
            ahora.getMinutes()
        ).padStart(2, "0")}`;

    // CREAR PEDIDO
    const nuevoPedido = {

        id: siguienteIdPedido,

        mesa: mesa,

        items: [...items],

        estado: "pendiente",

        hora: hora,

        notas: notas,

        subtotal: subtotal,

        iva: iva,

        total: total
    };

    estadoGlobalCaja.siguienteIdPedido++;

    pedidosCaja.unshift(nuevoPedido);

    actualizarTotalCaja();

    console.log(
        `\n🧾 Pedido #${nuevoPedido.id} generado`
    );

    try {

        // CAMBIAR ESTADO
        nuevoPedido.estado =
            "en-preparacion";

        console.log(
            "\n Cocina preparando pedido..."
        );

        // PREPARAR CADA PRODUCTO
        for (const item of items) {

            const respuesta =
                await prepararPedido(item);

            console.log(respuesta);
        }

        // PEDIDO LISTO
        nuevoPedido.estado = "listo";

        console.log(
            "\n====== CLIENTE ======"
        );

        console.log(
            `Pedido #${nuevoPedido.id} listo`
        );

        console.log(
            `Total:
            ${configCaja.moneda}${total.toFixed(2)}`
        );

        return true;

    } catch (error) {

        nuevoPedido.estado =
            "cancelado";

        console.log(
            "\n====== ERROR ======"
        );

        console.log(error);

        return false;
    }
}

export function verPedidosCaja() {
    console.log("\n====== LISTA DE PEDIDOS ======\n");

    if (pedidosCaja.length === 0) {
        console.log("No hay pedidos");
        return;
    }

    pedidosCaja.forEach(pedido => {
        const { id, mesa, estado, hora, items, subtotal, iva, total } = pedido;
        const info = estadosPedidoCaja[estado];

        if (info) {
            console.log(`Pedido #${id} — ${mesa}`);
            console.log(`Estado: ${info.etiqueta}`);
            console.log(`Hora: ${hora}`);
            console.log(`Items: ${items.join(" · ")}`);
            console.log(`Subtotal: ${configCaja.moneda}${subtotal.toFixed(2)}`);
            console.log(`IVA: ${configCaja.moneda}${iva.toFixed(2)}`);
            console.log(`Total: ${configCaja.moneda}${total.toFixed(2)}`);
            console.log("");
        }
    });
}

export function verPedidosPorEstadoCaja(estado) {
    console.log(`\n====== PEDIDOS ${estado.toUpperCase()} ======\n`);

    const filtrados = pedidosCaja.filter(pedido => pedido.estado === estado);

    if (filtrados.length === 0) {
        console.log(`No hay pedidos en estado: ${estado}`);
        return;
    }

    filtrados.forEach(pedido => {
        const { id, mesa, total } = pedido;
        console.log(`Pedido #${id} - ${mesa} - Total: ${configCaja.moneda}${total.toFixed(2)}`);
    });
}

export function cambiarEstadoPedidoCaja(id, nuevoEstado) {
    const pedido = pedidosCaja.find(p => p.id === id);

    if (pedido) {
        if (estadosPedidoCaja[nuevoEstado]) {
            pedido.estado = nuevoEstado;
            console.log(`Pedido #${id}: ${estadosPedidoCaja[nuevoEstado].etiqueta}`);
            return true;
        } else {
            console.log(`Estado ${nuevoEstado} no es valido`);
            return false;
        }
    }

    console.log(`Pedido #${id} no encontrado`);
    return false;
}

export function mostrarResumenCaja() {
    console.log("\n====== RESUMEN CAJA ======\n");

    actualizarTotalCaja();

    const pendientes = pedidosCaja.filter(p => p.estado === "pendiente").length;
    const preparacion = pedidosCaja.filter(p => p.estado === "en-preparacion").length;
    const listos = pedidosCaja.filter(p => p.estado === "listo").length;
    const cancelados = pedidosCaja.filter(p => p.estado === "cancelado").length;

    console.log(`Pendientes: ${pendientes}`);
    console.log(`En preparacion: ${preparacion}`);
    console.log(`Listos: ${listos}`);
    console.log(`Cancelados: ${cancelados}`);

    console.log(`\nTotal acumulado: ${configCaja.moneda}${totalAcumuladoCaja.toFixed(2)}`);
}

export function mostrarMenuCaja() {
    console.log("\n====== CAJA ======");
    console.log("1. Ver todos los pedidos");
    console.log("2. Ver pedidos pendientes");
    console.log("3. Ver pedidos en preparacion");
    console.log("4. Ver pedidos listos");
    console.log("5. Cambiar estado de pedido");
    console.log("6. Ver resumen de caja");
    console.log("7. Agregar pedido");
    console.log("8. Salir");
}