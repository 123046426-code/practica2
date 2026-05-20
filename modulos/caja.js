// Array de pedidos
const listaPedidos=[];

// Total acumulado
let totalAcumulado=0;


// Función principal
function agregarPedido(nombreProducto,precio){

    const pedido={
        producto:nombreProducto,
        precio:precio
    };

    listaPedidos.push(pedido);

    totalAcumulado+=precio;
}


// Función para capturar datos del HTML
function registrarPedido(){

    let producto=
    document.getElementById("producto").value;

    let precio=
    Number(document.getElementById("precio").value);


    if(producto==="" || precio<=0){

        alert("Ingresa datos válidos");
        return;
    }


    agregarPedido(producto,precio);

    actualizarVista();
}


// Actualizar lista visual
function actualizarVista(){

    let lista=
    document.getElementById("listaPedidos");

    lista.innerHTML="";


    for(let pedido of listaPedidos){

        lista.innerHTML +=
        `<li>${pedido.producto} - $${pedido.precio}</li>`;
    }


    document.getElementById("total")
    .innerText=
    "Total: $" + totalAcumulado;
}