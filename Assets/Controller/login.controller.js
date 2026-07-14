import {usuarios} from "../data/user"

export default function controller_login(){
    const formula = document.getElementById("form_log");
    formula.addEventListener("submit",(e) =>{
        e.preventDefault();
        const correo = document.getElementById("correo").value.trim();
        const pass = document.getElementById("pass").value;
        const usuarioEncontrado = usuarios.find(
            (u) => u.correo === correo && u.pass === pass
        );
        if (!usuarioEncontrado){
            alert("correo o contraseña incorrecta")
            return;
        }
        
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));

        if (usuarioEncontrado.rol === "admin"){
            alert(`Bienvenido, ${usuarioEncontrado.nombre}(Administrador)`);
            window.location.href = "/admin";
        } else{
            alert(`Bienvenido, ${usuarioEncontrado.nombre}`);
            window.location.href = "/cliente"; 
        }
    });
}