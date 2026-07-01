export function view_login() {
    return `    

    <form id="form_log">
        <section class="capa_1">
            <h2>Inicio de Sesion</h2>
            <section class="capa_2">
                <h1>Gestor Store</h1>
                <label class="campo">
                    <i class="bi bi-person"></i>
                    <span>Rol</span>
                </label>
                <select id="roles" class="selection_rol">
                    <option value="1">Admin</option>
                    <option value="2">Usuario</option>
                </select>
                <label class="campo">
                    <i class="bi bi-envelope-at-fill"></i>
                    <span>Correo electrónico</span>
                </label>
                <input type="email" name="" id="correo" class="tbx">
                <label class="campo">
                    <i class="bi bi-lock-fill"></i>
                    <span>Contraseña</span>
                </label>
                <input type="password" name="" id="pass" class="tbx">
            </section>
            <button class="btn" type="submit">
                <i class="bi bi-box-arrow-in-right"></i>
                Iniciar sesión
            </button>

            <a href="#register" class="register">
                <i class="bi bi-person-plus-fill"></i>
                Registrarte
            </a>
        </section>
    </form>
    `

}