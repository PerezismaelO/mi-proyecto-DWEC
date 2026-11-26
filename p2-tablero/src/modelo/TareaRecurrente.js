// TareaRecurrente.js — Bloque A · ✍️ A1: herencia.
// Una tarea recurrente ES UNA Tarea que se repite cada N días (sacar la basura, la copia de
// seguridad…). Cuando se completa, aparece otra igual con el límite N días más tarde.
import { Tarea } from "./Tarea.js";

// 1 · Haz que herede de Tarea (una palabra antes de la llave)
export class TareaRecurrente extends Tarea {
  // new TareaRecurrente("Sacar la basura", "media", "2026-10-23", 7): lo mismo que una Tarea + cadaDias
  // (Bloque C · ✍️ C3: añadirás un quinto parámetro, id = null, y se lo pasarás también al super)

  // constructor crea una tarea normal con super y le añade cada cuántos días se repite
  constructor(titulo, prioridad, limite, cadaDias, id = null) {
    super(titulo, prioridad, limite, id); 
    // Llama al constructor del padre (super) con lo que es de Tarea, ANTES de usar this.
    if (!Number.isInteger(cadaDias) || cadaDias < 1) {
      throw new RangeError("cadaDias debe ser un numero entero mayor o igual a 1")
    }
    if (this.limite === null) {
      throw new TypeError("Una tarea recurrente debe tener un límite")
    }
    this.cadaDias = cadaDias;
  }

   // 6 · siguiente(): devuelve una TareaRecurrente NUEVA con el mismo título, prioridad y cadaDias,
  //     y el límite cadaDias días después. ⚠️ Sin tocar this.limite: copia la fecha primero.
  //     Pista: const limite = new Date(this.limite); limite.setDate(limite.getDate() + …)

  // siguiente crea la misma tarea con la fecha límite unos días después
  siguiente() {
    // Copia de la fecha limite
    const limite = new Date(this.limite);

    // A la copia de la fecha limite le sumo los dias para la siguiente tarea
    limite.setDate(limite.getDate() + this.cadaDias);
    return new TareaRecurrente(this.titulo, this.prioridad, limite, this.cadaDias);
  }

  // al completarla devuelve una lista con la siguiente tarea
  alCompletar() {
    return [this.siguiente()];
  }

  // devuelve el texto de la tarea y cada cuántos días se repite
  toString() {
    return `${super.toString()} · 🔁 cada ${this.cadaDias} días`;}
}
// Comprueba con:  docker compose run --rm web npm test 2-recurrente

