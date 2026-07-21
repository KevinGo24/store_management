// ----> importsaciones para todo los estilos
import "./Assets/Css/style.css";
// ----> importacion del router
import router from "./Assets/router/router";
// ----> imnportar boostrap icons
import "bootstrap-icons/font/bootstrap-icons.css";

// Carga inicial
document.addEventListener("DOMContentLoaded", router);

// Navegación con hash (#/catalogo, #/movimientos, etc.)
window.addEventListener("hashchange", router);

// Navegación programática con pushState (ej. redirección post-login al dashboard)
window.addEventListener("popstate", router);
