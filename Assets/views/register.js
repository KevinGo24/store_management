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
                    </div>

                    <div class="form-group">
                        <label for="lastname">
                            <i class="bi bi-person-vcard-fill"></i>
                            Apellido
                        </label>
                        <input type="text" id="lastname">
                    </div>

                    <div class="form-group">
                        <label for="email">
                            <i class="bi bi-envelope-fill"></i>
                            Correo electrónico
                        </label>
                        <input type="email" id="email">
                    </div>

                    <div class="form-group">
                        <label for="phone">
                            <i class="bi bi-telephone-fill"></i>
                            Número de teléfono
                        </label>
                        <input type="tel" id="phone">
                    </div>

                    <div class="form-group">
                        <label for="password">
                            <i class="bi bi-lock-fill"></i>
                            Contraseña
                        </label>
                        <input type="password" id="password">
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">
                            <i class="bi bi-shield-lock-fill"></i>
                            Confirmar contraseña
                        </label>
                        <input type="password" id="confirmPassword">
                    </div>
                </div>
            </section>
        </section>            
            <div id="errorMessage" class="error-message" style="display: none; color: #ef4444; margin-bottom: 15px; font-size: 14px; text-align: center;"></div>

                <button type="submit" class="btn-submit">
                    <i class="bi bi-person-plus-fill"></i>
                    Registrarse
                </button>
            
            <div id="errorMessage" class="error-message" style="display: none; color: #ef4444; margin-bottom: 15px; font-size: 14px; text-align: center;"></div>


    </div>
    `;
}
