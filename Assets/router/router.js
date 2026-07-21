import { views_catalogo } from "../views/catalogo";
// import vista catalogo
import { dashboardController } from "/Assets/Controller/dashboard.controller";
import { views_dashboard } from "/Assets/views/dashboard";
// importacion de dashboard
import { page_controller } from "/Assets/Controller/main.controller";
// importacion de register
import { view_register } from "/Assets/views/register";
import { registerController } from "/Assets/Controller/register.controller";
// importacion de login 
import { view_login } from "/Assets/views/login";
import controller_lgoin from "/Assets/Controller/login.controller";
// importacion de Home
import { views_homne } from "/Assets/views/home";
import { controller_home } from "/Assets/Controller/home.controller";
// importacion de soporte
import { views_soporte } from "/Assets/views/soporte";
// importacion de movimientos
import { views_movimientos } from "/Assets/views/movimiento";
// importacion de agregar prodcuto
import { views_agregar_producto } from "/Assets/views/agregar_producto";
import { views_reportes } from "../views/reportes";

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
    "#/dashboard": {
        views: views_dashboard
    },
    "#/catalogo": {
        views: views_catalogo
    },

    "#/movimientos": {
        views: views_movimientos
    },

    "#/agregar":{
        views: views_agregar_producto
    },

    "#/reportes":{
        views: views_reportes
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

