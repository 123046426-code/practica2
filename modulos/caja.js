// Guarda todos los pedidos realizados
const listaPedidos = [];

// Productos agregados al pedido actual
let pedidoActual = [];

// Total acumulado de todos los pedidos
let totalAcumulado = 0;


// Agregar un producto al pedido actual
function agregarProductoPedido(){

    let producto =
    document.getElementById("producto").value;

    let precio =
    Number(document.getElementById("precio").value);

    if(producto==="" || precio<=0){

        alert("Datos inválidos");
        return;
    }


    pedidoActual.push({

        producto: producto,
        precio: precio

    });

    mostrarPedidoActual();
}


// Crear un pedido completo
function generarPedido(){

    if(pedidoActual.length===0){

        alert("No hay productos");
        return;
    }

    let totalPedido=0;

    for(let producto of pedidoActual){

        totalPedido += producto.precio;
    }


    const pedido={

        productos:[...pedidoActual],
        total: totalPedido

    };


    listaPedidos.push(pedido);

    totalAcumulado += totalPedido;

    pedidoActual=[];

    actualizarVistaPedidos();
}
    

// Mostrar productos agregados antes de confirmar
function mostrarPedidoActual(){

    let lista=
    document.getElementById(
    "pedidoActual");

    lista.innerHTML="";

    let subtotal=0;

    for(let producto of pedidoActual){

        subtotal += producto.precio;

        lista.innerHTML +=
        `<li>
        ${producto.producto}
        - $${producto.precio}
        </li>`;
    }

    document.getElementById(
    "subtotal")
    .innerText=
    "Subtotal: $" + subtotal;

}



// Mostrar todos los pedidos generados
function actualizarVistaPedidos(){

    let lista=
    document.getElementById(
    "listaPedidos");

    lista.innerHTML="";


    listaPedidos.forEach(
    (pedido,index)=>{

        lista.innerHTML +=
        `<li>
        Pedido ${index+1}
        | Total: $${pedido.total}
        </li>`;
    });


    document.getElementById(
    "total")
    .innerText=
    "Total acumulado: $"+
    totalAcumulado;


    document.getElementById(
    "pedidoActual")
    .innerHTML="";

    document.getElementById(
    "subtotal")
    .innerText=
    "Subtotal: $0";

}