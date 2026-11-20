// delegacion.js — Bloque B · ✍️ B3 (delegar).
// ✍️ B3 · delegar(contenedor, tipo, selector, manejador)
//   - UN solo addEventListener, en el contenedor (no en cada botón)
//   - Dentro: el elemento que encaja es evento.target.closest(selector). Si lo hay y está DENTRO
//     del contenedor (contenedor.contains(...)), llama a manejador(elemento, evento)
//   - Devuelve una función que quita el listener (removeEventListener con la MISMA función)


export function delegar(contenedor, tipo, selector, manejador) {
  function listener (evento) {
    // Subimos desde lo que se ha pulsado hasta el boton.
    const elemento = evento.target.closest(selector);

    // Si no hay nada no hacemos nada
    if (elemento === null) {
      return;
    }
    // Si está fuera del contenedor no hacemos nada
    if (!contenedor.contains(elemento)) {
      return;
    }
    manejador(elemento, evento);
  }
  // Ponemos el listener en el contenedor
  contenedor.addEventListener(tipo, listener);

  // Quitamos el listener
  return function quitar() {
    contenedor.removeEventListener(tipo, listener);
  }

}
