// Tablero.js — Bloque A · ✍️ A3 (el tablero) y A5 (reglas).
// En el bloque C volverás aquí para ✍️ C4 (toJSON y desdeJSON).
// El tablero TIENE tres columnas: es composición, no hereda de nadie.
import { Columna } from "./Columna.js";
import { ColumnaLlenaError, MovimientoNoPermitidoError } from "./errores.js";
import { Tarea } from "./Tarea.js";
import { TareaRecurrente } from "./TareaRecurrente.js";
import { aDatos, desdeDatos } from "./serializar.js";

export class Tablero {
  static COLUMNAS = Object.freeze(["Por hacer", "En curso", "Hecho"]);
  static VERSION_DATOS = 1; // (bloque C) si algún día cambia el formato guardado, se sube
  // Privado: #columnas, un Map nombre → Columna
   #columnas = new Map();
  // ✍️ A3 ──────────────────────────────────────────────────────────────────────

  // constructor crea las tres columnas y solo en curso lleva límite
  constructor(limiteEnCurso = 3) {
    // Crea las tres columnas; solo «En curso» lleva límite WIP (limiteEnCurso)
    for (const nombre of Tablero.COLUMNAS) { // Recorremos las 3 columnas: por hacer, en curso y hecho. 
      const limite = nombre === "En curso" ? limiteEnCurso: undefined; // Solo la columna "En curso" tiene limite
      this.#columnas.set(nombre, new Columna(nombre, limite)) // Creamos las columnas
    }
  }

  // Crea un tablero y le mete una tarea por cada objeto de datos
  // desde crea un tablero con una tarea por cada objeto de datos
  static desde(datos, limiteEnCurso) {
    const tablero = new Tablero(limiteEnCurso);
    for (const dato of datos) {
      tablero.crearTarea(dato);
    }
    return tablero;
  }

  // columna(nombre): la Columna, o un Error si no existe (que el mensaje lleve el nombre)
  // get columnas: array con las tres columnas, en orden

  // Devuelve la columna con ese nombre, o lanza un error si no existe
  // columna devuelve la columna con ese nombre y da error si no existe
  columna(nombre) {
    const columna = this.#columnas.get(nombre);
    if (columna === undefined) {
      throw new Error(`No existe la columna ${nombre}`);
    }
    return columna;
  }
  // Las tres columnas en un array (el Map guarda el orden en que se metieron)
  // columnas devuelve las tres columnas en orden
  get columnas() {
    return [...this.#columnas.values()];
  }

  // crearTarea(datos): TareaRecurrente si datos trae cadaDias, Tarea si no → a «Por hacer»
  //   y la devuelve. datos es un objeto { titulo, prioridad, limite, cadaDias }: saca cada campo
  //   y pásaselo al constructor, en su orden (new Tarea(datos) NO vale: espera el título)

  // crearTarea crea una tarea normal o recurrente y la mete en por hacer
  crearTarea(datos) {
    let tarea;
    if (datos.cadaDias !== undefined) {
      tarea = new TareaRecurrente(datos.titulo, datos.prioridad, datos.limite, datos.cadaDias);
    } else {
      tarea = new Tarea(datos.titulo, datos.prioridad, datos.limite);
    }
    this.columna("Por hacer").añadir(tarea);
    return tarea;
  }

  // Busca la tarea en todas las columnas; si no está, devuelve null
  // buscar devuelve la tarea con ese id esté donde esté
  buscar(id) {
    for (const columna of this.#columnas.values()) {
      const tarea = columna.tareas.find((t) => t.id === id);
      if (tarea !== undefined) {
        return tarea;
      }
    }
    return null;
  }

  // Devuelve la columna donde está la tarea, si no devuelve null
  dondeEsta(id) {
    for (const columna of this.#columnas.values()) {
      if (columna.tiene(id)) {
        return columna;
      }
    }
    return null;
  }

  // Mueve la tarea a otra columna y la devuelve
  mover(id, destino) {
    return this.#trasladar(id, destino);
  }

  // La pasa a «Hecho» y mete en «Por hacer» lo que devuelva alCompletar().
  completar(id) {
    const tarea = this.#trasladar(id, "Hecho");
    for (const nueva of tarea.alCompletar()) {
      this.columna("Por hacer").añadir(nueva);
    }
    return tarea;
  }

  // Cuenta cuántas tareas hay en cada columna y cuántas están vencidas
  resumen(hoy = new Date()) {
    const porHacer = this.columna("Por hacer").tareas;
    const enCurso = this.columna("En curso").tareas;
    const hecho = this.columna("Hecho").tareas;
 
    const pendientes = [...porHacer, ...enCurso];
    const vencidas = pendientes.filter((t) => t.estaVencida(hoy)).length;
 
    return {
      porHacer: porHacer.length,
      enCurso: enCurso.length,
      hecho: hecho.length,
      vencidas: vencidas,
    };
  }
  // ✍️ A5 · Reglas (vuelves a mover y completar) ─────────────────────────────────
  //   - Columna llena → ColumnaLlenaError (en vez de un Error cualquiera)
  //   - Sacar una tarea de «Hecho», o «moverla» a la columna en la que ya está →
  //     MovimientoNoPermitidoError. Todo se comprueba ANTES de tocar nada.
  //   Pista: mover y completar hacen casi lo mismo. Un método privado #trasladar(id, destino)
  //   con las comprobaciones evita escribirlas dos veces.

    // trasladar comprueba las reglas antes de tocar nada y si todo va bien mueve la tarea
    #trasladar(id, destino) {
    const columnaDestino = this.columna(destino);
    const columnaOrigen = this.dondeEsta(id);

    if (columnaOrigen === null) {
      throw new Error(`No existe la tarea ${id}`);
    }

    if (columnaOrigen.nombre === "Hecho" || columnaOrigen === columnaDestino) {
      throw new MovimientoNoPermitidoError(id, columnaOrigen.nombre, columnaDestino.nombre);
    }

    if (columnaDestino.llena) {
      throw new ColumnaLlenaError(columnaDestino);
    }


    const tarea = columnaOrigen.quitar(id);
    columnaDestino.añadir(tarea);
    return tarea;
  }

  // ✍️ C4 (bloque C) ────────────────────────────────────────────────────────────
  // toJSON(): { version, limiteEnCurso, columnas: { "Por hacer": [datos…], … } }
  //   JSON.stringify(tablero) lo llama solo. Sin él sale "{}": los # no se ven. Usa aDatos.

  // tojson indica lo que se guarda en json: la versión, el límite y las tareas
  toJSON() {
    const columnas = {};
    for (const columna of this.columnas) {
      columnas[columna.nombre] = columna.tareas.map((tarea) => aDatos(tarea));
    }
    return {
      version: Tablero.VERSION_DATOS,
      limiteEnCurso: this.columna("En curso").limiteWip,
      columnas: columnas,
    };
  }

  // desdejson rehace el mismo tablero a partir de los datos guardados
  static desdeJSON(datos) {
    // Tiene que ser un objeto de nuestra versión
    if (datos === null || datos.version !== Tablero.VERSION_DATOS) {
      throw new Error("Los datos no son de esta versión del tablero");
    }

    // Creamos un tablero vacío con el mismo límite
    const tablero = new Tablero(datos.limiteEnCurso);

    // Metemos cada tarea en SU columna (con su mismo id)
    for (const nombre of Tablero.COLUMNAS) {
      const lista = datos.columnas[nombre];
      if (!Array.isArray(lista)) {
        throw new Error(`Faltan las tareas de la columna ${nombre}`);
      }
      for (const dato of lista) {
        tablero.columna(nombre).añadir(desdeDatos(dato));
      }
    }
    return tablero;
  }

  mover(id, destino) {
  const origen = this.dondeEsta(id);
  const tarea = this.buscar(id);
  tarea.comprobarPaso(origen.nombre, destino);
}

// Comprueba con:  docker compose run --rm web npm test bloque-a
