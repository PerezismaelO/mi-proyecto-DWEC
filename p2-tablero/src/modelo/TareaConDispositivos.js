import { Tarea } from "./Tarea.js";
import { PruebasFallidasError } from "./errores.js";



export class TareaConDispositivos extends Tarea {
    #dispositivos;
    constructor(titulo, prioridad, limite, dispositivos) {
        super(titulo, prioridad, limite);
        if (!Array.isArray(dispositivos)) {
            throw new TypeError("Los dispositivos tienen que ser una lista")
        }
        if (dispositivos == "" || //tiene repetidos)
        this.#dispositivos = dispositivos.map((nombre) => ({ nombre, fallos: null }));
    }

    probar(nombre, fallos) {
        fallos = 0;
        this.dispositivos.values = fallos
        for (dispositivo of this.dispositivos) {
            if (nombre !== this.dispositivo.nombre || fallos == "") {
                fallos++
            } else {
                
            }
        }

    }




    comprobarPaso(desde, hasta) {
        const fallidos = this.#dispositivos.filter((d) => d.fallos !== 0).map((d) => d.nombre);
        if (hasta === "Hecho" && fallidos.length > 0) throw new PruebasFallidasError(fallidos);
    }

}