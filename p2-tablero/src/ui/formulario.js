// formulario.js — Bloque B · 👀 leerFormulario (RESUELTO) y ✍️ B2 (mostrarErrores).

// 👀 Resuelto. Del formulario TODO llega como texto: aquí se limpia y se convierte.

// leerFormulario lee el formulario y devuelve los datos limpios para crear una tarea
export function leerFormulario(form) {
  const campos = Object.fromEntries(new FormData(form));
  const datos = {
    titulo: (campos.titulo ?? "").trim(),
    prioridad: campos.prioridad,
    limite: campos.limite ? campos.limite : null,
  };
  if (campos.cadaDias?.trim()) datos.cadaDias = Number(campos.cadaDias);
  return datos;
}

// ✍️ B2 · mostrarErrores(form, errores)   errores = { campo: "mensaje" }
//   - Recorre los <p data-error-de="campo"> del formulario (querySelectorAll)
//   - Si ese campo tiene error: el mensaje en el <p> y aria-invalid="true" en el control
//     (el control es form.elements[campo])
//   - Si no lo tiene: <p> vacío y SIN aria-invalid (removeAttribute)
//   Pista: p.dataset.errorDe es el nombre del campo (data-error-de → dataset.errorDe)

// escribe cada error debajo de su campo y lo marca como inválido
export function mostrarErrores(form, errores) {
  const huecos = form.querySelectorAll("[data-error-de]");
    for (const hueco of huecos) {
      const nombre_campo = hueco.getAttribute("data-error-de");
      const input = form.querySelector(`[name="${nombre_campo}"]`);
      const mensaje = errores[nombre_campo];
      if (mensaje !== undefined) {
        hueco.textContent = mensaje;
        input.setAttribute("aria-invalid", "true");
      } else {
        hueco.textContent = "";
        input.removeAttribute("aria-invalid");
      }
    }

}
