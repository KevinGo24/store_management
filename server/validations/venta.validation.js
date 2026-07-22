import { AppError } from '../middlewares/errorHandler.js';

/**
 * Validaciones para la creación de una Venta
 */
export const validarCrearVenta = (req, res, next) => {
    const {
        numero_venta,
        nombre_cliente,
        documento_cliente,
        detalles,
        impuesto,
        descuento,
        observaciones
    } = req.body;

    const errores = [];

    // Validar número de venta (opcional, se autogenera si no se envía)
    if (numero_venta !== undefined && (typeof numero_venta !== 'string' || numero_venta.trim() === '')) {
        errores.push('El campo "numero_venta" debe ser un código de texto válido si se proporciona.');
    }

    // Validar nombre_cliente (opcional)
    if (nombre_cliente !== undefined && nombre_cliente !== null) {
        if (typeof nombre_cliente !== 'string') {
            errores.push('El campo "nombre_cliente" debe ser texto.');
        } else if (nombre_cliente.trim().length > 150) {
            errores.push('El campo "nombre_cliente" no puede exceder los 150 caracteres.');
        }
    }

    // Validar documento_cliente (opcional)
    if (documento_cliente !== undefined && documento_cliente !== null) {
        if (typeof documento_cliente !== 'string') {
            errores.push('El campo "documento_cliente" debe ser texto.');
        } else if (documento_cliente.trim().length > 30) {
            errores.push('El campo "documento_cliente" no puede exceder los 30 caracteres.');
        }
    }

    // Validar array de detalles — obligatorio con al menos un ítem
    if (!Array.isArray(detalles) || detalles.length === 0) {
        errores.push('La venta debe contener al menos un producto en el listado de "detalles".');
    } else {
        detalles.forEach((item, index) => {
            const pos = index + 1;

            const idProdNum  = Number(item.id_producto);
            const cantNum    = Number(item.cantidad);
            const precioNum  = Number(item.precio_unitario);

            if (!item.id_producto || !Number.isInteger(idProdNum) || idProdNum <= 0) {
                errores.push(`Ítem #${pos}: "id_producto" debe ser un entero positivo válido.`);
            }

            if (item.cantidad === undefined || !Number.isInteger(cantNum) || cantNum <= 0) {
                errores.push(`Ítem #${pos}: "cantidad" debe ser un número entero mayor a 0.`);
            }

            if (item.precio_unitario === undefined || isNaN(precioNum) || precioNum < 0) {
                errores.push(`Ítem #${pos}: "precio_unitario" debe ser un número mayor o igual a 0.`);
            }
        });
    }

    // Validar impuesto y descuento (opcionales)
    if (impuesto !== undefined && (isNaN(Number(impuesto)) || Number(impuesto) < 0)) {
        errores.push('El campo "impuesto" debe ser un valor numérico mayor o igual a 0.');
    }

    if (descuento !== undefined && (isNaN(Number(descuento)) || Number(descuento) < 0)) {
        errores.push('El campo "descuento" debe ser un valor numérico mayor o igual a 0.');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al registrar la venta.', 400, errores));
    }

    // Sanitización
    if (numero_venta)        req.body.numero_venta        = numero_venta.trim();
    if (nombre_cliente)      req.body.nombre_cliente      = nombre_cliente.trim();
    if (documento_cliente)   req.body.documento_cliente   = documento_cliente.trim();
    if (observaciones)       req.body.observaciones       = observaciones.trim();
    req.body.impuesto  = impuesto  !== undefined ? Number(impuesto)  : 0.00;
    req.body.descuento = descuento !== undefined ? Number(descuento) : 0.00;

    next();
};

/**
 * Validaciones para cancelar una Venta
 * Solo se acepta el estado 'Cancelada'
 */
export const validarCancelarVenta = (req, res, next) => {
    const { estado } = req.body;

    if (!estado || estado !== 'Cancelada') {
        return next(new AppError(
            'Para cancelar una venta, envía { "estado": "Cancelada" } en el cuerpo de la petición.', 400
        ));
    }

    next();
};

/**
 * Validar ID de Venta en parámetros de URL
 */
export const validarIdVentaParam = (req, res, next) => {
    const { id } = req.params;
    const idNumero = Number(id);

    if (!id || !Number.isInteger(idNumero) || idNumero <= 0) {
        return next(new AppError('El ID de la venta debe ser un número entero positivo.', 400));
    }

    req.params.id = idNumero;
    next();
};
