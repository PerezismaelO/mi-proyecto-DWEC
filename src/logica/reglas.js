import { ESTADO_CONSERVACION } from "../modelo-datos/estado-conservacion.js";
// Trae el ESTADO_CONSERVACION desde el otro archivo para poder usarlo.


// Tabla A
export const AJUSTE_ESTADO = Object.freeze({
    [ESTADO_CONSERVACION.NUEVO_PRECINTADO]: 0.25,
    [ESTADO_CONSERVACION.USADO_COMO_NUEVO]: 0,
    [ESTADO_CONSERVACION.USADO_CAJA_DANADA]: -0.15,
    [ESTADO_CONSERVACION.SOLO_CARTUCHO]: -0.3,
});
// Porcentaje para saber el precioBase de cada producto.
// Object freeze hace que los porcentajes no se puedan cambiar.


// Tabla B
export function descuentoVolumen(unidades) {
    if (unidades >= 4) { return 0.1; }
    if (unidades >= 2) { return 0.05; }
    return 0;
}
// Funcion para los descuentos segun la cantidad de unidades que se compren.



// Tabla C
export const UMBRAL_BAJO_STOCK = 3;
// Si hay 3 o menos unidades de ese producto, tiene un bajo stock.

export const redondear = (numero) => Math.round(numero * 100) / 100;
// Funcion para redondear el precio a dos decimales.


export function precioPorUnidad(producto, unidades = 1) {
    const { precioBase, estadoConservacion } = producto;
    const ajuste = AJUSTE_ESTADO[estadoConservacion] ?? 0;
    const precioFinal = precioBase * (1 + ajuste) * (1 - descuentoVolumen(unidades));
    return redondear(precioFinal);
}
// Funcion para determinar el precio final del producto o los productos.


export const totalVenta = (producto, unidades) => 
redondear(precioPorUnidad(producto, unidades) * unidades);
// Calcula el total de la venta.

export const stockBajo = (producto) => producto.stock <= UMBRAL_BAJO_STOCK;
// Comprueba si el stock es bajo o no. Si es bajo, devuelve true.