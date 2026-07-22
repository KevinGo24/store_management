import { AppError } from '../middlewares/errorHandler.js';

/**
 * Validaciones para la creación de una Orden de Compra
 */
export const validarCrearCompra = (req, res, next) => {
    const {
        id_proveedor,
        numero_compra,
        detalles,
        impuesto,
        descuento,
        estado,
        observaciones
    } = req.body;

    const errores = [];

    // Validar id_proveedor
    const idProvNum = Number(id_proveedor);
    if (!id_proveedor || !Number.isInteger(idProvNum) || idProvNum <= 0) {
        errores.push('El campo "id_proveedor" es obligatorio y debe ser un entero positivo válido.');
    }

    // Validar numero_compra si se proporciona
    if (numero_compra !== undefined && (typeof numero_compra !== 'string' || numero_compra.trim() === '')) {
        errores.push('El campo "numero_compra" debe ser un código de texto válido.');
    }

    // Validar array de detalles
    if (!Array.isArray(detalles) || detalles.length === 0) {
        errores.push('La compra debe contener al menos un producto en el listado de "detalles".');
    } else {
        detalles.forEach((item, index) => {
            const pos = index + 1;
            const idProdNum = Number(item.id_producto);
            const cantNum = Number(item.cantidad);
            const precioNum = Number(item.precio_unitario);

            if (!item.id_producto || !Number.isInteger(idProdNum) || idProdNum <= 0) {
                errores.push(`Item #${pos}: El campo "id_producto" debe ser un entero positivo válido.`);
            }

            if (item.cantidad === undefined || !Number.isInteger(cantNum) || cantNum <= 0) {
                errores.push(`Item #${pos}: La "cantidad" debe ser un número entero positivo mayor a 0.`);
            }

            if (item.precio_unitario === undefined || isNaN(precioNum) || precioNum < 0) {
                errores.push(`Item #${pos}: El "precio_unitario" debe ser un número mayor o igual a 0.`);
            }
        });
    }

    // Validar impuesto y descuento
    if (impuesto !== undefined && (isNaN(Number(impuesto)) || Number(impuesto) < 0)) {
        errores.push('El campo "impuesto" debe ser un valor numérico mayor o igual a 0.');
    }

    if (descuento !== undefined && (isNaN(Number(descuento)) || Number(descuento) < 0)) {
        errores.push('El campo "descuento" debe ser un valor numérico mayor o igual a 0.');
    }

    // Validar estado si se envía directamente
    const estadosValidos = ['Pendiente', 'Recibida', 'Cancelada'];
    if (estado !== undefined && !estadosValidos.includes(estado)) {
        errores.push(`El estado de la compra debe ser uno de los siguientes: ${estadosValidos.join(', ')}.`);
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al registrar la compra', 400, errores));
    }

    // Sanitización
    req.body.id_proveedor = idProvNum;
    if (numero_compra) req.body.numero_compra = numero_compra.trim();
    req.body.impuesto = impuesto !== undefined ? Number(impuesto) : 0.00;
    req.body.descuento = descuento !== undefined ? Number(descuento) : 0.00;
    req.body.estado = estado || 'Pendiente';
    if (observaciones) req.body.observaciones = observaciones.trim();

    next();
};

/**
 * Validaciones para cambio de estado de una Compra
 */
export const validarCambiarEstadoCompra = (req, res, next) => {
    const { estado } = req.body;
    const estadosValidos = ['Pendiente', 'Recibida', 'Cancelada'];

    if (!estado || !estadosValidos.includes(estado)) {
        return next(new AppError(`Debe proporcionar un "estado" válido (${estadosValidos.join(', ')}).`, 400));
    }

    next();
};

/**
 * Validar ID de Compra en parámetros de URL
 */
export const validarIdCompraParam = (req, res, next) => {
    const { id } = req.params;
    const idNumero = Number(id);

    if (!id || !Number.isInteger(idNumero) || idNumero <= 0) {
        return next(new AppError('El ID de la compra debe ser un número entero positivo.', 400));
    }

    req.params.id = idNumero;
    next();
};
