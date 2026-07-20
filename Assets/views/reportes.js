export function views_reportes() {
  return `

<div class="main-content">
    
    <div class="filter-bar">
        
        <div class="header-title">
            <h2> Reporte de Operaciones Diarias</h2>
            <p>Monitoreo en tiempo real de los movimientos de hoy</p>
        </div>
        <button class="btn-export">Exportar Corte del Día</button>
        <a href="#/dashboard" class="btn-back"><i class="bi bi-caret-left-fill"></i> Volver al Inicio</a>

    </div>

    <!-- TARJETAS INDICADORES (KPIs DEL DÍA) -->
    <div class="kpi-container">
        <!-- Entradas de hoy -->
        <div class="kpi-card">
            <div class="kpi-title">Ingresos de Hoy</div>
            <div class="kpi-value kpi-green">64 Entradas</div>
        </div>
        <!-- Salidas de hoy -->
        <div class="kpi-card">
            <div class="kpi-title">Despachos de Hoy</div>
            <div class="kpi-value kpi-red">30 Salidas</div>
        </div>
        <!-- Alertas críticas activadas -->
        <div class="kpi-card">
            <div class="kpi-title">Existencias Bajas (Nuevas)</div>
            <div class="kpi-value kpi-warning">5 Alertas</div>
        </div>
        <!-- Valor movilizado -->
        <div class="kpi-card">
            <div class="kpi-title">Flujo de Inventario (Monetario)</div>
            <div class="kpi-value">$4,850</div>
        </div>
    </div>

    <!-- SECCIÓN DE DETALLE DIARIO (GRÁFICO HORARIO Y BITÁCORA) -->
    <div class="dashboard-grid">
        
        <!-- Historial de Movimientos por Hora -->
        <div class="chart-card">
            <div class="section-title">Frecuencia de Actividad por Hora</div>
            <div class="chart-wrapper">
                <canvas id="movimientosDiariosChart"></canvas>
            </div>
        </div>

        <!-- Bitácora de Últimas Transacciones del Día -->
        <div class="table-card">
            <div class="section-title">Bitácora Reciente (Hoy)</div>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Acción</th>
                        <th>Cant.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-muted">17:45</td>
                        <td>Salida - SKU1</td>
                        <td class="text-red">-12 u.</td>
                    </tr>
                    <tr>
                        <td class="text-muted">16:20</td>
                        <td>Entrada - SKU4</td>
                        <td class="text-green">+50 u.</td>
                    </tr>
                    <tr>
                        <td class="text-muted">14:05</td>
                        <td>Entrada - SKU1</td>
                        <td class="text-green">+14 u.</td>
                    </tr>
                    <tr>
                        <td class="text-muted">09:15</td>
                        <td>Salida - SKU2</td>
                        <td class="text-red">-18 u.</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>
`
}

