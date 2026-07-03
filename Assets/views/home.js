export function views_homne() {
    return  `    
    
    <header>
        <div class="logo">
            <h1>Gestor</h1><strong>Store</strong>
        </div>
        <nav>
            <ul>
                <li>
                    <a href="/">
                        <i class="bi bi-house-door-fill"></i>
                        Home
                    </a>
                </li>
                <li>
                    <a href="/login">
                        <i class="bi bi-person-circle"></i>
                        Login  
                    </a>
                </li>
                <li>
                    <a href="/gestor">
                        <i class="bi bi-shop"></i>
                        Gestor de tienda
                    </a>
                </li>
                <li>
                    <a href="/soporte">
                        <i class="bi bi-headset"></i>
                        Soporte
                    </a>
                </li>
            </ul>
        </nav>
    </header>
    <section class="section_info">
        <figure>
            <img src="/Assets/picture/1.png" alt="Logo de Gestor Store" class="photo">
        </figure>

        <div class="info">
            <h1>Gestor <strong>Store</strong></h1>

            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Et, praesentium possimus, ullam excepturi, non sunt odit
                nemo asperiores minima iusto labore.
            </p>
        </div>
    </section>
    <section class="informations">
        <div class="carts">
            <figure class="info_photo">
                <img src="/Assets/picture/cajero.png" alt="" class="photo_info">
            </figure>
        </div>
        <div class="carts">
            <figure class="info_photo" >
                <img src="/Assets/picture/cajero2.png" alt="" class="photo_info">
            </figure>
        </div>
        <div class="carts">
            <figure class="info_photo">
                <img src="/Assets/picture/inventario.png" alt="" class="photo_info">
            </figure>
        </div>
    </section>`
}