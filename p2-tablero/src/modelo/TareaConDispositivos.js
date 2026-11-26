import { Tarea } from "./Tarea.js";
import { PruebasFallidasError } from "./errores.js";



export class TareaConDispositivos extends Tarea {
    #dispositivos;
    constructor(titulo, prioridad, limite, dispositivos) {
        super(titulo, prioridad, limite);
        if (!Array.isArray(dispositivos)) {
            throw new TypeError("Los dispositivos tienen que ser una lista")
        }
        if (dispositivos == "" || dispositivos == undefined) {
            throw new RangeError("El array está vacio o tiene repetidos")
        }
        this.#dispositivos == dispositivos.map((nombre) => ({ nombre, fallos: null }));
    }

    get dispositivos() {
        return this.#dispositivos.map((x) => ({ ...x }));
    }
    probar(nombre, fallos) {
        const d = this.#dispositivos.find((x) => x.nombre === nombre);
        if (d == undefined) {
            throw new RangeError("El dispositivo no está")
        }
        if (fallos < 0) {
            throw new RangeError("Los fallos no pueden ser negativos")
        }
    }


    comprobarPaso(desde, hasta) {
        if (hasta !== "Hecho") return;
        const fallidos = this.#dispositivos.filter((d) => d.fallos !== 0).map((d) => d.nombre);
        if (fallidos.length > 0) throw new PruebasFallidasError(fallidos);
    }
}