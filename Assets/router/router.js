import { views_catalogo } from "/Assets/views/catalogo";
import { dashboardController } from "/Assets/Controller/dashboard.controller";
import { views_dashboard } from "/Assets/views/dashboard";
import { page_controller } from "/Assets/Controller/main.controller";
import { view_register } from "/Assets/views/register";
import { registerController } from "/Assets/Controller/register.controller";
import { view_login } from "/Assets/views/login";
import controller_lgoin from "/Assets/Controller/login.controller";
import { views_homne } from "/Assets/views/home";
import { controller_home } from "/Assets/Controller/home.controller";
import { views_soporte } from "/Assets/views/soporte";
import { views_movimientos } from "/Assets/views/movimiento";
import { views_agregar_producto } from "/Assets/views/agregar_producto";
import { initAgregarProducto } from "/Assets/Controller/producto.controller.js";
import { initCatalogo } from "/Assets/Controller/catalogo.controller.js";

// 1. IMPORTA AQUÍ EL CONTROLADOR DE MOVIMIENTOS
import { initMovimientos } from "/Assets/Controller/movimiento.controller.js";

const routes = {
    "/": {
        views: views_homne,
        controller: controller_home
    },
    "/login": {
        views: view_login,
        controller: controller_lgoin
    },
    "/register": {
        views: view_register,
        controller: registerController
    },
    "/soporte": {
        views: views_soporte
    },
    "/gestor": {
        views: views_dashboard,
        controller: dashboardController
    },
    "#/gestor": {
        views: views_dashboard,
        controller: dashboardController
    },
    "#/catalogo": {
        views: views_catalogo,
        controller: initCatalogo 
    },
    "#/movimientos": {
        views: views_movimientos,
        controller: initMovimientos 
    },
    "#/agregar": {
        views: views_agregar_producto,
        controller: initAgregarProducto 
    }
}

export default function router() {
    const master = document.getElementById("views");
    const path = window.location.hash || window.location.pathname;
    const route = routes[path] || routes["/"];
    master.innerHTML = route.views();
    if (route.controller) {
        route.controller();
    }
}