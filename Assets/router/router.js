import { views_reportes } from "../views/reportes";
// import de vista reportes
import { views_catalogo } from "../views/catalogo";
// import vista catalogo
import { dashboardController } from "../Controller/dashboard.controller";
import { views_dashboard } from "../views/dashboard";
// importacion de dashboard
import { page_controller } from "../Controller/main.controller";
// importacion de register
import { view_register } from "../views/register";
import { registerController } from "../Controller/register.controller";
// importacion de login 
import { view_login } from "../views/login";
import controller_lgoin from "../Controller/login.controller";
// importacion de Home
import { views_homne } from "../views/home";
import { controller_home } from "../Controller/home.controller";
// importacion de soporte
import { views_soporte } from "../views/soporte";
import { views_movimientos } from "../views/movimiento";

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
    "#/reportes": {
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

