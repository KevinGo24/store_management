export function views_homne() {
    return  `    
    <div class="home">
    <header>
        <div class="logo">
            <img src="/Assets/picture/logo (1).png" alt="logo" class="logotipo">
        </div>

        <button class="burger-btn">
            <i class="bi bi-list"></i>
        </button>

        <nav id="menu">
            <ul>
                <li><a href="/"><i class="bi bi-house-door-fill"></i> Home</a></li>
                <li><a href="/login"><i class="bi bi-person-circle"></i> Login</a></li>
                <li><a href="/gestor"><i class="bi bi-shop"></i> Gestor</a></li>
                <li><a href="/soporte"><i class="bi bi-headset"></i> Soporte</a></li>
            </ul>
        </nav>
    </header>
        <section class="section_info">
            <figure>
                <img src="/Assets/picture/logo (1).png" alt="Logo de Gestor Store" class="photo">
            </figure>

            <div class="info">
                <h2>¿Qué es Gestor Store?</h2>
                <p>
                Gestiona tu inventario con inteligencia y lleva el control de tu negocio desde 
                una sola plataforma.
                Con Gestor Store podrás administrar productos, controlar existencias en tiempo real, 
                registrar entradas y salidas, organizar categorías, consultar reportes detallados y 
                mantener toda la información de tu inventario siempre actualizada. 
                Nuestra plataforma está diseñada para ser rápida, intuitiva y segura, 
                ayudándote a optimizar procesos, reducir pérdidas y tomar mejores decisiones 
                para hacer crecer tu empresa con mayor eficiencia y confianza.

                </p>
            </div>
        </section>
        <section class="informations">
            <div class="carts">
                <figure class="info_photo">
                    <img src="/Assets/picture/2.jpg" alt="" class="photo_info">
                </figure>
            </div>
            <div class="carts">
                <figure class="info_photo" >
                    <img src="/Assets/picture/3.jpg" alt="" class="photo_info">
                </figure>
            </div>
            <div class="carts">
                <figure class="info_photo">
                    <img src="/Assets/picture/4.jpg" alt="" class="photo_info">
                </figure>
            </div>
        </section>
        <footer class="footer">
            <div class="footer-content">

                <div class="footer-logo">
                    <h3>Gestor Store</h3>
                    <p>Gestiona tu inventario de forma rápida y segura.</p>
                </div>

                <div class="footer-links">
                    <h4>Enlaces</h4>
                    <a href="/"><i class="bi bi-house-door-fill"></i> Inicio</a>
                    <a href="/login"><i class="bi bi-person-circle"></i> Login</a>
                    <a href="/gestor"><i class="bi bi-shop"></i> Gestor</a>
                    <a href="/soporte"><i class="bi bi-headset"></i> Soporte</a>
                </div>

                <div class="footer-social">
                    <h4>Síguenos</h4>

                    <a href="#">
                        <i class="bi bi-facebook"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-instagram"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-twitter-x"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-linkedin"></i>
                    </a>

                    <a href="#">
                        <i class="bi bi-github"></i>
                    </a>

                </div>

            </div>

            <div class="footer-copy">
                © 2025 Gestor Store | Todos los derechos reservados.
            </div>
        </footer>
    </div>
    
    `
}