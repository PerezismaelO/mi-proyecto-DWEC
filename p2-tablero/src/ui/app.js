// app.js — Bloque B · ✍️ B4, B5 y B6. Conecta el modelo (el tablero) con la página: pinta, escucha y avisa.
// Usa tus piezas: crearTarjeta/pintarLista, leerFormulario/mostrarErrores y delegar.
// La estructura de la página (ids, data-*) está en index.html y NO se cambia: la usan los tests.
import { ErrorTablero } from "../modelo/errores.js";
import { delegar } from "./delegacion.js";
import { leerFormulario, mostrarErrores } from "./formulario.js";
import { pintarLista } from "./tarjeta.js";

// Botones de cada tarjeta según su columna
const ACCIONES = {
  "Por hacer": [["Empezar →", "empezar"]],
  "En curso": [
    ["← Volver", "volver"],
    ["✓ Completar", "completar"],
  ],
  Hecho: [],
};

// ✍️ B6 · validar(datos) → { campo: "mensaje" } con los errores (objeto vacío si todo está bien)
//   - titulo: obligatorio y como mucho 80 caracteres
//   - cadaDias (si viene): entero mayor que 0. Si es correcto pero no hay limite, el error va
//     en «limite»: una tarea que se repite necesita fecha límite

// validar comprueba los datos del formulario y devuelve los errores
export function validar(datos) {
  const errores = {};

  if (datos.titulo === "") {
    errores.titulo = "Escribe un título";
  } else if (datos.titulo.length > 80) {
    errores.titulo = "El título no puede pasar de 80 caracteres";
  }

  if (datos.cadaDias !== undefined) {
    if (!Number.isInteger(datos.cadaDias) || datos.cadaDias < 1) {
      errores.cadaDias = "Tiene que ser un número entero mayor que 0";
    } else if (datos.limite === null) {
      errores.limite = "Una tarea que se repite necesita fecha límite";
    }
  }

  return errores;
}
/**
 * Arranca la interfaz dentro de raiz (el <main id="app">). Los listeners se ponen UNA vez aquí;
 * pintar() solo cambia nodos, así que repintar no los duplica.
 * opciones.hoy: fecha fija para los tests · opciones.alCambiar(tablero): tras cada cambio (UD6)
 */
// iniciarapp arranca la página pinta el tablero y pone los listeners una sola vez
export function iniciarApp(raiz, tablero, { hoy = null, alCambiar = () => {} } = {}) {
  const form = raiz.querySelector("#form-alta");
  const aviso = raiz.querySelector("#aviso");
  const columnas = raiz.querySelector("#columnas");
  const resumen = raiz.querySelector("#resumen");

  // ✍️ B4 · pintar(): deja la página igual que el modelo cada vez que se llama, y NO pone listeners
  //   - cada columna ([data-columna="…"]): sus tareas en el orden de ordenadas(), con pintarLista en su
  //     .lista, y en cada .tarjeta sus botones según ACCIONES: <button type="button" data-accion="…">
  //   - el .contador de cada columna: (n), o (n/límite) en la que tiene límite WIP
  //   - [data-dato="progreso"]: hechas ÷ total en %, redondeado (con el tablero vacío, 0 %)
  //   - [data-dato="vencidas"]: las vencidas de tablero.resumen(ahora)
  //   La fecha de hoy: const ahora = hoy ?? new Date();  (los tests pasan una fija)
  // pintar deja la página igual que el tablero con tarjetas botones contadores y resumen
  function pintar() {
    const ahora = hoy ?? new Date();

    for (const columna of tablero.columnas) {
      const caja = columnas.querySelector(`[data-columna="${columna.nombre}"]`);
      const tareas = columna.ordenadas();

      // Las tarjetas de la columna (pintarLista ya vacía antes de pintar)
      pintarLista(caja.querySelector(".lista"), tareas, ahora);

      // Los botones de cada tarjeta, según la columna en la que está
      for (const tarjeta of caja.querySelectorAll(".tarjeta")) {
        for (const [texto, accion] of ACCIONES[columna.nombre]) {
          const boton = document.createElement("button");
          boton.type = "button";
          boton.dataset.accion = accion;
          boton.textContent = texto;
          tarjeta.append(boton);
        }
      }
    
      const n = tareas.length;
      caja.querySelector(".contador").textContent =
        columna.limiteWip === null ? `(${n})` : `(${n}/${columna.limiteWip})`;
    }

    // El resumen: progreso en % y cuántas están vencidas
    const { porHacer, enCurso, hecho, vencidas } = tablero.resumen(ahora);
    const total = porHacer + enCurso + hecho;
    const progreso = total === 0 ? 0 : Math.round((hecho / total) * 100);
    resumen.querySelector('[data-dato="progreso"]').textContent = `${progreso} %`;
    resumen.querySelector('[data-dato="vencidas"]').textContent = String(vencidas);
  }

  // 👀 Resuelto: avisar("texto") enseña el aviso; avisar("") lo esconde
  // avisar enseña un mensaje en el aviso o lo esconde si está vacío
  function avisar(mensaje) {
    aviso.textContent = mensaje;
    aviso.hidden = mensaje === "";
  }

  // ✍️ B5 · UN listener, puesto UNA vez aquí (nunca dentro de pintar): clic en los botones de las
  //   tarjetas, con delegar sobre `columnas`. empezar → «En curso», volver → «Por hacer», completar.
  //   Tras cada cambio que sale bien: avisar(""), pintar() y alCambiar(tablero).
  //   Si el tablero lanza un ErrorTablero → avisar(error.message) y no se repinta.
  //   Cualquier otro error → se relanza (es un fallo del programa).
  //   Pista: una función cambiar(accion) con el try/catch te sirve también para el B6.

  // cambiar hace un cambio en el tablero si sale bien repinta y guarda y si falla enseña el aviso
  function cambiar(accion) {
    try {
      accion();
    } catch (error) {
      if (error instanceof ErrorTablero) {
        avisar(error.message);
        return;
      }
      throw error;
    }
    avisar("");
    pintar();
    alCambiar(tablero);
  }

  // listener de los botones mueve o completa la tarea según el botón pulsado
  delegar(columnas, "click", "button[data-accion]", function (boton) {
    const id = Number(boton.closest(".tarjeta").dataset.id);
    const accion = boton.dataset.accion;

    if (accion === "empezar") {
      cambiar(() => tablero.mover(id, "En curso"));
    } else if (accion === "volver") {
      cambiar(() => tablero.mover(id, "Por hacer"));
    } else if (accion === "completar") {
      cambiar(() => tablero.completar(id));
    }
  });
 
  // ✍️ B6 · submit de `form`: preventDefault, leerFormulario, validar y mostrarErrores. Si hay errores,
  //   no se crea nada. Si no, tablero.crearTarea(datos) (como un cambio más) y form.reset().

    // listener del formulario valida los datos y si están bien crea la tarea
    form.addEventListener("submit", function (evento) {
    evento.preventDefault(); // que no recargue la página

    const datos = leerFormulario(form);
    const errores = validar(datos);
    mostrarErrores(form, errores);

    // Si hay algún error, no se crea nada
    if (Object.keys(errores).length > 0) {
      return;
    }

    cambiar(() => tablero.crearTarea(datos));
    form.reset();
  });

  pintar();
  return { pintar };
}

(void ErrorTablero, delegar, leerFormulario, mostrarErrores); // (borra esta línea cuando los uses)











// A tareaConMateriales
// B boton nuevo en cada tarjeta de porhacer
// C traer las revisiones



// Notas para la defensa

// Listener
// al pulsar un boton
// delegar tiene un solo listener en columnas
// closest sube hasta el boton y el manejador saca el id y la accion
// el manejador llama a cambiar y cambiar le pide el cambio al tablero
// si sale bien repinta y guarda
// si es un error del tablero enseña el aviso

// Polimorfismo
// esta en completar de tablero
// llama a alcompletar sin mirar el tipo de tarea
// la normal devuelve una lista vacia
// la recurrente devuelve una lista con la siguiente
// asi si hay un tipo nuevo completar no se toca

// Regla nueva
// va en trasladar de tablero con las otras reglas
// siempre antes de quitar y añadir para que la tarea no se pierda
// la pagina no se toca porque cambiar ya enseña el aviso



// cosas que me pueden pedir


// regla nueva
// en trasladar de tablero un if y throw new movimientonopermitidoerror


// boton nuevo
// en acciones de app y una rama mas en el manejador de delegar
// boton completar en por hacer solo se toca acciones


// cambiar el limite
// en el constructor de tablero cambiar el 3


// dato nuevo en el resumen
// en resumen de tablero y pintarlo en pintar