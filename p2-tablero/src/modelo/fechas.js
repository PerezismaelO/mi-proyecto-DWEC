// fechas.js — Utilidades de fechas con objetos nativos (apartado 10 de la UD4).

// parsearfecha convierte un texto de fecha en una fecha en hora local
export function parsearFecha(texto) {
  if (texto instanceof Date)
    return new Date(texto.getFullYear(), texto.getMonth(), texto.getDate());
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(texto));
  if (!m) throw new TypeError(`Fecha no válida: ${texto} (usa AAAA-MM-DD)`);
  const fecha = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (fecha.getMonth() !== Number(m[2]) - 1) throw new RangeError(`Esa fecha no existe: ${texto}`);
  return fecha;
}

// solodia devuelve la misma fecha a medianoche
export const soloDia = (fecha) => new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

// formatear convierte una fecha en texto día mes año
export const formatear = (fecha) =>
  fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
