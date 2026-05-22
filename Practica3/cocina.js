///////modulo de cocina

const readline = require("readline");
const productos = [
  { id: "prod-01", nombre: "Cafe Americano",  precio: 35,  categoria: "bebida",  estado: "activo"   },
  { id: "prod-02", nombre: "Cappuccino",       precio: 55,  categoria: "bebida",  estado: "activo"   },
  { id: "prod-03", nombre: "Te Verde",         precio: 30,  categoria: "bebida",  estado: "activo"   },
  { id: "prod-04", nombre: "Jugo de Naranja",  precio: 45,  categoria: "bebida",  estado: "activo"   },
  { id: "prod-05", nombre: "Cheesecake",       precio: 85,  categoria: "postre",  estado: "activo"   },
  { id: "prod-06", nombre: "Brownie",          precio: 45,  categoria: "postre",  estado: "activo"   },
  { id: "prod-07", nombre: "Pay de Limon",     precio: 70,  categoria: "postre",  estado: "activo"   },
  { id: "prod-08", nombre: "Croissant",        precio: 40,  categoria: "pan",     estado: "activo"   },
  { id: "prod-09", nombre: "Sandwich Club",    precio: 120, categoria: "comida",  estado: "activo"   },
  { id: "prod-10", nombre: "Ensalada Cesar",   precio: 110, categoria: "comida",  estado: "activo"   },
  { id: "prod-11", nombre: "Agua Mineral",     precio: 20,  categoria: "bebida",  estado: "inactivo" },
];

// filter - regresa varios resultados
function productosBaratos() {
  return productos.filter(p => p.precio < 50 && p.estado === "activo");
}

function productosCaros() {
  return productos.filter(p => p.precio >= 100 && p.estado === "activo");
}

function bebidas() {
  return productos.filter(p => p.categoria === "bebida" && p.estado === "activo");
}

function postres() {
  return productos.filter(p => p.categoria === "postre" && p.estado === "activo");
}

// find - regresa uno solo
function buscarNombre(nombre) {
  return productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
}

function buscarId(id) {
  return productos.find(p => p.id === id);
}

// mostrar lista en consola
function mostrar(lista) {
  if (lista.length === 0) {
    console.log("No se encontraron productos");
    return;
  }
  lista.forEach(p => {
    console.log(p.nombre + " - $" + p.precio + " [" + p.categoria + "]");
  });
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function menu() {
  console.log("\n--- COCINA ---");
  console.log("1. baratos");
  console.log("2. caros");
  console.log("3. bebidas");
  console.log("4. postres");
  console.log("5. buscar por nombre");
  console.log("6. buscar por id");
  console.log("0. salir");

  rl.question("\nopcion: ", function(op) {
    console.log("");

    if (op === "1") {
      console.log("productos baratos:");
      mostrar(productosBaratos());
      menu();

    } else if (op === "2") {
      console.log("productos caros:");
      mostrar(productosCaros());
      menu();

    } else if (op === "3") {
      console.log("bebidas:");
      mostrar(bebidas());
      menu();

    } else if (op === "4") {
      console.log("postres:");
      mostrar(postres());
      menu();

    } else if (op === "5") {
      rl.question("nombre: ", function(nombre) {
        const res = buscarNombre(nombre);
        if (res) {
          console.log("encontrado: " + res.nombre + " - $" + res.precio);
        } else {
          console.log("no se encontro");
        }
        menu();
      });

    } else if (op === "6") {
      rl.question("id (ej: prod-01): ", function(id) {
        const res = buscarId(id);
        if (res) {
          console.log("encontrado: " + res.nombre + " - $" + res.precio + " [" + res.estado + "]");
        } else {
          console.log("no se encontro");
        }
        menu();
      });

    } else if (op === "0") {
      console.log("saliendo...");
      rl.close();

    } else {
      console.log("opcion no valida");
      menu();
    }
  });
}
menu();