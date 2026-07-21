import { AppError } from '../middlewares/errorHandler.js';

/**
 * Validaciones para la creación de un Proveedor
 */
export const validarCrearProveedor = (req, res, next) => {
    const {
        nombre,
        nit,
        correo,
        telefono,
        direccion,
        ciudad,
        contacto_principal,
        condiciones_pago,
        tiempo_entrega_dias,
        sitio_web,
        observaciones
    } = req.body;

    const errores = [];

    // Validar Nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        errores.push('El campo "nombre" del proveedor es obligatorio.');
    } else if (nombre.trim().length > 150) {
        errores.push('El campo "nombre" no puede exceder los 150 caracteres.');
    }

    // Validar NIT / Identificación Fiscal
    if (!nit || typeof nit !== 'string' || nit.trim() === '') {
        errores.push('El campo "nit" (identificación fiscal) es obligatorio.');
    } else if (nit.trim().length > 30) {
        errores.push('El campo "nit" no puede exceder los 30 caracteres.');
    }

    // Validar Correo (si se envía)
    if (correo !== undefined && correo !== null && correo.trim() !== '') {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(correo.trim())) {
            errores.push('El campo "correo" debe ser una dirección de correo electrónico válida.');
        }
    }

    // Validar Teléfono (si se envía)
    if (telefono !== undefined && telefono !== null && typeof telefono !== 'string') {
        errores.push('El campo "telefono" debe ser una cadena de texto.');
    }

    // Validar tiempo_entrega_dias
    if (tiempo_entrega_dias !== undefined && (isNaN(Number(tiempo_entrega_dias)) || Number(tiempo_entrega_dias) < 0)) {
        errores.push('El campo "tiempo_entrega_dias" debe ser un número entero mayor o igual a 0.');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al crear el proveedor', 400, errores));
    }

    // Sanitización
    req.body.nombre = nombre.trim();
    req.body.nit = nit.trim();
    if (correo) req.body.correo = correo.trim().toLowerCase();
    if (telefono) req.body.telefono = telefono.trim();
    if (direccion) req.body.direccion = direccion.trim();
    if (ciudad) req.body.ciudad = ciudad.trim();
    if (contacto_principal) req.body.contacto_principal = contacto_principal.trim();
    if (condiciones_pago) req.body.condiciones_pago = condiciones_pago.trim();
    req.body.tiempo_entrega_dias = tiempo_entrega_dias !== undefined ? Number(tiempo_entrega_dias) : 1;
    if (sitio_web) req.body.sitio_web = sitio_web.trim();
    if (observaciones) req.body.observaciones = observaciones.trim();

    next();
};

/**
 * Validaciones para la actualización de un Proveedor
 */
export const validarActualizarProveedor = (req, res, next) => {
    const {
        nombre,
        nit,
        correo,
        telefono,
        tiempo_entrega_dias,
        activo
    } = req.body;

    const errores = [];

    if (Object.keys(req.body).length === 0) {
        errores.push('Debe proporcionar al menos un campo para actualizar el proveedor.');
    }

    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
        errores.push('El campo "nombre" no puede estar vacío.');
    }

    if (nit !== undefined && (typeof nit !== 'string' || nit.trim() === '')) {
        errores.push('El campo "nit" no puede estar vacío.');
    }

    if (correo !== undefined && correo !== null && correo.trim() !== '') {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(correo.trim())) {
            errores.push('El campo "correo" debe ser un correo electrónico válido.');
        }
    }

    if (tiempo_entrega_dias !== undefined && (isNaN(Number(tiempo_entrega_dias)) || Number(tiempo_entrega_dias) < 0)) {
        errores.push('El campo "tiempo_entrega_dias" debe ser mayor o igual a 0.');
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
        errores.push('El campo "activo" debe ser un valor booleano (true o false).');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al actualizar el proveedor', 400, errores));
    }

    // Sanitización
    if (req.body.nombre) req.body.nombre = req.body.nombre.trim();
    if (req.body.nit) req.body.nit = req.body.nit.trim();
    if (req.body.correo) req.body.correo = req.body.correo.trim().toLowerCase();

    next();
};

/**
 * Validar ID de Proveedor en parámetros de URL
 */
export const validarIdProveedorParam = (req, res, next) => {
    const { id } = req.params;
    const idNumero = Number(id);

    if (!id || !Number.isInteger(idNumero) || idNumero <= 0) {
        return next(new AppError('El ID del proveedor debe ser un número entero positivo.', 400));
    }

    req.params.id = idNumero;
    next();
};
