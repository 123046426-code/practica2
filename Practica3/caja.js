// INVESTIGACIÓN: console.log, funciones, template strings, forEach()

let pedidos = [];
let totalAcumulado = 0;

export function inicializarCaja(pedidosGlobal) {
    pedidos = pedidosGlobal;
    console.log("Modulo Caja inicializado");
}

// INVESTIGACIÓN: funciones
export function verPedidosPendientes() {
    console.log("\n====== PEDIDOS PENDIENTES ======\n");
    
    if(pedidos.length === 0) {
        console.log("No hay pedidos pendientes");
        return;
    }
    
    // INVESTIGACIÓN: forEach()
    pedidos.forEach(pedido => {
        // INVESTIGACIÓN: template strings
        console.log(`ID: ${pedido.id}`);
        console.log(`   Mesa: ${pedido.mesa}`);
        console.log(`   Items: ${pedido.items.join(" · ")}`);
        console.log(`   Estado: ${pedido.estado}`);
        console.log(`   Subtotal: $${pedido.subtotal.toFixed(2)}`);
        console.log(`   IVA: $${pedido.iva.toFixed(2)}`);
        console.log(`   Total: $${pedido.total.toFixed(2)}`);
        console.log("");
    });
}

// INVESTIGACIÓN: funciones
export function verPedidosPorEstado(estado) {
    console.log(`\n====== PEDIDOS ${estado.toUpperCase()} ======\n`);
    
    const filtrados = pedidos.filter(p => p.estado === estado);
    
    if(filtrados.length === 0) {
        console.log(`No hay pedidos en estado: ${estado}`);
        return;
    }
    
    filtrados.forEach(pedido => {
        console.log(`${pedido.id} - Mesa ${pedido.mesa} - Total: $${pedido.total.toFixed(2)}`);
    });
}

// INVESTIGACIÓN: funciones
export function cambiarEstadoPedido(id, nuevoEstado) {
    console.log(`Cambiando estado del pedido ${id} a ${nuevoEstado}`);
    
    let pedidoEncontrado = null;
    for(let i = 0; i < pedidos.length; i++) {
        if(pedidos[i].id === id) {
            pedidoEncontrado = pedidos[i];
            break;
        }
    }
    
    if(pedidoEncontrado) {
        pedidoEncontrado.estado = nuevoEstado;
        console.log(`Pedido ${id}: ${nuevoEstado}`);
        return true;
    } else {
        console.log(`Pedido ${id} no encontrado`);
        return false;
    }
}

// INVESTIGACIÓN: funciones
export function calcularTotalAcumulado() {
    totalAcumulado = 0;
    
    // INVESTIGACIÓN: forEach()
    pedidos.forEach(pedido => {
        if(pedido.estado === "listo" || pedido.estado === "entregado") {
            totalAcumulado += pedido.total;
        }
    });
    
    return totalAcumulado;
}

// INVESTIGACIÓN: funciones
export function mostrarResumenCaja() {
    console.log("\n====== RESUMEN CAJA ======\n");
    
    const total = calcularTotalAcumulado();
    
    let pedidosPendientes = 0;
    let pedidosPreparacion = 0;
    let pedidosListos = 0;
    let pedidosCancelados = 0;
    
    // INVESTIGACIÓN: forEach()
    pedidos.forEach(pedido => {
        switch(pedido.estado) {
            case "pendiente": pedidosPendientes++; break;
            case "en-preparacion": pedidosPreparacion++; break;
            case "listo": pedidosListos++; break;
            case "cancelado": pedidosCancelados++; break;
        }
    });
    
    // INVESTIGACIÓN: template strings
    console.log(`Estadisticas:`);
    console.log(`   Pendientes: ${pedidosPendientes}`);
    console.log(`   En preparacion: ${pedidosPreparacion}`);
    console.log(`   Listos: ${pedidosListos}`);
    console.log(`   Cancelados: ${pedidosCancelados}`);
    console.log(`\nTotal acumulado cobrado: $${total.toFixed(2)}`);
}

// INVESTIGACIÓN: funciones
export function mostrarMenu() {
    console.log("\n====== CAJA ======");
    console.log("1. Ver pedidos pendientes");
    console.log("2. Ver pedidos en preparacion");
    console.log("3. Ver pedidos listos");
    console.log("4. Cambiar estado de pedido");
    console.log("5. Ver resumen de caja");
    console.log("6. Salir");
}

// Funciones auxiliares
export function getPedidos() {
    return pedidos;
}

export function agregarPedidoEjemplo() {
    // Datos de ejemplo para probar
    pedidos.push({
        id: `P-001`,
        mesa: "Mesa 1",
        items: ["Cafe Americano", "Panini"],
        estado: "pendiente",
        hora: "10:30",
        notas: "Sin azucar",
        subtotal: 115,
        iva: 18.40,
        total: 133.40
    });
    
    pedidos.push({
        id: `P-002`,
        mesa: "Mesa 2",
        items: ["Capuccino"],
        estado: "en-preparacion",
        hora: "10:45",
        notas: "",
        subtotal: 60,
        iva: 9.60,
        total: 69.60
    });
    
    console.log("Pedidos de ejemplo agregados a Caja");
}