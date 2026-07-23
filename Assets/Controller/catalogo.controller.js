// Assets/Controller/catalogo.controller.js

export async function initCatalogo() {
    const contenedor = document.getElementById("lista-productos");
    if (!contenedor) return;

    try {
        const response = await fetch("http://localhost:3000/api/productos");
        const resultado = await response.json();

        // Verificamos que lleguen productos
        const productos = resultado.data || [];

        if (productos.length === 0) {
            contenedor.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No hay productos registrados en este momento.</p>';
            return;
        }

        // Limpiamos el contenedor
        contenedor.innerHTML = "";

        // Recorremos cada producto de la base de datos y creamos su tarjeta
        productos.forEach(prod => {
            const card = document.createElement("article");
            card.className = "product-card";

            // Si el producto tiene imagen guardada la usa, si no, usa una por defecto
            const imagenUrl = prod.imagen_url || "https://via.placeholder.com/300";

            card.innerHTML = `
                <div class="product-image">
                    <img src="${imagenUrl}" alt="${prod.nombre}">
                </div>
                <div class="product-info">
                    <span class="product-category">${prod.nombre_categoria || 'General'}</span>
                    <h2 class="product-title">${prod.nombre}</h2>
                    <p class="product-description">${prod.descripcion || 'Sin descripción disponible.'}</p>
                    <div class="product-footer">
                        <span class="product-price">$${Number(prod.precio_venta).toFixed(2)}</span>
                        <button class="btn-add" data-id="${prod.id_producto}">Añadir</button>
                    </div>
                </div>
            `;

            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        contenedor.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Error al conectar con el servidor.</p>';
    }
}