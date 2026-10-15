// REGLA DEL MENÚ: la opción nueva es la 7 y "Salir" pasa a ser la 8 (cambiar case "6" por case "8" y el mensaje del default).



// 1. CAMBIA EL UMBRAL DE STOCK BAJO A 5 UNIDADES (reglas.js)


// export const UMBRAL_BAJO_STOCK = 5;



// 2. AÑADE UN DESCUENTO DEL 15 % A PARTIR DE 6 UNIDADES (reglas.js)


// export function descuentoVolumen(unidades) {
//   if (unidades >= 6) {
//     return 0.15;
//   }
//   if (unidades >= 4) {
//     return 0.1;
//   }
//   if (unidades >= 2) {
//     return 0.05;
//   }
//   return 0;
// }



// 3. CAMBIA EL PORCENTAJE DE UN ESTADO DE LA TABLA A (SOLO-CARTUCHO AL -40 %) (reglas.js)


// export const AJUSTE_ESTADO = Object.freeze({
//   [ESTADO_CONSERVACION.NUEVO_PRECINTADO]: 0.25,
//   [ESTADO_CONSERVACION.USADO_COMO_NUEVO]: 0,
//   [ESTADO_CONSERVACION.USADO_CAJA_DANADA]: -0.15,
//   [ESTADO_CONSERVACION.SOLO_CARTUCHO]: -0.4,
// });



// 4. AÑADE UN FILTRO POR PLATAFORMA EN VER CATÁLOGO (consultas.js + menu.js)


// consultas.js

// export const filtrarPorPlataforma = (productos, plataforma) =>
//   productos.filter((p) => p.plataforma.toLowerCase() === plataforma.toLowerCase());

// menu.js (import)

// import {
//   buscarProducto,
//   filtrarPorCategoria,
//   filtrarPorPlataforma,
//   filtrarStockBajo,
//   formatearEuros,
//   formatearProducto,
//   generarInforme,
//   listarTodo,
// } from "../logica/consultas.js";

// menu.js (sustituir verCatalogo entera)

// const verCatalogo = (productos) => {
//   const opcion = prompt(
//     "Ver catálogo:\n1. Todo\n2. Filtrar por categoría\n3. Solo stock bajo\n4. Filtrar por plataforma",
//   );

//   switch (opcion) {
//     case "1":
//       mostrarLista("Catálogo completo", listarTodo(productos));
//       break;
//     case "2": {
//       const categoria = prompt("¿Qué categoría? (RPG, Plataforma, Lucha...)") || "";
//       mostrarLista(`Categoría: ${categoria}`, filtrarPorCategoria(productos, categoria).map(formatearProducto));
//       break;
//     }
//     case "3":
//       mostrarLista("Productos con stock bajo", filtrarStockBajo(productos).map(formatearProducto));
//       break;
//     case "4": {
//       const plataforma = prompt("¿Qué plataforma? (SNES, PS1, N64, GAME BOY, MEGA DRIVE)") || "";
//       mostrarLista(`Plataforma: ${plataforma}`, filtrarPorPlataforma(productos, plataforma).map(formatearProducto));
//       break;
//     }
//     default:
//       console.log("Opción no válida.");
//   }
// };



// 5. MUESTRA EL CATÁLOGO ORDENADO POR PRECIO (consultas.js + menu.js)


// consultas.js

// export const ordenarPorPrecio = (productos) =>
//   [...productos].sort((a, b) => precioPorUnidad(a) - precioPorUnidad(b));

// menu.js (import)

// import {
//   buscarProducto,
//   filtrarPorCategoria,
//   filtrarStockBajo,
//   formatearEuros,
//   formatearProducto,
//   generarInforme,
//   listarTodo,
//   ordenarPorPrecio,
// } from "../logica/consultas.js";

// menu.js (en verCatalogo: añadir "\n4. Ordenado por precio" al prompt y este case)

//     case "4":
//       mostrarLista("Catálogo ordenado por precio", ordenarPorPrecio(productos).map(formatearProducto));
//       break;



// 6. AÑADE UNA OPCIÓN PARA CAMBIAR EL PRECIO DE UN PRODUCTO (inventario.js + menu.js)


// inventario.js

// export const cambiarPrecio = (productos, id, nuevoPrecio) =>
//   actualizarProducto(productos, id, (p) => ({ ...p, precioBase: nuevoPrecio }));

// menu.js (import)

// import { cambiarPrecio, crearRegistroVentas, reponerStock, venderProducto } from "../logica/inventario.js";

// menu.js (MENU: "7. Cambiar precio" y "8. Salir")

//       case "7": {
//         const id = pedirNumero("Id del producto:");
//         const nuevoPrecio = pedirNumero("Nuevo precio base (ej: 24.99):");
//         const existe = productos.some((p) => p.id === id);

//         if (!existe || !Number.isFinite(nuevoPrecio) || nuevoPrecio <= 0) {
//           console.log("Datos no válidos: revisa el id y el precio.");
//         } else {
//           productos = cambiarPrecio(productos, id, nuevoPrecio);
//           console.log("Precio cambiado → " + formatearProducto(productos.find((p) => p.id === id)));
//         }
//         break;
//       }



// 7. AÑADE UNA OPCIÓN PARA DAR DE ALTA UN PRODUCTO NUEVO (inventario.js + menu.js)


// inventario.js

// export const anadirProducto = (productos, datos) => {
//   const nuevoId = Math.max(...productos.map((p) => p.id)) + 1;
//   return [...productos, { id: nuevoId, ...datos }];
// };

// menu.js (imports)

// import { ESTADO_CONSERVACION } from "../modelo-datos/estado-conservacion.js";
// import { anadirProducto, crearRegistroVentas, reponerStock, venderProducto } from "../logica/inventario.js";

// menu.js (MENU: "7. Añadir producto" y "8. Salir")

//       case "7": {
//         const titulo = prompt("Título:")?.trim();
//         const plataforma = prompt("Plataforma (SNES, PS1, N64...):")?.trim().toUpperCase();
//         const categoria = prompt("Categoría:")?.trim();
//         const precioBase = pedirNumero("Precio base:");
//         const stock = pedirNumero("Unidades en stock:");

//         const estados = Object.values(ESTADO_CONSERVACION);
//         const numEstado = pedirNumero(
//           "Estado:\n" + estados.map((e, i) => `${i + 1}. ${e}`).join("\n"),
//         );
//         const estadoConservacion = estados[numEstado - 1];

//         if (!titulo || !plataforma || !categoria || !estadoConservacion) {
//           console.log("Faltan datos o el estado no es válido.");
//         } else if (!Number.isFinite(precioBase) || precioBase <= 0 || !Number.isInteger(stock) || stock < 0) {
//           console.log("El precio o el stock no son válidos.");
//         } else {
//           productos = anadirProducto(productos, { titulo, plataforma, categoria, precioBase, estadoConservacion, stock });
//           console.log("Producto añadido → " + formatearProducto(productos[productos.length - 1]));
//         }
//         break;
//       }



// 8. AÑADE UNA OPCIÓN PARA ELIMINAR UN PRODUCTO (inventario.js + menu.js)


// inventario.js

// export const eliminarProducto = (productos, id) => productos.filter((p) => p.id !== id);

// menu.js (import)

// import { crearRegistroVentas, eliminarProducto, reponerStock, venderProducto } from "../logica/inventario.js";

// menu.js (MENU: "7. Eliminar producto" y "8. Salir")

//       case "7": {
//         const id = pedirNumero("Id del producto a eliminar:");
//         const producto = productos.find((p) => p.id === id);

//         if (!producto) {
//           console.log("No existe ese producto.");
//         } else if (confirm(`¿Seguro que quieres eliminar "${producto.titulo}"?`)) {
//           productos = eliminarProducto(productos, id);
//           console.log(`Eliminado: ${producto.titulo}. Quedan ${productos.length} productos.`);
//         } else {
//           console.log("Operación cancelada.");
//         }
//         break;
//       }



// 9. EN EL INFORME DE CAJA, MUESTRA LAS UNIDADES VENDIDAS EN TOTAL (consultas.js + menu.js)


// consultas.js (sustituir generarInforme entera)

// export const generarInforme = (productos, ventas) => {
//   const totalFacturado = redondear(ventas.reduce((suma, venta) => suma + venta.total, 0));

//   const unidadesVendidas = ventas.reduce((suma, venta) => suma + venta.unidades, 0);

//   const unidadesPorJuego = ventas.reduce((acumulado, venta) => {
//     const anteriores = acumulado[venta.titulo] ?? 0;
//     return { ...acumulado, [venta.titulo]: anteriores + venta.unidades };
//   }, {});

//   const masVendido = Object.entries(unidadesPorJuego).reduce(
//     (mejor, actual) => (actual[1] > mejor[1] ? actual : mejor),
//     ["Ninguno", 0],
//   );

//   const valorStock = redondear(productos.reduce((suma, p) => suma + precioPorUnidad(p) * p.stock, 0));

//   const hayStockBajo = productos.some(stockBajo);

//   return { totalFacturado, unidadesVendidas, masVendido, valorStock, hayStockBajo };
// };

// menu.js (sustituir case "5" entero)

//       case "5": {
//         const { totalFacturado, unidadesVendidas, masVendido, valorStock, hayStockBajo } = generarInforme(
//           productos,
//           registro.obtener(),
//         );
//         console.log("--- Informe de caja ---");
//         console.log(`Total facturado: ${formatearEuros(totalFacturado)}`);
//         console.log(`Unidades vendidas: ${unidadesVendidas}`);
//         console.log(`Producto más vendido: ${masVendido[0]} (${masVendido[1]} uds.)`);
//         console.log(`Valor del stock restante: ${formatearEuros(valorStock)}`);
//         if (hayStockBajo) {
//           console.log("⚠️ Hay productos con stock bajo.");
//         }
//         break;
//       }



// 10. AÑADE UNA OPCIÓN QUE MUESTRE EL PRODUCTO MÁS CARO (consultas.js + menu.js)


// consultas.js

// export const productoMasCaro = (productos) =>
//   productos.reduce((max, p) => (precioPorUnidad(p) > precioPorUnidad(max) ? p : max));

// menu.js (añadir productoMasCaro al import de consultas.js)
// menu.js (MENU: "7. Producto más caro" y "8. Salir")

//       case "7":
//         if (productos.length === 0) {
//           console.log("No hay productos.");
//         } else {
//           console.log("Producto más caro → " + formatearProducto(productoMasCaro(productos)));
//         }
//         break;



// 11. CALCULA EL PRECIO MEDIO DEL CATÁLOGO (consultas.js + menu.js)


// consultas.js

// export const precioMedio = (productos) =>
//   productos.length === 0
//     ? 0
//     : redondear(productos.reduce((suma, p) => suma + precioPorUnidad(p), 0) / productos.length);

// menu.js (añadir precioMedio al import de consultas.js)
// menu.js (MENU: "7. Precio medio" y "8. Salir")

//       case "7":
//         console.log(`Precio medio del catálogo: ${formatearEuros(precioMedio(productos))}`);
//         break;



// 12. LOS RPG TIENEN UN 10 % DE DESCUENTO EXTRA (reglas.js)


// export function precioPorUnidad(producto, unidades = 1) {
//   const { precioBase, estadoConservacion, categoria } = producto;
//   const ajuste = AJUSTE_ESTADO[estadoConservacion] ?? 0;
//   const extraCategoria = categoria === "RPG" ? 0.9 : 1;
//   const precioFinal = precioBase * (1 + ajuste) * (1 - descuentoVolumen(unidades)) * extraCategoria;
//   return redondear(precioFinal);
// }



// 13. AÑADE DEVOLUCIONES (menu.js)


//       case "7": {
//         const id = pedirNumero("Id del producto devuelto:");
//         const unidades = pedirNumero("¿Cuántas unidades se devuelven?");
//         const existe = productos.some((p) => p.id === id);

//         if (!existe || !Number.isInteger(unidades) || unidades <= 0) {
//           console.log("Datos no válidos: revisa el id y la cantidad.");
//         } else {
//           productos = reponerStock(productos, id, unidades);
//           console.log("Devolución registrada → " + formatearProducto(productos.find((p) => p.id === id)));
//         }
//         break;
//       }



// 14. MUESTRA EL CATÁLOGO EN FORMA DE TABLA (menu.js)


//     case "1":
//       console.table(productos);
//       break;



// 15. SI UN PRODUCTO TIENE UN ESTADO MAL ESCRITO, QUE AVISE (reglas.js)


// export function precioPorUnidad(producto, unidades = 1) {
//   const { precioBase, estadoConservacion } = producto;
//   const ajuste = AJUSTE_ESTADO[estadoConservacion];

//   if (ajuste === undefined) {
//     throw new Error(`Estado de conservación no válido: "${estadoConservacion}"`);
//   }

//   const precioFinal = precioBase * (1 + ajuste) * (1 - descuentoVolumen(unidades));
//   return redondear(precioFinal);
// }

// ¿Cambia productos? → inventario.js. ¿Solo lee? → consultas.js. ¿Precios o tablas? → reglas.js.
// Busca el ejercicio parecido en tu ejercicios_practica, cópialo, pégalo y descoméntalo con Ctrl + /.
// Si es una opción del menú: impórtala en menu.js, añade la línea al texto MENU, crea el case "7" y pasa “Salir” a "8".
// Guarda y prueba en el navegador con la consola abierta.




// LO MÁS PROBABLE 



// P1. ORDENA EL CATÁLOGO POR PRECIO (consultas.js + menu.js)
// TRAMPA: sort MUTA el array → siempre sobre una copia [...productos]



// consultas.js
// export const ordenarPorPrecio = (productos) =>
//   [...productos].sort((a, b) => precioPorUnidad(a) - precioPorUnidad(b));

// menu.js → añadir ordenarPorPrecio al import de consultas.js
// menu.js → en verCatalogo, añadir "\n4. Ordenado por precio" al prompt y este case:
//     case "4":
//       mostrarLista("Catálogo ordenado por precio", ordenarPorPrecio(productos).map(formatearProducto));
//       break;

// DECIR: "Hago una copia con spread porque sort modifica el array original y no puedo mutar el catálogo.
//         a - b ordena de menor a mayor; para mayor a menor, b - a."



// P2. AÑADIR Y ELIMINAR PRODUCTO (inventario.js)
// TRAMPA: nada de push ni splice


// export const anadirProducto = (productos, datos) => {
//   const nuevoId = Math.max(...productos.map((p) => p.id)) + 1;
//   return [...productos, { id: nuevoId, ...datos }];
// };

// export const eliminarProducto = (productos, id) => productos.filter((p) => p.id !== id);

// DECIR: "Añado creando un array nuevo con spread en vez de push, y elimino con filter
//         en vez de splice. El id nuevo es el mayor que existe + 1, así nunca se repite."
// (el case del menú completo está en los ejercicios 7 y 8)



// P3. CAMBIAR UNA REGLA DE NEGOCIO (reglas.js)
// TRAMPA: la condición MÁS ALTA va PRIMERO


// export function descuentoVolumen(unidades) {
//   if (unidades >= 6) {
//     return 0.15;
//   }
//   if (unidades >= 4) {
//     return 0.1;
//   }
//   if (unidades >= 2) {
//     return 0.05;
//   }
//   return 0;
// }

// DECIR: "Si pusiera >= 4 primero, con 6 unidades entraría ahí y nunca llegaría al 15 %.
//         Como toda la app usa precioPorUnidad, el cambio se aplica en todas partes tocando solo reglas.js."



// P4. TE INTENTA ROMPER EL PROGRAMA (ya está controlado, NO hay que cambiar nada)


// "vende -3"           → unidades <= 0              → "La cantidad no es válida."
// "vende hola"         → Number("hola") = NaN → !Number.isInteger(NaN) → "La cantidad no es válida."
// "vende 2.5"          → !Number.isInteger(2.5)     → "La cantidad no es válida."
// "vende más de las que hay" → producto.stock < unidades → "Solo quedan X unidades."
// "id que no existe"   → find devuelve undefined    → "No existe ese producto."
// "pulsa Cancelar"     → prompt devuelve null → case null → sale del menú
//                        ?.trim() evita el error al hacer trim de null

// DECIR: "Está validado en venderProducto antes de tocar el stock; si algo falla
//         devuelvo { ok: false, mensaje } y la lista no cambia."



// P5. OPCIÓN NUEVA EN EL MENÚ (ejemplo: producto más caro) (consultas.js + menu.js)
// RECETA: 1) función  2) import  3) línea en MENU  4) case "7"  5) "Salir" pasa a "8"


// consultas.js
// export const productoMasCaro = (productos) =>


