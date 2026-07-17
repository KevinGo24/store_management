export function view_register() {
    return `
    <div class="register-container">
    
        <form id="registerForm" novalidate>
        <section>
            <h2 class="register-header h2">Crear cuenta</h2>
            <p class="parrafo">Completar los datos para registrarse</p>

            <section>
                <div class="form-grid">

                    <div class="form-group">
                        <label for="name">
                            <i class="bi bi-person-fill"></i>
                            Nombre
                        </label>
                        <input type="text" id="name">
                        <span class="field-error" id ="error-name"></span>
                    </div>

                    <div class="form-group">
                        <label for="lastname">
                            <i class="bi bi-person-vcard-fill"></i>
                            Apellido
                        </label>
                        <input type="text" id="lastname">
                        <span class="field-error" id ="error-lastname"></span>
                    </div>

                    <div class="form-group">
                        <label for="email">
                            <i class="bi bi-envelope-fill"></i>
                            Correo electrónico
                        </label>
                        <input type="email" id="email">
                        <span class="field-error" id ="error-email"></span>
                    </div>

                    <div class="form-group">
                        <label for="phone">
                            <i class="bi bi-telephone-fill"></i>
                            Número de teléfono
                        </label>
                        <input type="tel" id="phone">
                        <span class="field-error" id ="error-phone"></span>
                    </div>

                    <div class="form-group">
                        <label for="password">
                            <i class="bi bi-lock-fill"></i>
                            Contraseña
                        </label>
                        <input type="password" id="password">
                        <span class="field-error" id ="error-password"></span>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">
                            <i class="bi bi-shield-lock-fill"></i>
                            Confirmar contraseña
                        </label>
                        <input type="password" id="confirmPassword">
                        <span class="field-error" id ="error-confirmPassword"></span>
                    </div>
                </div>
            </section>
        </section>            
            <div id="errorMessage" class="error-message" style="display: none; color: #ef4444; margin-bottom: 15px; font-size: 14px; text-align: center;"></div>

                <button type="submit" class="btn-submit">
                    <i class="bi bi-person-plus-fill"></i>
                    Registrarse
                </button>

                <div class="register-footer">
                    <i class="bi bi-person-check-fill"></i>
                    ¿Ya tienes una cuenta?
                    <a href="/login">
                        <i class="bi bi-box-arrow-in-right"></i>
                        Inicia sesión
                    </a>
                </div>

    </div>
    `;
}
