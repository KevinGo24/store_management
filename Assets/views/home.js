export function views_homne() {
  return `    
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
                Gestor Store es tu panel de control inteligente para administrar inventarios con rapidez y precisión.
                Desde una sola plataforma puedes crear productos, revisar existencias en tiempo real y registrar entradas
                y salidas sin complicaciones. Con nuestro sistema mantienes tus datos siempre actualizados, ves el estado
                del stock al instante y tomas decisiones más certeras para tu negocio.
                <br><br>
                Diseñada para ser intuitiva, segura y eficiente, Gestor Store te ayuda a ahorrar tiempo, reducir pérdidas
                y mejorar tu gestión comercial con un flujo de trabajo claro y profesional.
                </p>
            </div>
        </section>
        <section class="informations">
            <div class="carts">
                <figure class="info_photo">
                    <img src="/Assets/picture/2.jpg" alt="" class="photo_info">
                </figure>
                <p class="card-text">Organiza tu inventario de forma sencilla y visual. Controla el stock con precisión y evita quiebres.</p>
            </div>
            <div class="carts">
                <figure class="info_photo" >
                    <img src="/Assets/picture/3.jpg" alt="" class="photo_info">
                </figure>
                <p class="card-text">Consulta datos en tiempo real y toma decisiones rápidas con información clara y confiable.</p>
            </div>
            <div class="carts">
                <figure class="info_photo">
                    <img src="/Assets/picture/4.jpg" alt="" class="photo_info">
                </figure>
                <p class="card-text">Aumenta la eficiencia de tu negocio con un sistema diseñado para crecer contigo.</p>
            </div>
        </section>
        <footer class="footer">
            <div class="footer-content">

                <div class="footer-logo">
                    <h3>Gestor Store</h3>
                    <p>Optimiza tu gestión de inventario y mantén tu negocio controlado desde una sola plataforma.</p>
                </div>

                <div class="footer-links">
                    <h4>Enlaces rápidos</h4>
                    <a href="/"><i class="bi bi-house-door-fill"></i> Inicio</a>
                    <a href="/login"><i class="bi bi-person-circle"></i> Login</a>
                    <a href="/soporte"><i class="bi bi-headset"></i> Soporte</a>
                </div>

                <div class="footer-social">
                    <h4>Síguenos</h4>
                    <div class="footer-social-links">
                        <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
                        <a href="#" aria-label="GitHub"><i class="bi bi-github"></i></a>
                    </div>
                </div>

            </div>

            <div class="footer-copy">
                © 2025 Gestor Store | Todos los derechos reservados.
            </div>
        </footer>
    </div>
    
    `;
}
