export function view_register() {
    return `
    <div class="register-container">
    
    
    <form id="registerForm" novalidate>
    <h2 class="register-header h2">Crear cuenta</h2>
    <p class="parrafo">Completar los datos para registrarse</p>

            <!-- Eliminamos .form-row si no lo usas, o asegúrate de que envuelva bien los grupos -->
            <div class="form-grid"> 
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input type="text" id="name"> <!-- Corregido: cerrado con > -->
                </div>

                <div class="form-group">
                    <label for="lastname">Apellido</label>
                    <input type="text" id="lastname"> <!-- Corregido: cerrado con > -->
                </div>

                <div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <input type="email" id="email"> <!-- Corregido: cerrado con > -->
                </div>

                <div class="form-group">
                    <label for="phone">Número de teléfono</label>
                    <input type="tel" id="phone"> <!-- Corregido: cerrado con > -->
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password"> <!-- Corregido: cerrado con > -->
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirmar contraseña</label>
                    <input type="password" id="confirmPassword"> <!-- Corregido: cerrado con > -->
                </div>
            </div>

            <div id="errorMessage" class="error-message" style="display: none; color: #ef4444; margin-bottom: 15px; font-size: 14px; text-align: center;"></div>

            <button type="submit" class="btn-submit">Registrarse</button>
        </form>

        <div class="register-footer">¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></div>
    </div>
    `;
}
