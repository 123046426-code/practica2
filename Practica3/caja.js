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
    },
    "preparado": {
        etiqueta: "Preparado",
        clase: "preparado"
    }
};

let productosCaja = [];

export function inicializarCaja(pedidosGlobal, productosGlobal) {
    pedidosCaja = pedidosGlobal;
    productosCaja = productosGlobal;
    console.log("Módulo Caja inicializado");
}

function actualizarTotalCaja() {
    totalAcumuladoCaja = pedidosCaja.reduce(
        (acumulador, pedido) => acumulador + pedido.total,
        0
    );
}

export function verPedidosCaja() {
    console.log("\n====== LISTA DE TODOS LOS PEDIDOS ======\n");

    if (pedidosCaja.length === 0) {
        console.log("No hay pedidos registrados.");
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
        } else {
            console.log(`Pedido #${id} — ${mesa} (estado desconocido: ${estado})`);
            console.log(`Items: ${items.join(" · ")}`);
            console.log(`Total: ${configCaja.moneda}${total.toFixed(2)}`);
            console.log("");
        }
    });

    actualizarTotalCaja();
    const totalPedidos = pedidosCaja.length;
    console.log("====== RESUMEN DE CAJA ======");
    console.log(`Total de pedidos: ${totalPedidos}`);
    console.log(`Total acumulado: ${configCaja.moneda}${totalAcumuladoCaja.toFixed(2)}`);
}

// Función asíncrona con callback para cancelar un pedido
export function cancelarPedidoCaja(id, callback) {
    console.log(`\n Solicitando cancelación del pedido #${id}...`);

    setTimeout(() => {
        const pedido = pedidosCaja.find(p => p.id === id);
        if (!pedido) {
            callback(` Pedido #${id} no encontrado`, null);
            return;
        }
        if (pedido.estado === "cancelado") {
            callback(` El pedido #${id} ya estaba cancelado`, null);
            return;
        }
        if (pedido.estado === "listo" || pedido.estado === "preparado") {
            callback(` No se puede cancelar el pedido #${id} porque ya está ${pedido.estado}`, null);
            return;
        }

        // Cambiar estado y actualizar total
        pedido.estado = "cancelado";
        actualizarTotalCaja();

        callback(null, ` Pedido #${id} cancelado correctamente`);
    }, 2000); // simula proceso asíncrono de 2 segundos
}

// Función asíncrona con callback para marcar un pedido como listo (útil si quieres forzar desde caja)
export function marcarPedidoListoCaja(id, callback) {
    console.log(`\n Marcando pedido #${id} como listo...`);

    setTimeout(() => {
        const pedido = pedidosCaja.find(p => p.id === id);
        if (!pedido) {
            callback(` Pedido #${id} no encontrado`, null);
            return;
        }
        if (pedido.estado === "listo") {
            callback(` El pedido #${id} ya estaba listo`, null);
            return;
        }
        if (pedido.estado === "cancelado") {
            callback(` No se puede marcar como listo un pedido cancelado`, null);
            return;
        }

        pedido.estado = "listo";
        callback(null, ` Pedido #${id} marcado como listo`);
    }, 1500);
}