export function registerController() {
  const form = document.getElementById('registerForm');
<<<<<<< HEAD
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
=======
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
>>>>>>> backend
    const name = document.getElementById('name').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value; 
<<<<<<< HEAD
  })
}
=======

    // 1. Validación de campos vacíos en el Frontend 
    if (!name || !lastname || !email || !password || !confirmPassword) {
      alert("Por favor, rellene todos los campos obligatorios.");
      return;
    }

    // 2. Validación de contraseñas iguales 
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Petición hacia el backend
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nombre: name, 
          apellido: lastname, 
          correo: email, 
          telefono: phone, 
          contrasena: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.mensaje || "Error al registrarse");
        return;
      }

      alert("¡Registro exitoso!");
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));

    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar con el servidor.");
    }
  });
}
>>>>>>> backend
