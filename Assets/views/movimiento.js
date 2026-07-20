export function views_movimientos() {
  return `
    <div class="movimientos-container">
      <header class="movimientos-header">
        <h2>Movimientos de Inventario</h2>
        <p>Registra y audita las entradas y salidas de stock en tiempo real.</p>
        <a href="#/dashboard" class="btn-back"><i class="bi bi-caret-left-fill"></i> Volver al Inicio</a>

      </header>

      <!-- FORMULARIO DE REGISTRO -->
      <section class="card-movimiento">
        <h3>Registrar Nuevo Movimiento</h3>
        <form id="form-movimiento" class="form-movimiento">
          
          <div class="form-group">
            <label for="tipo-movimiento">Tipo de Movimiento</label>
            <select id="tipo-movimiento" class="input-control">
              <option value="entrada">🟢 Entrada (Abastecimiento)</option>
              <option value="salida">🔴 Salida (Venta / Retiro)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="producto-movimiento">Seleccionar Producto</label>
            <select id="producto-movimiento" class="input-control">
              <option value="1">Producto 1 (SKU1)</option>
              <option value="2">Producto 2 (SKU2)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="cantidad-movimiento">Cantidad</label>
            <input type="number" id="cantidad-movimiento" class="input-control" min="1" placeholder="Ej. 10" required>
          </div>

          <div class="form-group btn-group">
            <button type="submit" class="btn-guardar">Guardar Movimiento</button>
          </div>

        </form>
      </section>

      <!-- TABLA DE HISTORIAL -->
      <section class="card-movimiento">
        <h3>Historial de Movimientos Recientes</h3>
        <div class="tabla-responsiva">
          <table class="tabla-movimientos">
            <thead>
              <tr>
                <th>Fecha / Hora</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
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
