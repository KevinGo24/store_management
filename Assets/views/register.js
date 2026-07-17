export function view_register() {
    return `
    <div class="register-container">
    
        <form id="registerForm" novalidate>
                <h2 class="register-header h2">Crear cuenta</h2>
                <p class="parrafo">Completar los datos para registrarse</p>
                        <section class="capa_2">

                                <label for="name">
                                    <i class="bi bi-person-fill"></i>
                                <span>Nombre</span>
                                </label>
                                <input type="text" id="name" class="tbx">
                                <label for="lastname">
                                    <i class="bi bi-person-vcard-fill"></i>
                                    <span>Apellido</span>
                                </label>
                                <input type="text" id="lastname" class="tbx">

                                <label for="email">
                                    <i class="bi bi-envelope-fill"></i>
                                    <span>Correo electrónico</span>
                                </label>
                                <input type="email" id="email" class="tbx">


                                <label for="phone">
                                    <i class="bi bi-telephone-fill"></i>
                                    <span>Número de teléfono</span>
                                </label>
                                <input type="tel" id="phone" class="tbx">


                                <label for="password">
                                    <i class="bi bi-lock-fill"></i>
                                    <span>Contraseña</span>
                                </label>
                                <input type="password" id="password" class="tbx">


                                <label for="confirmPassword">
                                    <i class="bi bi-shield-lock-fill"></i>
                                    <span>Confirmar contraseña</span>
                                </label>
                                <input type="password" id="confirmPassword" class="tbx">
                        </section>
                        <button type="submit" class="btn-submit">
                            <i class="bi bi-person-plus-fill"></i>
                            Registrarse
                        </button>
            </form>         
            <div id="errorMessage" class="error-message" style="display: none; color: #ef4444; margin-bottom: 15px; font-size: 14px; text-align: center;"></div>


                <div class="register-footer">               
                    ¿Ya tienes una cuenta?
                    <a href="/login">
                        <i class="bi bi-box-arrow-in-right"></i>
                        Inicia sesión
                    </a>
                </div>

    </div>
    `;
}
