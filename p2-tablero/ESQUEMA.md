# Esquema de `p2-tablero` — mapa para entenderlo todo

> Tablero kanban (Por hacer → En curso → Hecho) en JavaScript puro, con Vite + Vitest, todo dentro de Docker.
> Leyenda: ✅ hecho · ⏳ «Sin hacer» (lanza `Error("Sin hacer")`) · 👀 resuelto por el profesor

---

## 1. La idea en una frase

```
 DATOS (UD6)            MODELO (UD4)                 INTERFAZ (UD5)
 localStorage / fetch → clases Tarea, Columna,     → DOM: pinta tarjetas,
 (guardar y cargar)     Tablero (reglas del juego)    escucha clics y formulario
```

**Regla de oro:** el modelo (`src/modelo/`) **nunca** toca el DOM ni el almacenamiento. La UI y los datos sí usan el modelo, pero no al revés.

---

## 2. Árbol de carpetas

```
p2-tablero/
├── index.html               Estructura fija de la página (ids, data-*, clases que usan los tests)
├── package.json             Scripts: dev (vite) · test (vitest) · lint (eslint) · formato (prettier)
├── compose.yaml             Contenedor node:22 → todo se ejecuta con `docker compose run --rm web …`
├── docker/como-tu.mjs       Lanza las órdenes con tu usuario (no root) → sin problemas de permisos
├── public/
│   └── tareas-iniciales.json   Tareas que se cargan por fetch la primera vez (bloque C)
├── src/
│   ├── main.js              🚀 Punto de entrada
│   ├── arranque.js          👀 Une datos → modelo → interfaz (bloque C)
│   ├── estilos.css
│   ├── modelo/              ── BLOQUE A (UD4): clases, herencia, errores ──
│   │   ├── fechas.js        👀 parsearFecha, soloDia, formatear
│   │   ├── Tarea.js         👀 clase base
│   │   ├── TareaRecurrente.js ✅ extends Tarea
│   │   ├── Columna.js       ✅ contiene tareas, límite WIP
│   │   ├── errores.js       ✅ ErrorTablero y sus hijos
│   │   ├── Tablero.js       ✅ (A3, A5) · ⏳ C4 toJSON / desdeJSON
│   │   └── serializar.js    👀 fechaATexto, aDatos · ⏳ C1 desdeDatos
│   ├── ui/                  ── BLOQUE B (UD5): DOM y eventos ──
│   │   ├── tarjeta.js       👀 crearTarjeta · ✅ B1 pintarLista
│   │   ├── formulario.js    👀 leerFormulario · ✅ B2 mostrarErrores
│   │   ├── delegacion.js    ✅ B3 delegar
│   │   └── app.js           ⏳ B4 pintar · ⏳ B5 acciones · ⏳ B6 validar + alta
│   └── datos/               ── BLOQUE C (UD6): persistencia y red ──
│       ├── almacen.js       👀 guardar, cargar, borrar (localStorage + JSON)
│       ├── red.js           ⏳ C2 obtenerJSON
│       └── persistencia.js  ⏳ C5 guardarTablero · ⏳ C6 arrancar
└── tests/                   ⚠️ NO se tocan
    ├── pagina.js            Carga el <body> de index.html en happy-dom
    ├── simulados.js         almacenFalso (localStorage falso), fetchFalso, fetchSinRed
    ├── bloque-a/  1-tarea · 2-recurrente · 3-columna · 4-tablero · 5-errores
    ├── bloque-b/  1-tarjeta · 2-formulario · 3-delegacion · 4-pintar · 5-acciones · 6-alta
    └── bloque-c/  1-almacen · 2-serializar · 3-red · 4-tablero-json · 5-persistencia · 6-arranque
```

---

## 3. Grafo de dependencias (quién importa a quién)

```
main.js
 ├── arranque.js
 │    ├── datos/persistencia.js
 │    │    ├── modelo/Tablero.js
 │    │    ├── datos/almacen.js
 │    │    └── datos/red.js
 │    └── ui/app.js
 ├── modelo/Tablero.js
 └── ui/app.js
      ├── modelo/errores.js
      ├── ui/delegacion.js
      ├── ui/formulario.js
      └── ui/tarjeta.js ──► modelo/fechas.js

modelo/Tablero.js
 ├── Columna.js ──► Tarea.js
 ├── errores.js
 ├── Tarea.js ──► fechas.js
 ├── TareaRecurrente.js ──► Tarea.js
 └── serializar.js ──► Tarea.js, TareaRecurrente.js
```

---

## 4. El MODELO (bloque A) — jerarquía de clases

### 4.1 Herencia y composición

```
HERENCIA ("es un")                         COMPOSICIÓN ("tiene")

Error (nativo)                             Tablero
 └── ErrorTablero                           └── #columnas: Map
      ├── ColumnaLlenaError                      ├── "Por hacer" → Columna (sin límite)
      └── MovimientoNoPermitidoError             ├── "En curso"  → Columna (límite WIP)
                                                 └── "Hecho"     → Columna (sin límite)
Tarea                                                              └── #tareas: [Tarea | TareaRecurrente]
 └── TareaRecurrente
```

### 4.2 `Tarea` (👀 `modelo/Tarea.js`)

| Miembro | Tipo | Qué hace |
|---|---|---|
| `PRIORIDADES` | static, congelado | `["baja","media","alta"]` |
| `#siguienteId` | static privado | contador global de ids (1, 2, 3…) |
| `#titulo`, `#prioridad` | privados | solo se tocan a través de get/set |
| `constructor(titulo, prioridad="media", limite=null)` | | asigna `id`, valida vía setters, `limite` → `Date` con `parsearFecha`, `creada = new Date()` |
| `get/set titulo` | | string no vacío, ≤ 80 caracteres, recortado → si no `TypeError`/`RangeError` |
| `get/set prioridad` | | debe estar en `PRIORIDADES` → si no `RangeError` |
| `get peso` | | 0 baja · 1 media · 2 alta (para ordenar) |
| `bajarPrioridad()` | | baja un nivel; `false` si ya era baja |
| `estaVencida(hoy)` | | `limite < hoy` (comparando solo el día) |
| `alCompletar()` | **polimórfico** | devuelve `[]` |
| `toString()` | | `#3 [alta] Título · límite 20/11/2026` |

### 4.3 `TareaRecurrente extends Tarea` (✅ A1)

- `constructor(titulo, prioridad, limite, cadaDias)` → `super(...)`, luego valida:
  - `cadaDias` entero ≥ 1, si no `RangeError`
  - debe tener `limite`, si no `TypeError`
- `siguiente()` → **nueva** `TareaRecurrente` igual, con límite `+cadaDias` días (copia la fecha, no muta `this.limite`)
- `alCompletar()` → `[this.siguiente()]` ← **sobrescribe** al padre
- `toString()` → `super.toString() + " · 🔁 cada N días"`

### 4.4 `Columna` (✅ A2)

- `#tareas = []`, `nombre`, `limiteWip` (`null` o entero ≥ 1)
- `get llena` → hay límite y `length >= limiteWip`
- `get tareas` → **copia** del array (encapsulación)
- `añadir(tarea)` → `TypeError` si no es `Tarea` · `Error` si está llena
- `quitar(id)` → `findIndex` + `splice` · `Error` si no está
- `tiene(id)` → `some`
- `ordenadas()` → copia ordenada: mayor `peso` primero; a igual peso, límite más cercano; sin límite al final

### 4.5 Errores (✅ A4, `modelo/errores.js`)

| Clase | Datos que guarda | Mensaje |
|---|---|---|
| `ErrorTablero` | `name` = nombre de la clase | el que reciba |
| `ColumnaLlenaError(columna)` | `columna` (nombre), `limite` | `«En curso» está llena (máximo 3)` |
| `MovimientoNoPermitidoError(id, desde, hasta)` | `desde`, `hasta` | `No se puede mover la tarea 4 de «Hecho» a «En curso»` |

**Para qué sirven:** la UI hace `if (error instanceof ErrorTablero)` → es un error «esperado» (se avisa al usuario); cualquier otro es un fallo de programación (se relanza).

### 4.6 `Tablero` (✅ A3 + A5 · ⏳ C4)

```
Tablero
├── static COLUMNAS = ["Por hacer","En curso","Hecho"]
├── static VERSION_DATOS = 1
├── #columnas: Map<nombre, Columna>
│
├── constructor(limiteEnCurso = 3)     crea las 3 columnas (solo «En curso» con límite)
├── static desde(datos, limite)        tablero + crearTarea(d) por cada dato
│
├── columna(nombre)                    la Columna o Error
├── get columnas                       [las 3 columnas en orden]
├── crearTarea({titulo,prioridad,limite,cadaDias})
│                                      → TareaRecurrente si hay cadaDias, si no Tarea → «Por hacer»
├── buscar(id)                         la tarea o null
├── dondeEsta(id)                      la Columna o null
├── mover(id, destino)        ─┐
├── completar(id)             ─┼──► #trasladar(id, destino)   ← reglas centralizadas
│     └── luego mete en «Por hacer» lo que devuelva tarea.alCompletar()  (polimorfismo)
├── resumen(hoy)                       { porHacer, enCurso, hecho, vencidas }
│                                      (vencidas = solo las NO hechas)
├── ⏳ toJSON()                        { version, limiteEnCurso, columnas: { nombre: [aDatos…] } }
└── ⏳ static desdeJSON(datos)         lo contrario
```

**`#trasladar(id, destino)` — orden de comprobaciones (antes de tocar nada):**

```
1. columna(destino)              → Error si no existe esa columna
2. dondeEsta(id) === null        → Error («No existe la tarea»)
3. origen es «Hecho» o
   origen === destino            → MovimientoNoPermitidoError
4. destino.llena                 → ColumnaLlenaError
5. origen.quitar(id) → destino.añadir(tarea) → return tarea
```

### 4.7 Utilidades

- **`fechas.js`** 👀 — `parsearFecha("2026-11-20")` → `Date` local a las 00:00 (evita el desfase UTC de `new Date("…")`), valida que el día exista · `soloDia(fecha)` · `formatear(fecha)` → `"20/11/2026"`
- **`serializar.js`** — `fechaATexto(date)` → `"AAAA-MM-DD"` · `aDatos(tarea)` → `{id, titulo, prioridad, limite, cadaDias?}` · ⏳ `desdeDatos(datos)` → la tarea de vuelta (con su id)

---

## 5. La INTERFAZ (bloque B)

### 5.1 Estructura de `index.html` (no cambiar)

```
<main id="app">
├── <form id="form-alta" novalidate>
│    ├── input[name=titulo]       + <p class="error" data-error-de="titulo">
│    ├── select[name=prioridad]   (baja / media / alta)
│    ├── input[name=limite] date  + <p data-error-de="limite">
│    ├── input[name=cadaDias]     + <p data-error-de="cadaDias">
│    └── button[type=submit]
├── <p id="estado" hidden>          «Cargando tareas…» / error de carga
├── <p id="aviso" role="alert" hidden>  mensajes de ErrorTablero
├── <section id="resumen">
│    ├── [data-dato="progreso"]   «40 %»
│    └── [data-dato="vencidas"]   «2»
└── <section id="columnas">
     └── .columna[data-columna="Por hacer" | "En curso" | "Hecho"]
          ├── h2 > span.contador   «(2)» o «(1/3)» si tiene WIP
          └── div.lista            ← aquí van las tarjetas
```

### 5.2 Piezas de `src/ui/`

| Función | Archivo | Estado | Qué hace |
|---|---|---|---|
| `crearTarjeta(tarea, hoy)` | tarjeta.js | 👀 | `<article class="tarjeta tarjeta--alta [tarjeta--vencida]" data-id>` + `h3` + `p.tarjeta__limite` (usa `textContent`, nunca `innerHTML`) |
| `pintarLista(cont, tareas, hoy)` | tarjeta.js | ✅ | vacía (`replaceChildren`) y pone tarjetas, o `<p class="vacia">Sin tareas</p>` |
| `leerFormulario(form)` | formulario.js | 👀 | `FormData` → `{titulo, prioridad, limite\|null, cadaDias?: number}` |
| `mostrarErrores(form, errores)` | formulario.js | ✅ | rellena cada `[data-error-de]` y pone/quita `aria-invalid` |
| `delegar(cont, tipo, selector, fn)` | delegacion.js | ✅ | 1 listener en el contenedor, `target.closest(selector)`, devuelve función para quitarlo |
| `validar(datos)` | app.js | ⏳ B6 | `{campo: "mensaje"}`: título obligatorio ≤ 80; `cadaDias` entero > 0; si hay `cadaDias` sin `limite` → error en `limite` |
| `iniciarApp(raiz, tablero, {hoy, alCambiar})` | app.js | parcial | ver abajo |

### 5.3 `iniciarApp` por dentro

```
iniciarApp(raiz, tablero, { hoy, alCambiar })
├── referencias: form, aviso, columnas, resumen
├── ⏳ pintar()          modelo → DOM (sin listeners)
│     ├── por cada columna: pintarLista(.lista, columna.ordenadas(), ahora)
│     │     + botones según ACCIONES en cada .tarjeta
│     ├── .contador  → (n) o (n/límite)
│     ├── progreso   → round(hechas / total * 100) %   (0 % si vacío)
│     └── vencidas   → tablero.resumen(ahora).vencidas
├── 👀 avisar(msg)       muestra/oculta #aviso
├── ⏳ B5  delegar(columnas, "click", "button[data-accion]", …)
│          empezar → mover a «En curso» · volver → mover a «Por hacer» · completar → completar
├── ⏳ B6  form.addEventListener("submit", …)
│          preventDefault → leerFormulario → validar → mostrarErrores
│          sin errores → tablero.crearTarea(datos) → form.reset()
├── pintar()   (la primera vez)
└── return { pintar }
```

**Botones por columna (`ACCIONES`):**

| Columna | Botones (`data-accion`) |
|---|---|
| Por hacer | `Empezar →` (`empezar`) |
| En curso | `← Volver` (`volver`), `✓ Completar` (`completar`) |
| Hecho | — |

**Patrón para cada cambio (pista del enunciado: una función `cambiar(accion)`):**

```js
try {
  accion();               // p. ej. () => tablero.mover(id, "En curso")
  avisar(""); pintar(); alCambiar(tablero);
} catch (error) {
  if (error instanceof ErrorTablero) avisar(error.message);   // esperado: no se repinta
  else throw error;                                           // bug: se relanza
}
```

> Ojo: `tarjeta.dataset.id` es **texto**; los ids del modelo son **números** → `Number(...)` antes de llamar al tablero.

---

## 6. Los DATOS (bloque C)

| Función | Archivo | Estado | Qué hace |
|---|---|---|---|
| `guardar / cargar / borrar` | almacen.js | 👀 | `localStorage` + `JSON.stringify/parse`; `cargar` devuelve `porDefecto` si no hay nada o el JSON está roto |
| `obtenerJSON(url, fetchFn)` | red.js | ⏳ C2 | `fetch` → error si `!ok` (con status y url) o si no es `application/json`; si no, `respuesta.json()`. Los errores de red NO se capturan |
| `guardarTablero(tablero, storage)` | persistencia.js | ⏳ C5 | `guardar(CLAVE, tablero, storage)` (usa `toJSON`) · `CLAVE = "dwec-p2-tablero"` |
| `arrancar({storage, fetchFn, url, limiteEnCurso})` | persistencia.js | ⏳ C6 | `{ tablero, origen, error? }` con 3 casos: `"guardado"`, `"inicial"`, `"vacio"` (detalles en el enunciado) |
| `iniciar(raiz, opciones)` | arranque.js | 👀 | «Cargando…» → `arrancar` → muestra error si lo hay → guarda → `iniciarApp` con `alCambiar = guardarTablero` |

**Viaje de ida y vuelta (serialización):**

```
Tablero ──toJSON()──► { version, limiteEnCurso, columnas:{…[aDatos(tarea)]} } ──JSON.stringify──► localStorage
Tablero ◄─desdeJSON── objeto plano (cada tarea con desdeDatos) ◄──JSON.parse── localStorage
```

> Sin `toJSON`, `JSON.stringify(tablero)` da `"{}"` porque los campos `#privados` no se ven.
> C3: `Tarea` y `TareaRecurrente` necesitarán un parámetro extra `id` para recuperar el mismo id.

---

## 7. Flujo completo de ejecución

```
navegador carga index.html
  └── main.js
        └── iniciar(raiz)                         (arranque.js)
              ├── #estado = «Cargando tareas…»
              ├── arrancar()                       ⏳ ahora lanza "Sin hacer"
              │     ├── ¿hay algo en localStorage? → Tablero.desdeJSON → origen "guardado"
              │     ├── si no → obtenerJSON("/tareas-iniciales.json") → Tablero.desde → "inicial"
              │     └── si falla → tablero vacío → "vacio" + error
              ├── guardarTablero(...)
              └── iniciarApp(raiz, tablero, { alCambiar: guardarTablero })

        ⚠️ MIENTRAS el bloque C no esté hecho:
        .catch(error "Sin hacer") → oculta #estado → iniciarApp(raiz, Tablero.desde(EJEMPLO, 3))
                                    (no recuerda nada al recargar)

usuario pulsa «Empezar →»
  └── listener delegado en #columnas
        └── tablero.mover(id, "En curso")
              ├── OK  → avisar("") · pintar() · alCambiar(tablero) → localStorage
              └── ColumnaLlenaError → avisar("«En curso» está llena (máximo 3)")

usuario envía el formulario
  └── leerFormulario → validar → mostrarErrores
        └── sin errores → tablero.crearTarea → pintar · alCambiar · form.reset()
```

---

## 8. Conceptos de clase que aparecen (chuleta)

| Concepto | Dónde verlo |
|---|---|
| `static` | `Tarea.PRIORIDADES`, `Tarea.#siguienteId`, `Tablero.COLUMNAS`, `Tablero.desde` |
| Campos `#privados` | `Tarea.#titulo`, `Columna.#tareas`, `Tablero.#columnas`, `Tablero.#trasladar` |
| `get` / `set` con validación | `Tarea.titulo`, `Tarea.prioridad`, `Columna.llena` |
| Herencia `extends` + `super` | `TareaRecurrente`, jerarquía de errores |
| Polimorfismo | `alCompletar()` → `Tablero.completar` no pregunta el tipo |
| Composición | `Tablero` tiene `Columna`s, que tienen `Tarea`s |
| Copias defensivas | `get tareas`, `ordenadas()`, `siguiente()` copia la fecha |
| Errores propios + `instanceof` | `errores.js` + `catch` en `app.js` |
| Delegación de eventos | `delegar` + `closest` |
| Seguridad XSS | `textContent` en vez de `innerHTML` |
| Inyección de dependencias (para tests) | `storage`, `fetchFn`, `hoy` como parámetros |
| async/await + fetch | `red.js`, `persistencia.js`, `arranque.js` |

---

## 9. Cosas que he visto al leer el código (para revisar)

1. **`TareaRecurrente.js:11`** — `super(titulo, prioridad, limite, cadaDias)` pasa `cadaDias` como 4.º argumento. Ahora no hace nada, pero en **C3** el 4.º parámetro de `Tarea` será el **`id`** → las recurrentes recibirían `id = cadaDias`. Déjalo en `super(titulo, prioridad, limite)` (y en C3, `super(titulo, prioridad, limite, id)`).
2. **`Tablero.js:166-172`** — la línea `(void Columna, …)` ya se puede borrar (ya usas todo menos `aDatos/desdeDatos`, que usarás en C4).
3. **`formulario.js:28`** — el comentario dice «pone el input como **valido**»; es **inválido** (`aria-invalid="true"`).
4. **`Tablero.js:19`** — pasa `undefined` como límite a las otras columnas; funciona porque el parámetro por defecto de `Columna` lo convierte en `null`, pero `null` sería más explícito.
5. **Pendiente:** B4–B6 (`app.js`), y todo el bloque C (C1–C6). Con fecha de entrega del bloque B el **20/11**.
