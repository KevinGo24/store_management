import { page_controller } from "../Controller/main.controller";
// importacion  de la vista de login y su controlador
import { view_login } from "../views/login";
// contralador
import controller_lgoin from "../Controller/login.controller";
// importacion de Home
import { views_homne } from "../views/home";
const routes = {
    "/": {
        views: views_homne
    },
    "/login": {
        views: view_login,
        controller: controller_lgoin
    }
}
export default function router() {
    const master = document.getElementById("views");

    const path = window.location.pathname;

    const route = routes[path] || routes["/"];

    master.innerHTML = route.views();

    if (route.controller) {
        route.controller();
    }
}