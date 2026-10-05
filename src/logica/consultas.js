import { precioPorUnidad, stockBajo, redondear } from "./reglas.js";

export const formatearEuros = (numero) => numero.toFixed(2).replace(".", ",") + " €";
// Convierte 42.75 en "42,75 €"

export const formatearProducto = (producto) => {
  const { id, titulo, plataforma, categoria, estadoConservacion, stock } = producto;
  const aviso = stockBajo(producto) ? " ⚠️ Stock bajo" : "";
  return `#${id} ${titulo} [${plataforma}] · ${categoria} · ${estadoConservacion} · ${formatearEuros(precioPorUnidad(producto))} · stock: ${stock}${aviso}`;
};

export const listarTodo = (productos) => productos.map(formatearProducto);

export const filtrarPorCategoria = (productos, categoria) =>
  productos.filter((p) => p.categoria.toLowerCase() === categoria.toLowerCase());

export const filtrarStockBajo = (productos) => productos.filter(stockBajo);

export const buscarProducto = (productos, texto) =>
  productos.find((p) => p.id === Number(texto) || p.titulo.toLowerCase().includes(texto.toLowerCase()));
// Busca por id o por parte del título

export const generarInforme = (productos, ventas) => {
  const totalFacturado = redondear(ventas.reduce((suma, venta) => suma + venta.total, 0));

  const unidadesPorJuego = ventas.reduce((acumulado, venta) => {
    const anteriores = acumulado[venta.titulo] ?? 0;
    return { ...acumulado, [venta.titulo]: anteriores + venta.unidades };
  }, {});
  // Cuenta cuántas unidades se han vendido de cada juego

  const masVendido = Object.entries(unidadesPorJuego).reduce(
    (mejor, actual) => (actual[1] > mejor[1] ? actual : mejor),
    ["Ninguno", 0],
  );
  // Se queda con el juego que más unidades ha vendido

  const valorStock = redondear(productos.reduce((suma, p) => suma + precioPorUnidad(p) * p.stock, 0));

  const hayStockBajo = productos.some(stockBajo);

  return { totalFacturado, masVendido, valorStock, hayStockBajo };
};