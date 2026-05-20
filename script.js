// Productos de ejemplo

let productos = [

    {
        id: 1,
        nombre: "Cafe Americano",
        precio: 45
    },

    {
        id: 2,
        nombre: "Capuccino",
        precio: 60
    },

    {
        id: 3,
        nombre: "Frappe",
        precio: 80
    },

    {
        id: 4,
        nombre: "Panini",
        precio: 70
    },

    {
        id: 5,
        nombre: "Pastel",
        precio: 50
    }

];





let pedidos = [];




function verProductos(){

    console.log("Mostrando productos...");

    let texto = "PRODUCTOS:\n\n";

    for(let i = 0; i < productos.length; i++){

        console.log(
            productos[i].nombre +
            " $" +
            productos[i].precio
        );

        texto +=
        productos[i].id + ". " +
        productos[i].nombre +
        " - $" +
        productos[i].precio + "\n";

    }

    alert(texto);

}





function hacerPedido(){

    console.log("El cliente esta haciendo un pedido");

    let menu = "MENU:\n\n";

    for(let i = 0; i < productos.length; i++){

        menu +=
        productos[i].id + ". " +
        productos[i].nombre +
        " - $" +
        productos[i].precio + "\n";

    }

    let opcion = parseInt(
        prompt(menu + "\nQue producto deseas?")
    );

    let encontrado = false;

    for(let i = 0; i < productos.length; i++){

        if(opcion == productos[i].id){

            pedidos.push(productos[i]);

            console.log(
                "Producto agregado: " +
                productos[i].nombre
            );

            alert(
                "Agregaste:\n" +
                productos[i].nombre
            );

            encontrado = true;

        }

    }


    if(encontrado == false){

        console.log("Producto no encontrado");

        alert("Producto no encontrado");

    }

}





function verPedidos(){

    console.log("Mostrando pedidos del cliente");

    if(pedidos.length == 0){

        console.log("No hay pedidos");

        alert("No hay pedidos");

    }

    else{

        let texto = "TUS PEDIDOS\n\n";

        let total = 0;

        for(let i = 0; i < pedidos.length; i++){

            console.log(
                pedidos[i].nombre +
                " $" +
                pedidos[i].precio
            );

            texto +=
            pedidos[i].nombre +
            " - $" +
            pedidos[i].precio + "\n";

            total += pedidos[i].precio;

        }

        texto += `\nTotal a pagar: $${total}`;

        console.log(`Total a pagar: $${total}`);

        alert(texto);

    }

}





let opcion;

do{

    opcion = prompt(

"CAFETERIA EL FERROCARRIL\n\n" +

"1. Ver productos\n" +
"2. Hacer pedido\n" +
"3. Ver pedidos\n" +
"4. Salir"

    );



    switch(opcion){

        case "1":

            console.log("Opcion 1 seleccionada");

            verProductos();

        break;



        case "2":

            console.log("Opcion 2 seleccionada");

            hacerPedido();

        break;



        case "3":

            console.log("Opcion 3 seleccionada");

            verPedidos();

        break;



        case "4":

            console.log("Saliendo del sistema");

            alert("Gracias por usar el sistema");

        break;



        default:

            console.log("Opcion incorrecta");

            alert("Opcion incorrecta");

    }

}while(opcion != "4");