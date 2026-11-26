// Columna.js — Bloque A · ✍️ A2: una columna del tablero («Por hacer», «En curso», «Hecho»).
// En kanban, una columna puede tener un límite WIP (Work In Progress): «En curso» no admite más
// de 3 tareas a la vez, para no empezar mil cosas y no acabar ninguna.
import { Tarea } from "./Tarea.js";

export class Columna {
  // Privado: #tareas, un array
  #tareas = [];
  
  // constructor crea la columna con su nombre y su límite
  constructor(nombre, limiteWip = null) {
    // 1 · nombre: texto no vacío (sin espacios a los lados) → si no, TypeError
    if (typeof nombre !== "string" || nombre.trim() === "") {
      throw new TypeError("El nombre debe ser un texto no vacio");
    }
   
    //     limiteWip: null (sin límite) o un entero ≥ 1 → si no, RangeError
    if (limiteWip !== null && (!Number.isInteger(limiteWip) || limiteWip < 1)) {
      throw new RangeError("limiteWip debe ser null o un numero entero mayor o igual a 1");
    }
    this.nombre = nombre.trim();
    this.limiteWip = limiteWip;
  }

  // llena dice si la columna tiene límite y ya está completa
  get llena() {
    return this.limiteWip !== null && this.#tareas.length >= this.limiteWip;
  }

  // tareas devuelve una copia de las tareas de la columna
  get tareas() {
    return [...this.#tareas];
  }

  // añadir mete una tarea en la columna y da error si está llena
  añadir(tarea) {
    if (!(tarea instanceof Tarea)) {
      throw new TypeError("No es una instancia de Tarea");
    }
    if (this.llena) {
      throw new Error("La columna está llena");
    }
    this.#tareas.push(tarea);
    return tarea;
  }

  // quitar saca la tarea con ese id y la devuelve
  quitar(id) {
    const index = this.#tareas.findIndex((tarea) => tarea.id === id);

    if (index === -1) {
      throw new Error(`La tarea ${id} no está en ${this.nombre}`);
    }
    return this.#tareas.splice(index, 1)[0];
  }
  // tiene dice si la tarea con ese id está en la columna
  tiene(id) {
    return this.#tareas.some((tarea) => tarea.id === id);
  }

  // ordenadas devuelve una copia de las tareas ordenadas por prioridad y por fecha límite
  ordenadas() {
    return [...this.#tareas].sort((a, b) => {
      if (a.peso !== b.peso) {
        return b.peso - a.peso;
      }
      if (a.limite === null && b.limite === null) { return 0 }
      if (a.limite === null) { return 1 }
      if (b.limite === null) { return -1 }
      return a.limite - b.limite;
    })
  }
}
// Comprueba con:  docker compose run --rm web npm test 3-columna

