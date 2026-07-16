export default async function loginUsuario(correo, contrasena) {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contrasena }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login exitoso:", data);
            alert("¡Bienvenido!");
            // Aquí puedes redirigir al usuario, por ejemplo:
            // window.location.href = '/dashboard.html';
        } else {
            alert(data.mensaje || "Error al iniciar sesión");
        }
    } catch (error) {
        console.error("Error conectando con el servidor:", error);
        alert("Servidor no disponible");
    }
};