export function views_catalogo() {
  return `
        <header>      
            <h1>Nuestro Catálogo</h1>
            <p>Encuentra los mejores productos a los mejores precios  <button class="tbx but" onclick="window.location.hash = '/gestor'">Volver <i class="bi bi-reply"></i></button></p>
        </header>

        <main class="catalog-container" id="lista-productos">
            <!-- Los productos de la base de datos se cargarán aquí dinámicamente -->
            <p style="color: white; text-align: center; width: 100%;">Cargando productos...</p>
        </main>
    `;
}