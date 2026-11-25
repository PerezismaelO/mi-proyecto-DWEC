// red.js — Bloque C · ✍️ C2. Pedir un JSON con fetch y async/await, sin fiarse de nada.

// ✍️ C2 · async obtenerJSON(url, fetchFn = fetch) → el JSON ya convertido
//   - const respuesta = await fetchFn(url)
//   - Si !respuesta.ok → lanza un Error con el código (respuesta.status) Y la url en el mensaje
//   - Si la cabecera content-type no incluye "application/json" → lanza un Error con la url
//     (Vite devuelve su index.html, con un 200, cuando el fichero no existe)
//   - Si todo va bien, devuelve respuesta.json()
//   - Los errores de red (sin conexión) NO se capturan aquí: que le lleguen a quien llama

// obtenerJSON: pide la url con fetch y devuelve el JSON (error si falla o no es JSON)
export async function obtenerJSON(url, fetchFn = fetch) {
  // Pedimos la url y esperamos la respuesta
  const respuesta = await fetchFn(url);

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al pedir ${url}`);
  }

  // Ha contestado, pero no con un JSON
  const tipo = respuesta.headers.get("content-type") ?? "";
  if (!tipo.includes("application/json")) {
    throw new Error(`${url} no es un JSON`);
  }

  // devolvemos el JSON convertido
  return respuesta.json();
}
