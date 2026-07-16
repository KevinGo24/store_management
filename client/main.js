// ---> importsaciones para todo los estilos
import './Assets/Css/style.css'
// ----> importacion del router
import router from './Assets/router/router'
// ---> imnportar boostrap icons
import "bootstrap-icons/font/bootstrap-icons.css";

document.addEventListener("DOMContentLoaded", router);

// Escuchar cambios en la historia del navegador (cuando das atrás o adelante)
window.addEventListener("popstate", router);

// Interceptar clics en enlaces para que no recarguen la página
document.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
        e.preventDefault(); // Evita el recargado
        const path = e.target.getAttribute("href");
        
        // Cambia la URL en la barra de direcciones
        window.history.pushState({}, "", path);
        
        // Llama al router para renderizar la nueva vista
        router();
    }
});