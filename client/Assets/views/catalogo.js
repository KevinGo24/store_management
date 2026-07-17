export function views_catalogo() {
  return `

        <header>      
            <h1>Nuestro Catálogo</h1>
            <p>Encuentra los mejores productos a los mejores precios  <button class="tbx but">Volver <i class="bi bi-reply"></i></button></p>
            
        </header>


        <main class="catalog-container">
            <!-- Tarjeta de Producto 1 -->
            <article class="product-card">
                <div class="product-image">
                    <img src="https://i.blogs.es/3d1180/blackshark1/1366_2000.jpeg" alt="Producto 1">
                </div>
                <div class="product-info">
                    <span class="product-category">Electrónica</span>
                    <h2 class="product-title">Auriculares Inalámbricos</h2>
                    <p class="product-description">Cancelación de ruido activa y batería de hasta 30 horas de duración.</p>
                    <div class="product-footer">
                        <span class="product-price">$79.99</span>
                        <button class="btn-add">Añadir</button>
                    </div>
                </div>
            </article>

            <!-- Tarjeta de Producto 2 -->
            <article class="product-card">
                <div class="product-image">
                    <img src="https://i5.walmartimages.cl/asr/7c5c0a19-0cab-4943-83de-f6450a8256ad.288539c61d3ce8077fc20184a7835f63.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff" alt="Producto 2">
                </div>
                <div class="product-info">
                    <span class="product-category">Moda</span>
                    <h2 class="product-title">Mochila Urbana Impermeable</h2>
                    <p class="product-description">Diseño ergonómico con compartimento seguro para laptop de 15 pulgadas.</p>
                    <div class="product-footer">
                        <span class="product-price">$45.00</span>
                        <button class="btn-add">Añadir</button>
                    </div>
                </div>
            </article>

            <!-- Tarjeta de Producto 3 -->
            <article class="product-card">
                <div class="product-image">
                    <img src="https://www.tiendaecosapiens.com/cdn/shop/files/Termo_de_Acero_Inoxidable_500_ml_Botella_T_rmica_Reutilizable_BPA_Free_Ecosapiens_1000x.jpg?v=1778606183" alt="Producto 3">
                </div>
                <div class="product-info">
                    <span class="product-category">Hogar</span>
                    <h2 class="product-title">Termo de Acero Inoxidable</h2>
                    <p class="product-description">Mantiene tus bebidas frías o calientes durante más de 12 horas continuas.</p>
                    <div class="product-footer">
                        <span class="product-price">$24.99</span>
                        <button class="btn-add">Añadir</button>
                    </div>
                </div>
            </article>
        </main>
    `
}
