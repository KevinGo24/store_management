import { AppError } from '../middlewares/errorHandler.js';

/**
 * Validaciones para el registro manual de un Movimiento de Inventario
 */
export const validarRegistrarMovimiento = (req, res, next) => {
    const {
        id_producto,
        tipo_movimiento,
        origen,
        referencia,
        cantidad,
        costo_unitario,
        observacion,
        usuario_responsable
    } = req.body;

    const errores = [];

    // Validar id_producto
    const idProdNum = Number(id_producto);
    if (!id_producto || !Number.isInteger(idProdNum) || idProdNum <= 0) {
        errores.push('El campo "id_producto" es obligatorio y debe ser un entero positivo válido.');
    }

    // Validar tipo_movimiento
    const tiposValidos = ['Entrada', 'Salida', 'Ajuste'];
    if (!tipo_movimiento || !tiposValidos.includes(tipo_movimiento)) {
        errores.push(`El campo "tipo_movimiento" debe ser uno de los siguientes: ${tiposValidos.join(', ')}.`);
    }

    // Validar origen
    const origenesValidos = ['Compra', 'Venta', 'Ajuste_Manual', 'Devolucion', 'Inicial'];
    if (!origen || !origenesValidos.includes(origen)) {
        errores.push(`El campo "origen" debe ser uno de los siguientes: ${origenesValidos.join(', ')}.`);
    }

    // Validar cantidad
    const cantNum = Number(cantidad);
    if (cantidad === undefined || !Number.isInteger(cantNum) || cantNum <= 0) {
        errores.push('El campo "cantidad" es obligatorio y debe ser un número entero mayor a 0.');
    }

    // Validar costo_unitario (opcional)
    if (costo_unitario !== undefined && (isNaN(Number(costo_unitario)) || Number(costo_unitario) < 0)) {
        errores.push('El campo "costo_unitario" debe ser un número mayor o igual a 0.');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al registrar el movimiento de inventario', 400, errores));
    }

    // Sanitización
    req.body.id_producto = idProdNum;
    req.body.cantidad = cantNum;
    if (referencia) req.body.referencia = referencia.trim();
    if (costo_unitario !== undefined) req.body.costo_unitario = Number(costo_unitario);
    if (observacion) req.body.observacion = observacion.trim();
    req.body.usuario_responsable = usuario_responsable ? usuario_responsable.trim() : 'Sistema';

    next();
};

/**
 * Validar parámetros de consulta para el historial de movimientos
 */
export const validarFiltrosInventario = (req, res, next) => {
    const { id_producto, tipo_movimiento, origen } = req.query;

    if (id_producto && (!Number.isInteger(Number(id_producto)) || Number(id_producto) <= 0)) {
        return next(new AppError('El parámetro "id_producto" debe ser un entero positivo.', 400));
    }

    const tiposValidos = ['Entrada', 'Salida', 'Ajuste'];
    if (tipo_movimiento && !tiposValidos.includes(tipo_movimiento)) {
        return next(new AppError(`El parámetro "tipo_movimiento" debe ser: ${tiposValidos.join(', ')}.`, 400));
    }

    const origenesValidos = ['Compra', 'Venta', 'Ajuste_Manual', 'Devolucion', 'Inicial'];
    if (origen && !origenesValidos.includes(origen)) {
        return next(new AppError(`El parámetro "origen" debe ser: ${origenesValidos.join(', ')}.`, 400));
    }

    next();
};

/**
 * Validar ID de Movimiento en parámetros de URL
 */
export const validarIdMovimientoParam = (req, res, next) => {
    const { id } = req.params;
    const idNumero = Number(id);

    if (!id || !Number.isInteger(idNumero) || idNumero <= 0) {
        return next(new AppError('El ID del movimiento debe ser un número entero positivo.', 400));
    }

    req.params.id = idNumero;
    next();
};
