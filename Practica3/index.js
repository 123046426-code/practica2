import readline from "readline";

import * as cliente from "./cliente.js";
import * as caja from "./caja.js";
import * as cocina from "./cocina.js";

const productos = [];

const pedidos = [];

cliente.inicializarCliente(productos, pedidos);

cocina.inicializarCocina(productos);

caja.inicializarCaja(pedidos, productos);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menuPrincipal() {
    console.log("\n====== CAFETERIA ======");
    console.log("1. Cliente");
    console.log("2. Caja");
    console.log("3. Cocina");
    console.log("4. Salir");

    rl.question("\nOpcion: ", function(op) {
        if(op === "1") {
            menuCliente();
        }
        else if(op === "2") {
            menuCaja();
        }
        else if(op === "3") {
            menuCocina();
        }
        else if(op === "4") {
            console.log("Saliendo...");
            rl.close();
        }
        else {
            console.log("Opcion invalida");
            menuPrincipal();
        }
    });
}

function menuCliente() {
    cliente.mostrarMenuCliente();
    rl.question("\nOpcion: ", function(op) {
        if(op === "1") {
            cliente.verProductosCliente();
            menuCliente();
        }
        else if(op === "2") {
            rl.question("ID Producto: ", function(id) {
                cliente.hacerPedidoCliente(id);
                menuCliente();
            });
        }
        else if(op === "3") {
            cliente.verPedidosCliente();
            menuCliente();
        }
        else if(op === "4") {
            cliente.verPromocionesCliente();
            menuCliente();
        }
        else if(op === "5") {
            menuPrincipal();
        }
        else {
            console.log("Opcion invalida");
            menuCliente();
        }
    });
}

function menuCaja() {
    caja.mostrarMenuCaja();
    rl.question("\nOpcion: ", function(op) {
        if(op === "1") {
            caja.verPedidosCaja();
            menuCaja();
        }
        else if(op === "2") {
            caja.verPedidosPorEstadoCaja("pendiente");
            menuCaja();
        }
        else if(op === "3") {
            caja.verPedidosPorEstadoCaja("en-preparacion");
            menuCaja();
        }
        else if(op === "4") {
            caja.verPedidosPorEstadoCaja("listo");
            menuCaja();
        }
        else if(op === "5") {
            rl.question("ID del pedido: ", function(id) {
                rl.question("Nuevo estado (pendiente/en-preparacion/listo/cancelado): ", function(estado) {
                    caja.cambiarEstadoPedidoCaja(parseInt(id), estado);
                    menuCaja();
                });
            });
        }
        else if(op === "6") {
            caja.mostrarResumenCaja();
            menuCaja();
        }
        else if(op === "7") {
            rl.question("Numero de mesa: ", function(mesa) {
                rl.question("Items (separados por coma): ", function(itemsInput) {
                    const items = itemsInput.split(",").map(i => i.trim());
                    rl.question("Notas (opcional): ", function(notas) {
                        caja.agregarPedidoCaja(mesa, items, notas);
                        menuCaja();
                    });
                });
            });
        }
        else if(op === "8") {
            menuPrincipal();
        }
        else {
            console.log("Opcion invalida");
            menuCaja();
        }
    });
}

function menuCocina() {
    cocina.mostrarMenuCocina();
    rl.question("\nOpcion: ", function(op) {
        if(op === "1") {
            cocina.verBaratosCocina();
            menuCocina();
        }
        else if(op === "2") {
            cocina.verCarosCocina();
            menuCocina();
        }
        else if(op === "3") {
            cocina.verBebidasCocina();
            menuCocina();
        }
        else if(op === "4") {
            cocina.verPostresCocina();
            menuCocina();
        }
        else if(op === "5") {
            rl.question("Nombre: ", function(nombre) {
                const encontrado = cocina.buscarNombreCocina(nombre);
                if(encontrado) {
                    console.log(`${encontrado.nombre} - $${encontrado.precio}`);
                }
                else {
                    console.log("No encontrado");
                }
                menuCocina();
            });
        }
        else if(op === "6") {
            rl.question("ID: ", function(id) {
                const encontrado = cocina.buscarIdCocina(parseInt(id));
                if(encontrado) {
                    console.log(`${encontrado.nombre} - $${encontrado.precio}`);
                }
                else {
                    console.log("No encontrado");
                }
                menuCocina();
            });
        }
        else if(op === "7") {
            rl.question("Nombre: ", function(nombre) {
                rl.question("Precio: ", function(precio) {
                    rl.question("Categoria (bebida/postre/comida): ", function(categoria) {
                        rl.question("Stock: ", function(stock) {
                            rl.question("Tiene promocion? (si/no): ", function(respuesta) {
                                const promocion = respuesta.toLowerCase() === "si";
                                cocina.agregarProductoCocina(nombre, parseFloat(precio), categoria, parseInt(stock), promocion);
                                menuCocina();
                            });
                        });
                    });
                });
            });
        }
        else if(op === "8") {
            rl.question("ID del producto a editar: ", function(id) {
                const producto = cocina.buscarIdCocina(parseInt(id));
                if(producto) {
                    console.log(`Editando: ${producto.nombre} - $${producto.precio}`);
                    rl.question("Nuevo nombre (dejar vacio para no cambiar): ", function(nombre) {
                        rl.question("Nuevo precio (dejar vacio para no cambiar): ", function(precio) {
                            rl.question("Nueva categoria (dejar vacio para no cambiar): ", function(categoria) {
                                rl.question("Nuevo stock (dejar vacio para no cambiar): ", function(stock) {
                                    rl.question("Tiene promocion? (si/no/dejar vacio para no cambiar): ", function(promocionResp) {
                                        const nuevosDatos = {};
                                        if(nombre) nuevosDatos.nombre = nombre;
                                        if(precio) nuevosDatos.precio = parseFloat(precio);
                                        if(categoria) nuevosDatos.categoria = categoria;
                                        if(stock) nuevosDatos.stock = parseInt(stock);
                                        if(promocionResp === "si") nuevosDatos.promocion = true;
                                        if(promocionResp === "no") nuevosDatos.promocion = false;
                                        cocina.editarProductoCocina(parseInt(id), nuevosDatos);
                                        menuCocina();
                                    });
                                });
                            });
                        });
                    });
                } else {
                    console.log("Producto no encontrado");
                    menuCocina();
                }
            });
        }
        else if(op === "9") {
            rl.question("ID del producto a eliminar: ", function(id) {
                cocina.eliminarProductoCocina(parseInt(id));
                menuCocina();
            });
        }
        else if(op === "10") {
            cocina.listarProductosCocina();
            menuCocina();
        }
        else if(op === "11") {
            menuPrincipal();
        }
        else {
            console.log("Opcion invalida");
            menuCocina();
        }
    });
}

menuPrincipal();