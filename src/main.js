import "./style.css";
import { iniciarMenu } from "./ui/menu.js";

document.querySelector("#app").innerHTML = `
  <h1>RetroStock</h1>
  <p>Abre la consola (F12) y pulsa el botón.</p>
  <button id="iniciar" type="button">Abrir menú</button>
`;

document.querySelector("#iniciar").addEventListener("click", iniciarMenu);
// Al pulsar el botón arranca el menú