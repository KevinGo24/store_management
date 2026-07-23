
// // import vista catalogo
// import { dashboardController } from "/Assets/Controller/dashboard.controller";
// // importacion de dashboard
// import { page_controller } from "/Assets/Controller/main.controller";
// // importacion de register
// import { view_register } from "/Assets/views/register";
// import { registerController } from "/Assets/Controller/register.controller";
// // importacion de login 
// import { view_login } from "/Assets/views/login";
// import controller_lgoin from "/Assets/Controller/login.controller";
// // importacion de Home
// import { views_homne } from "/Assets/views/home";
// import { controller_home } from "/Assets/Controller/home.controller";
// // importacion de soporte
// import { views_soporte } from "/Assets/views/soporte";
// // importacion de movimientos
// import { views_movimientos } from "/Assets/views/movimiento";
// // importacion de agregar prodcuto
// import { views_agregar_producto } from "/Assets/views/agregar_producto";
// // impoortacion de catalogo
// import { views_catalogo } from "/Assets/views/catalogo";
// // importacion de dashboard
// import { views_dashboard } from "/Assets/views/dashboard";
// // importacion de home
// import { views_homne } from "/Assets/views/home";
// import { controller_home } from "/Assets/Controller/home.controller";
// // importacion de soporte
// import { views_soporte } from "/Assets/views/soporte";
// // importacion de movimientos
// import { views_movimientos } from "/Assets/views/movimiento";
// // importacion de agregar prodcuto
// import { views_agregar_producto } from "/Assets/views/agregar_producto";
// // importacion de catalogo
// import { initAgregarProducto } from "/Assets/Controller/producto.controller.js";
// import { initCatalogo } from "/Assets/Controller/catalogo.controller.js";
// // 1. IMPORTA AQUÍ EL CONTROLADOR DE MOVIMIENTOS
// import { initMovimientos } from "/Assets/Controller/movimiento.controller.js";
// vista home y controlador
 import { views_homne } from "../views/home";
import { controller_home } from "../Controller/home.controller";
// vista login y controlador
import { view_login } from "../views/login";
import controller_lgoin from "../Controller/login.controller";
// vista register y controlador
import { view_register } from "../views/register";
import { registerController } from "../Controller/register.controller";
// vista soporte
import { views_soporte } from "../views/soporte";
// vista dashboard y controlador
import { views_dashboard } from "../views/dashboard";
import { dashboardController } from "../Controller/dashboard.controller";
// vista catalogo y controlador
import { views_catalogo } from "../views/catalogo";
import { initCatalogo } from "../Controller/catalogo.controller.js";
// vista movimientos y controlador
import { views_movimientos } from "../views/movimiento";
import { initMovimientos } from "../Controller/movimiento.controller.js";
// vista agregar producto y controlador
import { views_agregar_producto } from "../views/agregar_producto";
import { initAgregarProducto } from "../Controller/producto.controller.js";
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


