let pedidos = [];
let totalAcumuladoCaja = 0;
let estadoGlobal = { siguienteIdPedido: 1 };
const config = { moneda: "$", ivaTasa: 0.16 };
const estadosPedido = {
    "pendiente": { etiqueta: "Pendiente", clase: "pendiente" },
    "en-preparacion": { etiqueta: "En preparación", clase: "preparacion" },
    "listo": { etiqueta: "Listo", clase: "listo" },
    "cancelado": { etiqueta: "Cancelado", clase: "cancelado" }
};

let productos = [];

export function inicializarCaja(pedidosGlobal, productosGlobal) {
    pedidos = pedidosGlobal;
    productos = productosGlobal;
    console.log("Modulo Caja inicializado");
}

function actualizarTotalCaja() {
    totalAcumuladoCaja = 0;
    for(let i = 0; i < pedidos.length; i++) {
        totalAcumuladoCaja += pedidos[i].total;
    }
    console.log(`Total acumulado (con IVA): ${config.moneda}${totalAcumuladoCaja.toFixed(2)}`);
}

export function agregarPedido(mesa, items, notas = "") {
    if (!mesa || !items.length) return false;

    let subtotal = 0;
    for(let i = 0; i < items.length; i++) {
        const nombreItem = items[i];
        for(let j = 0; j < productos.length; j++) {
            if(productos[j].nombre === nombreItem && productos[j].estado === "activo") {
                subtotal += productos[j].precio;
                break;
            }
        }
    }

    const iva = subtotal * config.ivaTasa;
    const total = subtotal + iva;

    const ahora = new Date();
    const hora = `${ahora.getHours()}:${String(ahora.getMinutes()).padStart(2, "0")}`;

    const nuevoPedido = {
        id: `P-00${estadoGlobal.siguienteIdPedido++}`,
        mesa: mesa,
        items: [...items],
        estado: "pendiente",
        hora: hora,
        notas: notas,
        subtotal: subtotal,
        iva: iva,
        total: total
    };
    
    pedidos.unshift(nuevoPedido);
    actualizarTotalCaja();
    console.log(`Pedido creado para ${mesa}`);
    return true;
}

export function verPedidos() {
    console.log("\n====== LISTA DE PEDIDOS ======\n");
    
    if(pedidos.length === 0) {
        console.log("No hay pedidos");
        return;
    }
    
    for(let i = 0; i < pedidos.length; i++) {
        const p = pedidos[i];
        const info = estadosPedido[p.estado];
        const { subtotal, iva, total } = p;
        
        console.log(`${p.id} — ${p.mesa}`);
        console.log(`   Estado: ${info.etiqueta}`);
        console.log(`   Hora: ${p.hora} ${p.notas ? `· ${p.notas}` : ""}`);
        console.log(`   Items: ${p.items.join(" · ")}`);
        console.log(`   Subtotal: ${config.moneda}${subtotal.toFixed(2)}`);
        console.log(`   IVA (${(config.ivaTasa * 100)}%): ${config.moneda}${iva.toFixed(2)}`);
        console.log(`   Total: ${config.moneda}${total.toFixed(2)}`);
        console.log("");
    }
}

export function verPedidosPorEstado(estado) {
    console.log(`\n====== PEDIDOS ${estado.toUpperCase()} ======\n`);
    
    let filtrados = [];
    for(let i = 0; i < pedidos.length; i++) {
        if(pedidos[i].estado === estado) {
            filtrados.push(pedidos[i]);
        }
    }
    
    if(filtrados.length === 0) {
        console.log(`No hay pedidos en estado: ${estado}`);
        return;
    }
    
    for(let i = 0; i < filtrados.length; i++) {
        const p = filtrados[i];
        console.log(`${p.id} - ${p.mesa} - Total: ${config.moneda}${p.total.toFixed(2)}`);
    }
}

export function cambiarEstadoPedido(id, nuevoEstado) {
    let pedido = null;
    for(let i = 0; i < pedidos.length; i++) {
        if(pedidos[i].id === id) {
            pedido = pedidos[i];
            break;
        }
    }
    
    if(pedido) {
        pedido.estado = nuevoEstado;
        console.log(`Pedido ${id}: ${estadosPedido[nuevoEstado].etiqueta}`);
        return true;
    }
    return false;
}

export function mostrarResumenCaja() {
    console.log("\n====== RESUMEN CAJA ======\n");
    
    actualizarTotalCaja();
    
    let pendientes = 0;
    let preparacion = 0;
    let listos = 0;
    let cancelados = 0;
    
    for(let i = 0; i < pedidos.length; i++) {
        switch(pedidos[i].estado) {
            case "pendiente": pendientes++; break;
            case "en-preparacion": preparacion++; break;
            case "listo": listos++; break;
            case "cancelado": cancelados++; break;
        }
    }
    
    console.log(`Pendientes: ${pendientes}`);
    console.log(`En preparacion: ${preparacion}`);
    console.log(`Listos: ${listos}`);
    console.log(`Cancelados: ${cancelados}`);
    console.log(`\nTotal acumulado: ${config.moneda}${totalAcumuladoCaja.toFixed(2)}`);
}

export function mostrarMenu() {
    console.log("\n====== CAJA ======");
    console.log("1. Ver todos los pedidos");
    console.log("2. Ver pedidos pendientes");
    console.log("3. Ver pedidos en preparacion");
    console.log("4. Ver pedidos listos");
    console.log("5. Cambiar estado de pedido");
    console.log("6. Ver resumen de caja");
    console.log("7. Salir");
}

export function getPedidos() {
    return pedidos;
}

export function agregarPedidoEjemplo() {
    const itemsEjemplo = ["Cafe Americano"];
    agregarPedido("Mesa 1", itemsEjemplo, "Sin azucar");
    agregarPedido("Mesa 2", ["Capuccino"], "");
}