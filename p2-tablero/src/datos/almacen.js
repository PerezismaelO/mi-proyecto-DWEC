// almacen.js — Bloque C · 👀 EJEMPLO RESUELTO. localStorage solo guarda TEXTO: JSON de ida y vuelta.
// storage se puede pasar (para los tests); por defecto, el localStorage del navegador.

// guardar: guarda un valor en localStorage como texto JSON
export function guardar(clave, valor, storage = localStorage) {
  storage.setItem(clave, JSON.stringify(valor));
}

/** El valor guardado, o porDefecto si no hay nada o lo guardado no es JSON válido (no revienta) */
// cargar: lee un valor de localStorage (o el valor por defecto si no hay o está roto)
export function cargar(clave, porDefecto = null, storage = localStorage) {
  const texto = storage.getItem(clave); // null si no existe
  if (texto === null) return porDefecto;
  try {
    return JSON.parse(texto);
  } catch {
    return porDefecto;
  }
}

// borrar: quita la clave de localStorage
export function borrar(clave, storage = localStorage) {
  storage.removeItem(clave);
}
