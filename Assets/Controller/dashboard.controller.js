export function dashboardController() {
    document.addEventListener('DOMContentLoaded', async () => {
        // 1. Captura de elementos del DOM (Mapeados con los IDs y clases de tu HTML)
        const totalProductsEl = document.getElementById('totalProducts');
        const inventoryValueEl = document.getElementById('inventoryValue');
        const lowStockEl = document.getElementById('lowStock');
        const movementsTodayEl = document.getElementById('movementsToday');

        const tableAlertsBody = document.getElementById('tableAlertsBody');
        const reportsListContainer = document.getElementById('reportsListContainer');

        try {
            // 2. Petición HTTP asíncrona para obtener las métricas del backend
            const response = await fetch('/api/dashboard/metrics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Descomenta si usas autenticación
                }
            });

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                const { kpis, tablas } = result;

                // 3. Formateadores locales para limpiar la presentación de datos
                const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
                const formatNumber = new Intl.NumberFormat('en-US');

                // 4. Inyección de datos en las Tarjetas de Control (KPIs)
                if (totalProductsEl) {
                    totalProductsEl.innerHTML = `${formatNumber.format(kpis.totalProductos)} <span class="up">↑</span>`;
                }
                if (inventoryValueEl) {
                    inventoryValueEl.textContent = formatCurrency.format(kpis.valorInventario);
                }
                if (lowStockEl) {
                    lowStockEl.textContent = kpis.existenciasBajas;
                }
                if (movementsTodayEl) {
                    movementsTodayEl.textContent = `${kpis.movementsDia.entradas} Entradas / ${kpis.movementsDia.salidas} Salidas`;
                }

                // 5. Renderizado de la Tabla de Alertas de Reabastecimiento
                if (tableAlertsBody) {
                    tableAlertsBody.innerHTML = ''; // Limpiar filas estáticas placeholders

                    tablas.alertasReabastecimiento.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.nombre}</td>
                            <td>${item.sku}</td>
                            <td>${formatNumber.format(item.corriente)}</td>
                            <td class="status-urgent">${item.estatus}</td>
                        `;
                        tableAlertsBody.appendChild(row);
                    });
                }

                // 6. Renderizado de la lista de Últimos Reportes / Movimientos
                if (reportsListContainer) {
                    // Mantiene el título original y limpia el resto de nodos hijos redundantes
                    const title = reportsListContainer.querySelector('h3');
                    reportsListContainer.innerHTML = '';
                    if (title) reportsListContainer.appendChild(title);

                    tablas.ultimosMovimientos.forEach(mov => {
                        const reportDiv = document.createElement('div');
                        reportDiv.className = 'report-item';
                        reportDiv.innerHTML = `<strong>${mov.tipo}:</strong> ${mov.producto} (${mov.cantidad} uds) - por ${mov.usuario}`;
                        reportsListContainer.appendChild(reportDiv);
                    });
                }
            }

        } catch (error) {
            console.error('Error al inicializar el dashboard:', error);

        }
    });
}
