export function views_dashboard() {
  return `  
       <div class="dashboard-container">
        <!-- Menú Lateral -->
        <aside class="sidebar">
            <img src="/Assets/picture/logo (1).png" alt="Logo Gestor Store" class="logo">
            <div class="menu-item active"><i class="bi bi-house-door-fill"></i> Inicio </div>
            <div class="menu-item">
            <a href="#/catalogo" class="menu-link"><i class="bi bi-calendar3"></i> Catálogo</a>
            </div>
            <div class="menu-item">
            <a href="#/movimientos" class="menu-link"><i class="bi bi-reply-all-fill"></i> Entrada/Salida Productos</a>
            </div>
            <div class="menu-item">
            <a href="#/agregar" class="menu-link"><i class="bi bi-plus-circle"></i> Agregar Productos</a>
            </div>
            <div class="menu-item"><p class="exit"><i class="bi bi-door-open-fill exit"></i> Cerrar sesión</p></div>
        </aside>

        <!-- Contenido Principal -->
        <main class="main-content">
            <!-- Fila superior de tarjetas KPI (Sin existencias bajas) -->
            <section class="kpi-row">
                <div class="card kpi">
                    <h3>Total Productos</h3>
                    <p class="value">2,540 <span class="up">↑</span></p>
                </div>
                <div class="card kpi">
                    <h3>Valor de Inventario</h3>
                    <p class="value">$185,000</p>
                </div>
                <div class="card kpi">
                    <h3>Movimientos del Día</h3>
                    <p class="value sub">64 Entradas / 30 Salidas</p>
                </div>
            </section>

            <!-- Sección de Tablas (Sin el bloque de últimos reportes) -->
            <section class="data-grid">
                <div class="card grid-2" style="width: 100%;">
                    <h3>Tabla de Alertas de Reabastecimiento</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Actual</th>
                                <th>Estatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Producto 1</td>
                                <td>SKU1</td>
                                <td>2,540</td>
                                <td class="status-urgent">URGENTE</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
    `;
}