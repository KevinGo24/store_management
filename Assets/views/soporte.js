export function views_soporte() {
    return`
   <div class="soporte-container">

    <div class="logo-placeholder">
      <img src="/Assets/picture/logo (1).png" alt="Logo Gestor Store" class="logo_2">
    </div>

    <h1 class="titulo-principal">Nuestros Servicios</h1>
  

  <!-- Sección de Tarjetas de Servicios -->
  <section class="servicios-grid">
    <div class="tarjeta-servicio">
      <div class="icono-servicio">🎧</div>
      <h3>Atención 24/7</h3>
      <p></p>
    </div>

    <div class="tarjeta-servicio">
      <div class="icono-servicio">🗄️</div>
      <h3>Gestión de Base de Datos</h3>
      <p></p>
    </div>

    <div class="tarjeta-servicio">
      <div class="icono-servicio">🖥️</div>
      <h3>Estabilidad del Sistema</h3>
      <p></p>
    </div>
  </section>

  <!-- Sección de Maneras de Contactar -->
  <section class="contacto-section">
    <h2 class="titulo-secundario">Manera de contactarnos</h2>
    
    <div class="contacto-grid">
      <!-- Tarjeta Analista -->
      <div class="tarjeta-contacto">
        <h3>Atención Analista</h3>
        <div class="info-item">
          <span class="icono-contacto">📞</span>
          <div>
            <span class="etiqueta">Teléfono</span>
            <span class="valor font-destacada">3009876543</span>
          </div>
        </div>
        <div class="info-item">
          <span class="icono-contacto">✉️</span>
          <div>
            <span class="etiqueta">Correo electrónico</span>
            <span class="valor">analista@gmail.com</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta Usuario -->
      <div class="tarjeta-contacto">
        <h3>Atención Usuario</h3>
        <div class="info-item">
          <span class="icono-contacto">📞</span>
          <div>
            <span class="etiqueta">Teléfono</span>
            <span class="valor font-destacada">3001234562</span>
          </div>
        </div>
        <div class="info-item">
          <span class="icono-contacto">✉️</span>
          <div>
            <span class="etiqueta">Correo electrónico</span>
            <span class="valor">tecnico@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <form class="form" action="">
            <label class="label_correo">
                  Correo electronico
            </label>
            <input type="email" name="" id="" class="label_input">
            <label class="label_correo">
                  Motivo de daño o reclamo
            </label>
            <textarea name="" id="" class="texto"></textarea>
            <button class="buttom_form">Enviar formulario</button>
      </form>
</div>   
    `
}