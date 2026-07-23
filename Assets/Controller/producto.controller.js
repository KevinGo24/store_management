// Assets/Controller/producto.controller.js

export async function initAgregarProducto() {
    // 1. Cargar las categorías dinámicamente en el select
    try {
        const response = await fetch("http://localhost:3000/api/categorias");
        const resultado = await response.json();
        
        const selectCategoria = document.getElementById("categoria");
        if (selectCategoria) {
            selectCategoria.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
            const categorias = resultado.data || resultado;
            
            categorias.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id_categoria;
                option.textContent = cat.nombre;
                selectCategoria.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }

    // 2. Manejar el evento submit del formulario para guardar el producto
    const form = document.getElementById('formAgregarProducto');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const codigo = document.getElementById('sku').value.trim();
            const id_categoria = document.getElementById('categoria').value;
            const marca = document.getElementById('marca').value.trim();
            const stock_actual = document.getElementById('cantidad').value;
            const precio_venta = document.getElementById('precio').value;
            const descripcion = document.getElementById('descripcion').value.trim();

            try {
                const res = await fetch("http://localhost:3000/api/productos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_categoria: Number(id_categoria),
                        codigo,
                        nombre,
                        marca: marca || null,
                        precio_venta: Number(precio_venta),
                        stock_actual: Number(stock_actual),
                        descripcion
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.mensaje || "Error al registrar el producto");
                    return;
                }

                alert("¡Producto guardado con éxito!");
                form.reset();
                window.location.hash = '/gestor'; 

            } catch (err) {
                console.error("Error de conexión:", err);
                alert("No se pudo conectar con el servidor.");
            }
        });
    }

    // 3. Manejar el botón Cancelar (Limpia los campos del formulario)
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            if (form) {
                form.reset();
            }
        });
    }
}