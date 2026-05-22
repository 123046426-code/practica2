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

function actualizarTotalCaja() {

    totalAcumuladoCaja = 0;

    for(let i = 0; i < pedidosCaja.length; i++) {

        totalAcumuladoCaja += pedidosCaja[i].total;

    }

    console.log(
        `Total acumulado (con IVA): ${configCaja.moneda}${totalAcumuladoCaja.toFixed(2)}`
    );
}

function agregarPedidoCaja(mesa, items, notas = "") {

    if(!mesa || !items.length) {

        return false;

    }

    let subtotal = 0;

    for(let i = 0; i < items.length; i++) {

        const nombreItem = items[i];

        for(let j = 0; j < productos.length; j++) {

            if(
                productos[j].nombre === nombreItem &&
                productos[j].estado === "activo"
            ) {

                subtotal += productos[j].precio;
                break;

            }

        }

    }

    const iva = subtotal * configCaja.ivaTasa;

    const total = subtotal + iva;

    const ahora = new Date();

    const hora =
        `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, "0")}`;

    const nuevoPedido = {

        id: `P-00${estadoGlobalCaja.siguienteIdPedido++}`,

        mesa: mesa,

        items: [...items],

        estado: "pendiente",

        hora: hora,

        notas: notas,

        subtotal: subtotal,

        iva: iva,

        total: total

    };

    pedidosCaja.unshift(nuevoPedido);

    actualizarTotalCaja();

    console.log(`Pedido creado para ${mesa}`);

    return true;
}

function verPedidosCaja() {

    console.log("\n====== LISTA DE PEDIDOS ======\n");

    if(pedidosCaja.length === 0) {

        console.log("No hay pedidos");
        return;

    }

    for(let i = 0; i < pedidosCaja.length; i++) {

        const p = pedidosCaja[i];

        const info = estadosPedidoCaja[p.estado];

        console.log(`${p.id} — ${p.mesa}`);

        console.log(`Estado: ${info.etiqueta}`);

        console.log(`Hora: ${p.hora}`);

        console.log(`Items: ${p.items.join(" · ")}`);

        console.log(
            `Subtotal: ${configCaja.moneda}${p.subtotal.toFixed(2)}`
        );

        console.log(
            `IVA: ${configCaja.moneda}${p.iva.toFixed(2)}`
        );

        console.log(
            `Total: ${configCaja.moneda}${p.total.toFixed(2)}`
        );

        console.log("");

    }

}

function verPedidosPorEstadoCaja(estado) {

    console.log(`\n====== PEDIDOS ${estado.toUpperCase()} ======\n`);

    let filtrados = [];

    for(let i = 0; i < pedidosCaja.length; i++) {

        if(pedidosCaja[i].estado === estado) {

            filtrados.push(pedidosCaja[i]);

        }

    }

    if(filtrados.length === 0) {

        console.log(`No hay pedidos en estado: ${estado}`);
        return;

    }

    for(let i = 0; i < filtrados.length; i++) {

        const p = filtrados[i];

        console.log(
            `${p.id} - ${p.mesa} - Total: ${configCaja.moneda}${p.total.toFixed(2)}`
        );

    }

}

function cambiarEstadoPedidoCaja(id, nuevoEstado) {

    let pedido = null;

    for(let i = 0; i < pedidosCaja.length; i++) {

        if(pedidosCaja[i].id === id) {

            pedido = pedidosCaja[i];
            break;

        }

    }

    if(pedido) {

        pedido.estado = nuevoEstado;

        console.log(
            `Pedido ${id}: ${estadosPedidoCaja[nuevoEstado].etiqueta}`
        );

        return true;

    }

    return false;
}

function mostrarResumenCaja() {

    console.log("\n====== RESUMEN CAJA ======\n");

    actualizarTotalCaja();

    let pendientes = 0;
    let preparacion = 0;
    let listos = 0;
    let cancelados = 0;

    for(let i = 0; i < pedidosCaja.length; i++) {

        switch(pedidosCaja[i].estado) {

            case "pendiente":
                pendientes++;
                break;

            case "en-preparacion":
                preparacion++;
                break;

            case "listo":
                listos++;
                break;

            case "cancelado":
                cancelados++;
                break;

        }

    }

    console.log(`Pendientes: ${pendientes}`);
    console.log(`En preparacion: ${preparacion}`);
    console.log(`Listos: ${listos}`);
    console.log(`Cancelados: ${cancelados}`);

    console.log(
        `\nTotal acumulado: ${configCaja.moneda}${totalAcumuladoCaja.toFixed(2)}`
    );
}

function mostrarMenuCaja() {

    console.log("\n====== CAJA ======");

    console.log("1. Ver todos los pedidos");
    console.log("2. Ver pedidos pendientes");
    console.log("3. Ver pedidos en preparacion");
    console.log("4. Ver pedidos listos");
    console.log("5. Cambiar estado de pedido");
    console.log("6. Ver resumen de caja");
    console.log("7. Salir");

}

function agregarPedidoEjemploCaja() {

    const itemsEjemplo = ["Cafe Americano"];

    agregarPedidoCaja(
        "Mesa 1",
        itemsEjemplo,
        "Sin azucar"
    );

    agregarPedidoCaja(
        "Mesa 2",
        ["Cappuccino"],
        ""
    );
}