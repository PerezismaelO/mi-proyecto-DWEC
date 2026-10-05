import { precioPorUnidad, totalVenta } from "./reglas.js";
// Traemos las funciones de precio que hicimos en reglas.js

export const actualizarProducto = (productos, id, cambio) =>
  productos.map((producto) => (producto.id === id ? cambio(producto) : producto));
// Crea una lista nueva: al producto con ese id le aplica "cambio" y los demás los deja igual
// "cambio" es una función que le pasamos nosotros (Higher-Order Function)

export const reponerStock = (productos, id, ...cantidades) => {
  // ...cantidades (parámetro rest) junta en un array todos los números que le pasemos
  const total = cantidades.reduce((suma, cantidad) => suma + cantidad, 0);
  // Suma todas las cantidades. Ejemplo: [5, 2] da 7

  return actualizarProducto(productos, id, (producto) => ({ ...producto, stock: producto.stock + total }));
  // Copia el producto (...producto) y solo cambia el stock sumándole las unidades
};

export const venderProducto = (productos, id, unidades) => {
  const producto = productos.find((p) => p.id === id);
  // Busca el producto por su id

  if (!producto) {
    return { ok: false, mensaje: "No existe ese producto." };
    // Si no existe, devolvemos un error
  } else if (!Number.isInteger(unidades) || unidades <= 0) {
    return { ok: false, mensaje: "La cantidad no es válida." };
    // Si la cantidad no es un número entero mayor que 0, error
  } else if (producto.stock < unidades) {
    return { ok: false, mensaje: `Solo quedan ${producto.stock} unidades.` };
    // Si no hay stock suficiente, error
  }

  const nuevosProductos = actualizarProducto(productos, id, (p) => ({ ...p, stock: p.stock - unidades }));
  // Lista nueva con el stock restado 

  const venta = {
    titulo: producto.titulo,
    unidades: unidades,
    precioUnitario: precioPorUnidad(producto, unidades),
    total: totalVenta(producto, unidades),
    stockRestante: producto.stock - unidades,
  };
  // Guardamos los datos de la venta para mostrarlos y para el informe

  return { ok: true, productos: nuevosProductos, venta: venta };
  // Devolvemos que ha ido bien, la lista nueva y la venta
};

export const crearRegistroVentas = () => {
  let ventas = [];
  // Lista de ventas privada: solo se puede tocar con las funciones de abaj

  return {
    registrar: (venta) => {
      ventas = [...ventas, venta];
    },
    // Añade una venta creando una lista nueva 

    obtener: () => [...ventas],
    // Devuelve una copia de las ventas para que nadie pueda cambiarlas

    contar: () => ventas.length,
    // Devuelve cuántas ventas se han hecho
  };
};