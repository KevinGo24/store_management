// Assets/Controller/movimiento.controller.js

export async function initMovimientos() {
    const selectProducto = document.getElementById("selectProducto");
    const formMovimiento = document.getElementById("formMovimiento");
    const tablaHistorial = document.getElementById("tablaHistorial");

    // 1. Cargar productos en el select
    try {
        const resProd = await fetch("http://localhost:3000/api/productos");
        const dataProd = await resProd.json();
        const productos = dataProd.data || [];

        if (selectProducto) {
            selectProducto.innerHTML = '<option value="" disabled selected>Selecciona un producto</option>';
            productos.forEach(prod => {
                const option = document.createElement("option");
                option.value = prod.id_producto;
                option.textContent = `${prod.nombre} (SKU: ${prod.codigo})`;
                selectProducto.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }

    // 2. Cargar historial de movimientos desde el backend (URL CORREGIDA)
    async function cargarHistorial() {
        if (!tablaHistorial) return;
        try {
            const res = await fetch("http://localhost:3000/api/inventario/movimientos");
            const data = await res.json();
            const movimientos = data.data || data.movimientos || (Array.isArray(data) ? data : []);

            tablaHistorial.innerHTML = "";
            if (movimientos.length === 0) {
                tablaHistorial.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888; padding: 15px;">No hay movimientos registrados.</td></tr>`;
                return;
            }

            movimientos.forEach(mov => {
                const tr = document.createElement("tr");
                const fecha = mov.fecha_movimiento || mov.fecha_creacion;
                tr.innerHTML = `
                    <td>${fecha ? new Date(fecha).toLocaleString() : 'Reciente'}</td>
                    <td>${mov.nombre_producto || mov.producto || 'Producto'}</td>
                    <td><span class="badge ${String(mov.tipo_movimiento || mov.tipo).toUpperCase() === 'ENTRADA' ? 'bg-success' : 'bg-danger'}">${mov.tipo_movimiento || mov.tipo}</span></td>
                    <td>${mov.cantidad}</td>
                `;
                tablaHistorial.appendChild(tr);
            });
        } catch (err) {
            console.error("Error al cargar el historial:", err);
        }
    }

    // Ejecutar al cargar la vista
    cargarHistorial();

    // 3. Registrar nuevo movimiento
    if (formMovimiento) {
        formMovimiento.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id_producto = selectProducto.value;
            const tipo_movimiento = document.getElementById("tipoMovimiento").value; 
            const cantidad = document.getElementById("cantidadMovimiento").value;

            try {
                const res = await fetch("http://localhost:3000/api/inventario/movimientos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_producto: Number(id_producto),
                        tipo_movimiento,
                        cantidad: Number(cantidad)
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.mensaje || "Error al registrar el movimiento");
                    return;
                }

                alert("¡Movimiento registrado con éxito!");
                formMovimiento.reset();
                cargarHistorial(); // Refresca la tabla automáticamente al guardar

            } catch (error) {
                console.error("Error de conexión:", error);
                alert("No se pudo conectar con el servidor.");
            }
        });
    }
}