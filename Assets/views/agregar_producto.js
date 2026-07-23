export function views_agregar_producto() {
      return `<div class="main-container">
        <div class="product-form-container">
            <div class="form-header">
                <div class="header-title">
                    <i class="bi bi-plus-circle-fill"></i>
                    <h1>Agregar Nuevo Producto</h1>
                </div>
                <p class="subtitle">Registra las especificaciones, código identificador y existencias iniciales.</p>
            </div>

            <form id="formAgregarProducto">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="nombre" class="form-label">
                                <i class="bi bi-tag"></i> Nombre del Producto
                            </label>
                            <input type="text" class="form-control form-control-lg" id="nombre" 
                                   placeholder="Ej. Smartwatch Serie 5" required>
                            <div class="form-text">Nombre descriptivo del producto</div>
                        </div>
                    </div>
        

                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="sku" class="form-label">
                                <i class="bi bi-barcode"></i> Código SKU
                            </label>
                            <input type="text" class="form-control form-control-lg" id="sku" 
                                   placeholder="Ej. SKU-98745" required>
                            <div class="form-text">Código único de identificación</div>
                        </div>
                    </div>

                    <!-- CAMPO: MARCA -->
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="marca" class="form-label">
                                <i class="bi bi-award"></i> Marca
                            </label>
                            <input type="text" class="form-control form-control-lg" id="marca" 
                                   placeholder="Ej. Samsung, Apple, etc.">
                            <div class="form-text">Marca fabricante del producto</div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="cantidad" class="form-label">
                                <i class="bi bi-box2"></i> Cantidad Inicial
                            </label>
                            <input type="number" class="form-control form-control-lg" id="cantidad" 
                                   value="0" min="0" required>
                            <div class="form-text">Existencias iniciales</div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="precio" class="form-label">
                                <i class="bi bi-coin"></i> Precio de Venta ($)
                            </label>
                            <input type="number" class="form-control form-control-lg" id="precio" 
                                   value="0.00" step="0.01" min="0" required>
                            <div class="form-text">Precio unitario</div>
                        </div>
                    </div>

                    <!-- CAMPO CATEGORÍA (Ubicado simétricamente antes de la descripción) -->
                    <div class="col-12">
                        <div class="form-group">
                            <label for="categoria" class="form-label">
                                <i class="bi bi-folder-fill"></i> Categoría
                            </label>
                            <select class="form-control form-control-lg" id="categoria" required>
                                <option value="" disabled selected>Cargando categorías...</option>
                            </select>
                            <div class="form-text">Selecciona la categoría del producto</div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="form-group">
                            <label for="descripcion" class="form-label">
                                <i class="bi bi-file-text"></i> Descripción
                            </label>
                            <textarea class="form-control form-control-lg" id="descripcion" 
                                      rows="3" placeholder="Describe las características del producto..."></textarea>
                                    rows="3" placeholder="Describe las características del producto..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="form-actions" style="justify-content: center;">
                    <button type="submit" class="btn btn-success btn-lg">
                        <i class="bi bi-check-circle"></i> Guardar Producto
                    </button>
                    <button type="button" class="btn btn-secondary btn-lg" data-bs-dismiss="offcanvas">
                    <button type="button" class="btn btn-secondary btn-lg" id="btnCancelar">
                        <i class="bi bi-x-circle"></i> Cancelar
                    </button>
                    <button type="button" class="btn btn-danger btn-lg" onclick="window.location.hash = '/gestor'">
                        <i class="bi bi-door-open"></i> Salir
                    </button>
                </div>
                </div>
            </form>
        </div>
    </div>
    `
}