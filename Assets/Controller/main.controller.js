// imnportaciones de los controlladores
import { login } from "../Controller/login.controller"
import { register } from "../Controller/register.controller"
import { dash } from "../Controller/dashboard.controller"

const page_controller = {
    login,
    register,
    dash
}

export {page_controller}