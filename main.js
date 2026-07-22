// ----> importaciones para todos los estilos
import "./Assets/Css/style.css";
// ----> importación del router
import router from "./Assets/router/router";
// ----> importar bootstrap icons
import "bootstrap-icons/font/bootstrap-icons.css";

// Carga inicial
document.addEventListener("DOMContentLoaded", router);

// Navegación con hash (#/catalogo, #/movimientos, etc.)
window.addEventListener("hashchange", router);

// Navegación programática con pushState (ej. redirección post-login al dashboard)
window.addEventListener("popstate", router);