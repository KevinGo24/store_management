import { AppError } from '../middlewares/errorHandler.js';

/**
 * Validaciones para la creación de una Categoría
 */
export const validarCrearCategoria = (req, res, next) => {
    const { nombre, descripcion } = req.body;
    const errores = [];

    // Validar nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        errores.push('El campo "nombre" es obligatorio y debe ser un texto válido.');
    } else if (nombre.trim().length > 100) {
        errores.push('El campo "nombre" no puede exceder los 100 caracteres.');
    }

    // Validar descripción (opcional)
    if (descripcion !== undefined && descripcion !== null) {
        if (typeof descripcion !== 'string') {
            errores.push('El campo "descripcion" debe ser una cadena de texto.');
        } else if (descripcion.trim().length > 500) {
            errores.push('El campo "descripcion" no puede exceder los 500 caracteres.');
        }
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación en los datos ingresados', 400, errores));
    }

    // Limpieza de datos (trimming)
    req.body.nombre = nombre.trim();
    if (req.body.descripcion) {
        req.body.descripcion = req.body.descripcion.trim();
    }

    next();
};

/**
 * Validaciones para la actualización de una Categoría
 */
export const validarActualizarCategoria = (req, res, next) => {
    const { nombre, descripcion, activo } = req.body;
    const errores = [];

    // Debe enviarse al menos un campo a actualizar
    if (nombre === undefined && descripcion === undefined && activo === undefined) {
        errores.push('Debe proporcionar al menos un campo para actualizar (nombre, descripcion o activo).');
    }

    // Validar nombre si se proporciona
    if (nombre !== undefined) {
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            errores.push('El campo "nombre" debe ser un texto no vacío.');
        } else if (nombre.trim().length > 100) {
            errores.push('El campo "nombre" no puede exceder los 100 caracteres.');
        }
    }

    // Validar descripción si se proporciona
    if (descripcion !== undefined && descripcion !== null) {
        if (typeof descripcion !== 'string') {
            errores.push('El campo "descripcion" debe ser una cadena de texto.');
        } else if (descripcion.trim().length > 500) {
            errores.push('El campo "descripcion" no puede exceder los 500 caracteres.');
        }
    }

    // Validar activo si se proporciona
    if (activo !== undefined && typeof activo !== 'boolean') {
        errores.push('El campo "activo" debe ser un valor booleano (true o false).');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación en los datos ingresados', 400, errores));
    }

    // Sanitización
    if (req.body.nombre) req.body.nombre = req.body.nombre.trim();
    if (req.body.descripcion) req.body.descripcion = req.body.descripcion.trim();

    next();
};

/**
 * Validar que el parámetro ID de la URL sea un número entero positivo
 */
export const validarIdCategoriaParam = (req, res, next) => {
    const { id } = req.params;
    const idNumero = Number(id);

    if (!id || !Number.isInteger(idNumero) || idNumero <= 0) {
        return next(new AppError('El ID proporcionado en la URL debe ser un número entero positivo.', 400));
    }

    req.params.id = idNumero;
    next();
};
