const estado = [
    { nombre : "nuevo-precintado", descripcion: "El producto está completamente nuevo y sellado en su embalaje original." },
    { nombre : "usado-como-nuevo", descripcion: "El producto ha sido usado pero se encuentra en excelentes condiciones, sin signos visibles de desgaste." },
    { nombre : "usado-caja-danada", descripcion: "El producto ha sido usado y la caja presenta daños visibles, aunque el contenido está en buen estado." },
    { nombre : "solo-cartucho", descripcion: "El producto consiste únicamente en el cartucho o disco del juego, sin caja ni manual." },
]

export const ESTADO_CONSERVACION = Object.freeze({
    NUEVO_PRECINTADO: "nuevo-precintado",
    USADO_COMO_NUEVO: "usado-como-nuevo",
    USADO_CAJA_DANADA: "usado-caja-danada",
    SOLO_CARTUCHO: "solo-cartucho",
});