// cliente.js – Módulo Cliente (consola interactiva)

function iniciarModoCliente() {
  let nombreCliente = prompt("Bienvenido a La Cafetería. Ingresa tu nombre:");
  if (!nombreCliente) return;

  let opcion;
  do {
    opcion = prompt(
      `CLIENTE: ${nombreCliente}\n\n` +
      "1. Ver productos\n" +
      "2. Hacer pedido\n" +
      "3. Ver mis pedidos\n" +
      "4. Salir"
    );

    switch (opcion) {
      case "1":
        let listaProd = "PRODUCTOS DISPONIBLES:\n\n";
        const activos = productos.filter(p => p.estado === "activo" && p.stock > 0);
        if (activos.length === 0) {
          alert("No hay productos disponibles en este momento.");
        } else {
          activos.forEach(p => {
            listaProd += `${p.id}. ${p.nombre} - ${config.moneda}${p.precio} (${p.stock} en stock)\n`;
          });
          alert(listaProd);
        }
        break;

      case "2":
        let seleccion = [];
        let seguir = true;
        while (seguir) {
          let menuSel = "Selecciona un producto (ID, 0 para terminar):\n";
          productos.filter(p => p.estado === "activo" && p.stock > 0).forEach(p => {
            menuSel += `${p.id}. ${p.nombre} - ${config.moneda}${p.precio}\n`;
          });
          let idProd = parseInt(prompt(menuSel));
          if (idProd === 0 || isNaN(idProd)) {
            seguir = false;
          } else {
            let prod = productos.find(p => p.id === idProd && p.estado === "activo" && p.stock > 0);
            if (prod) {
              seleccion.push(prod.nombre);
              alert(`${prod.nombre} agregado.`);
            } else {
              alert("Producto no válido o sin stock.");
            }
          }
        }
        if (seleccion.length > 0) {
          let notas = prompt("¿Alguna nota para el pedido? (opcional)") || "";
          agregarPedido(nombreCliente, seleccion, notas);
          alert("¡Pedido creado con éxito!");
        } else {
          alert("No seleccionaste ningún producto.");
        }
        break;

      case "3":
        const misPedidos = pedidos.filter(p => p.mesa === nombreCliente);
        if (misPedidos.length === 0) {
          alert("No tienes pedidos registrados.");
        } else {
          let texto = "TUS PEDIDOS:\n\n";
          misPedidos.forEach(p => {
            texto += `${p.id} - ${p.hora} [${estadosPedido[p.estado].etiqueta}]\n`;
            texto += `Productos: ${p.items.join(", ")}\n`;
            texto += `Total: ${config.moneda}${p.total.toFixed(2)}\n\n`;
          });
          alert(texto);
        }
        break;

      case "4":
        alert("Gracias por tu visita.");
        break;

      default:
        alert("Opción inválida.");
    }
  } while (opcion !== "4");
}