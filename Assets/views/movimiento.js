export function views_movimientos() {
  return `
    <div class="movimientos-container">
      <header class="movimientos-header">
        <div class="header-title">
          <i class="bi bi-arrow-left-right"></i>
          <h2>Movimientos de Inventario</h2>
        </div>
        <p>Registra y audita las entradas y salidas de stock en tiempo real.</p>
<<<<<<< HEAD
        <a href="#/dashboard" class="btn-back"><i class="bi bi-caret-left-fill"></i> Volver al Inicio</a>

=======
>>>>>>> backend
      </header>

      <!-- FORMULARIO DE REGISTRO -->
      <section class="card-movimiento">
        <h3><i class="bi bi-plus-circle"></i> Registrar Nuevo Movimiento</h3>
        <form id="form-movimiento" class="form-movimiento">
          
          <div class="form-row">
            <div class="form-group">
              <label for="tipo-movimiento" class="form-label">
                <i class="bi bi-shuffle"></i> Tipo de Movimiento
              </label>
              <select id="tipo-movimiento" class="form-control">
                <option value="entrada"><i class="bi bi-arrow-down-circle"></i> Entrada (Abastecimiento)</option>
                <option value="salida"><i class="bi bi-arrow-up-circle"></i> Salida (Venta / Retiro)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="producto-movimiento" class="form-label">
                <i class="bi bi-box"></i> Seleccionar Producto
              </label>
              <select id="producto-movimiento" class="form-control">
                <option value="1">Producto 1 (SKU1)</option>
                <option value="2">Producto 2 (SKU2)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="cantidad-movimiento" class="form-label">
                <i class="bi bi-123"></i> Cantidad
              </label>
              <input type="number" id="cantidad-movimiento" class="form-control" min="1" placeholder="Ej. 10" required>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-success">
              <i class="bi bi-check-circle"></i> Guardar Movimiento
            </button>
          </div>

        </form>
      </section>

      <!-- TABLA DE HISTORIAL -->
      <section class="card-movimiento">
        <h3><i class="bi bi-clock-history"></i> Historial de Movimientos Recientes</h3>
        <div class="tabla-responsiva">
          <table class="tabla-movimientos table table-striped table-hover">
            <thead>
              <tr>
                <th><i class="bi bi-calendar3"></i> Fecha / Hora</th>
                <th><i class="bi bi-tag"></i> Producto</th>
                <th><i class="bi bi-arrow-left-right"></i> Tipo</th>
                <th><i class="bi bi-boxes"></i> Cantidad</th>
              </tr>
            </thead>
            <tbody id="tabla-body-movimientos">
              <!-- JS renderizará las filas dinámicamente aquí -->
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}
