// tarjeta.js — Bloque B · 👀 EJEMPLO RESUELTO (crearTarjeta) y ✍️ B1 (pintarLista).
import { formatear } from "../modelo/fechas.js";

/** Tarea → <article class="tarjeta tarjeta--alta" data-id="3"> con su título y su límite */
export function crearTarjeta(tarea, hoy = new Date()) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta", `tarjeta--${tarea.prioridad}`);
  tarjeta.classList.toggle("tarjeta--vencida", tarea.estaVencida(hoy));
  tarjeta.dataset.id = tarea.id; // en el HTML: data-id="3" (siempre texto)

  const titulo = document.createElement("h3");
  titulo.textContent = tarea.titulo; // textContent, NUNCA innerHTML con lo que escribe el usuario
  tarjeta.append(titulo);

  if (tarea.limite) {
    const limite = document.createElement("p");
    limite.className = "tarjeta__limite";
    limite.textContent = `Límite: ${formatear(tarea.limite)}`;
    tarjeta.append(limite);
  }
  return tarjeta;
}

// ✍️ B1 · pintarLista(contenedor, tareas, hoy = new Date())
//   - Vacía el contenedor y pone una tarjeta por tarea (usa crearTarjeta), en el mismo orden.
//   - Pintar dos veces NO puede duplicar: primero vacía. Pista: contenedor.replaceChildren(...)
//   - Sin tareas: deja SOLO un <p class="vacia">Sin tareas</p>
export function pintarLista(contenedor, tareas, hoy = new Date()) {
  // Primero vaciamos el contenedor para no duplicar
  contenedor.replaceChildren();

  // Si no hay tareas, ponemos el aviso
  if (tareas.length === 0) {
    const vacia = document.createElement("p");
    vacia.className = "vacia";
    vacia.textContent = "Sin tareas";
    contenedor.append(vacia);
    return;
  }

  // Si hay tareas, creamos una tarjeta por cada una y la añadimos
  for (const tarea of tareas) {
    const tarjeta = crearTarjeta(tarea, hoy);
    contenedor.append(tarjeta);
  }}
