function mostrarError(id, mensaje) {
    const span = document.getElementById(`error-${id}`);
    if (span) span.textContent = mensaje;
}

function limpiarErrores() {
    const campos = ["name", "lastname", "email", "phone", "password", "confirmPassword"];
    campos.forEach((c) => mostrarError(c, ""));
    const general = document.getElementById("errorMessage");
    if (general) {
        general.style.display = "none";
        general.textContent = "";
    }
}

export function registerController() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarErrores();

        const name = document.getElementById('name').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        let esValido = true;

        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (!name) { mostrarError("name", "El nombre es obligatorio"); esValido = false; }
        else if (!soloLetras.test(name)) { mostrarError("name", "El nombre solo puede contener letras"); esValido = false; }

        if (!lastname) { mostrarError("lastname", "El apellido es obligatorio"); esValido = false; }
        else if (!soloLetras.test(lastname)) { mostrarError("lastname", "El apellido solo puede contener letras"); esValido = false; }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) { mostrarError("email", "El correo es obligatorio"); esValido = false; }
        else if (!emailRegex.test(email)) { mostrarError("email", "El correo no tiene un formato válido"); esValido = false; }

        const phoneRegex = /^[0-9]{7,10}$/;
        if (!phone) { mostrarError("phone", "El teléfono es obligatorio"); esValido = false; }
        else if (!phoneRegex.test(phone)) { mostrarError("phone", "El teléfono debe tener entre 7 y 10 dígitos"); esValido = false; }

        if (!password) { mostrarError("password", "La contraseña es obligatoria"); esValido = false; }
        else if (password.length < 6) { mostrarError("password", "La contraseña debe tener al menos 6 caracteres"); esValido = false; }

        if (!confirmPassword) { mostrarError("confirmPassword", "Debes confirmar la contraseña"); esValido = false; }
        else if (password !== confirmPassword) { mostrarError("confirmPassword", "Las contraseñas no coinciden"); esValido = false; }

        if (!esValido) return;

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_completo: `${name} ${lastname}`,
                    correo: email,
                    contrasena: password,
                    telefono: phone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.mensaje && data.mensaje.toLowerCase().includes("correo")) {
                    mostrarError("email", data.mensaje);
                } else {
                    const general = document.getElementById("errorMessage");
                    general.style.display = "block";
                    general.textContent = data.mensaje || "Error al registrar el usuario";
                }
                return;
            }

            const general = document.getElementById("errorMessage");
            general.style.color = "#22c55e";
            general.style.display = "block";
            general.textContent = "Cuenta creada correctamente. Redirigiendo...";

            setTimeout(() => { window.location.href = "/login"; }, 1500);

        } catch (error) {
            console.error("Error conectando con el servidor:", error);
            const general = document.getElementById("errorMessage");
            general.style.display = "block";
            general.textContent = "No se pudo conectar con el servidor";
        } finally {
            submitBtn.disabled = false;
        }
    });
}