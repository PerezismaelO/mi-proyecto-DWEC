import { catalogo } from "../modelo-datos/catalogo-productos.js";
import { crearRegistroVentas, reponerStock, venderProducto } from "../logica/inventario.js";
import {
  buscarProducto,
  filtrarPorCategoria,
  filtrarStockBajo,
  formatearEuros,
  formatearProducto,
  generarInforme,
  listarTodo,
} from "../logica/consultas.js";

const MENU = `=== RETROSTOCK ===
1. Ver catálogo
2. Buscar producto
3. Registrar una venta
4. Reponer stock
5. Informe de caja
6. Salir`;

const mostrarLista = (titulo, lineas) => {
  console.log(`--- ${titulo} ---`);
  if (lineas.length === 0) {
    console.log("No hay productos que mostrar.");
  } else {
    lineas.forEach((linea) => console.log(linea));
  }
};

const pedirNumero = (mensaje) => Number(prompt(mensaje)?.trim());
// ?. evita el error si el usuario pulsa "Cancelar" (prompt devuelve null)

const verCatalogo = (productos) => {
  const opcion = prompt("Ver catálogo:\n1. Todo\n2. Filtrar por categoría\n3. Solo stock bajo");

  switch (opcion) {
    case "1":
      mostrarLista("Catálogo completo", listarTodo(productos));
      break;
    case "2": {
      const categoria = prompt("¿Qué categoría? (RPG, Plataforma, Lucha...)") || "";
      mostrarLista(`Categoría: ${categoria}`, filtrarPorCategoria(productos, categoria).map(formatearProducto));
      break;
    }
    case "3":
      mostrarLista("Productos con stock bajo", filtrarStockBajo(productos).map(formatearProducto));
      break;
    default:
      console.log("Opción no válida.");
  }
};

export const iniciarMenu = () => {
  let productos = catalogo;
  // Lista actual: cada venta o reposición la sustituye por una nueva (el catálogo original no cambia)
  const registro = crearRegistroVentas();
  let salir = false;

  do {
    const opcion = prompt(MENU);

    switch (opcion) {
      case "1":
        verCatalogo(productos);
        break;

      case "2": {
        const texto = prompt("Escribe el id o parte del título:")?.trim();
        const encontrado = texto && buscarProducto(productos, texto);
        // && solo busca si el usuario ha escrito algo
        console.log(encontrado ? formatearProducto(encontrado) : "No se ha encontrado ningún producto.");
        break;
      }

      case "3": {
        const id = pedirNumero("Id del producto a vender:");
        const unidades = pedirNumero("¿Cuántas unidades?");
        const resultado = venderProducto(productos, id, unidades);

        if (resultado.ok) {
          productos = resultado.productos;
          registro.registrar(resultado.venta);
          const { titulo, precioUnitario, total, stockRestante } = resultado.venta;
          console.log(`--- Venta: ${unidades} x ${titulo} ---`);
          console.log(`Precio unitario final: ${formatearEuros(precioUnitario)}`);
          console.log(`Total de la venta: ${formatearEuros(total)}`);
          console.log(`Stock restante: ${stockRestante}`);
        } else {
          console.log(resultado.mensaje);
        }
        break;
      }

      case "4": {
        const id = pedirNumero("Id del producto a reponer:");
        const unidades = pedirNumero("¿Cuántas unidades añades?");
        const existe = productos.some((p) => p.id === id);

        if (!existe || !Number.isInteger(unidades) || unidades <= 0) {
          console.log("Datos no válidos: revisa el id y la cantidad.");
        } else {
          productos = reponerStock(productos, id, unidades);
          console.log("Stock repuesto → " + formatearProducto(productos.find((p) => p.id === id)));
        }
        break;
      }

      case "5": {
        const { totalFacturado, masVendido, valorStock, hayStockBajo } = generarInforme(productos, registro.obtener());
        console.log("--- Informe de caja ---");
        console.log(`Total facturado: ${formatearEuros(totalFacturado)}`);
        console.log(`Producto más vendido: ${masVendido[0]} (${masVendido[1]} uds.)`);
        console.log(`Valor del stock restante: ${formatearEuros(valorStock)}`);
        if (hayStockBajo) {
          console.log("⚠️ Hay productos con stock bajo.");
        }
        break;
      }

      case "6":
      case null:
        // null = el usuario ha pulsado "Cancelar"
        salir = true;
        console.log("--- Fin de la sesión ---");
        console.log(`Ventas realizadas: ${registro.contar()}`);
        console.log(`Total facturado: ${formatearEuros(generarInforme(productos, registro.obtener()).totalFacturado)}`);
        break;

      default:
        console.log("Opción no válida. Elige un número del 1 al 6.");
    }
  } while (!salir);
};