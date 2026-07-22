/**
 * Login Controller 
 */

/**
 * Muestra u oculta un mensaje de error directamente en el formulario.
 * @param {string|null} mensaje - Texto del error. null = ocultar.
 */
function mostrarError(mensaje) {
    let errorEl = document.getElementById("login-error");

    // Crear el elemento de error si no existe en el DOM
    if (!errorEl) {
        errorEl = document.createElement("p");
        errorEl.id = "login-error";
        errorEl.style.cssText = `
            color: #ff6b6b;
            font-size: 0.9rem;
            text-align: center;
            margin-top: 8px;
            min-height: 1.2em;
            transition: opacity 0.3s;
        `;
        const btn = document.querySelector(".capa_1 .btn");
        if (btn) btn.parentNode.insertBefore(errorEl, btn.nextSibling);
    }

    if (mensaje) {
        errorEl.textContent = mensaje;
        errorEl.style.opacity = "1";
    } else {
        errorEl.textContent = "";
        errorEl.style.opacity = "0";
    }
}

/**
 * Establece el estado de carga del botón de submit.
 * @param {HTMLButtonElement} btn - El botón de envío.
 * @param {boolean} cargando
 */
function setBtnCargando(btn, cargando) {
    btn.disabled = cargando;
    btn.innerHTML = cargando
        ? `<i class="bi bi-hourglass-split"></i> Verificando...`
        : `<i class="bi bi-box-arrow-in-right"></i> Iniciar sesión`;
}

/**
 * Controller principal del formulario de login.
 * Se ejecuta al renderizar la vista /login.
 */
export default function controller_login() {
    const formulario = document.getElementById("form_log");

    if (!formulario) {
        console.warn("[LoginController] No se encontró el formulario #form_log.");
        return;
    }

    const btnSubmit = formulario.querySelector("button[type='submit']");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        // ── Leer y validar inputs básicos ──────────────────────────────────
        const correo = document.getElementById("correo")?.value.trim() ?? "";
        const contrasena = document.getElementById("pass")?.value ?? "";

        if (!correo || !contrasena) {
            mostrarError("Por favor completa correo y contraseña.");
            return;
        }

        // ── Limpiar error anterior y mostrar carga ─────────────────────────
        mostrarError(null);
        if (btnSubmit) setBtnCargando(btnSubmit, true);

        try {
            // ── Petición al backend ────────────────────────────────────────
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contrasena }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Error controlado del servidor (401, 400, etc.)
                mostrarError(data.mensaje || "Correo o contraseña incorrectos.");
                return;
            }

            // ── Login exitoso ──────────────────────────────────────────────
            // Guardar sesión en localStorage para el sistema de permisos
            const sesion = {
                id_cliente: data.cliente.id_cliente,
                nombre: data.cliente.nombre_completo,
                correo: data.cliente.correo,
                rol: data.cliente.rol ?? "cliente",
            };
            localStorage.setItem("usuarioActual", JSON.stringify(sesion));

            // Redirigir al dashboard dentro del SPA
            window.history.pushState({}, "", "/gestor");
            window.dispatchEvent(new PopStateEvent("popstate"));

        } catch (error) {
            // ── Error de red o servidor caído ──────────────────────────────
            console.error("[LoginController] Error de conexión:", error);
            mostrarError("No se pudo conectar con el servidor. Intenta de nuevo.");
        } finally {
            if (btnSubmit) setBtnCargando(btnSubmit, false);
        }
    });
}