import { AppError } from '../middlewares/errorHandler.js';

/**
 * Middleware para validar datos de entrada en el Registro de Clientes
 */
export const validarRegistro = (req, res, next) => {
    const { nombre_completo, correo, contrasena, telefono } = req.body;
    const errores = [];

    // Validar nombre_completo
    if (!nombre_completo || typeof nombre_completo !== 'string' || nombre_completo.trim() === '') {
        errores.push('El campo "nombre_completo" es obligatorio y debe ser un texto válido.');
    } else if (nombre_completo.trim().length > 150) {
        errores.push('El campo "nombre_completo" no puede exceder los 150 caracteres.');
    }

    // Validar correo
    if (!correo || typeof correo !== 'string' || correo.trim() === '') {
        errores.push('El campo "correo" es obligatorio.');
    } else {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(correo.trim())) {
            errores.push('El campo "correo" debe ser una dirección de correo electrónico válida.');
        } else if (correo.trim().length > 100) {
            errores.push('El campo "correo" no puede exceder los 100 caracteres.');
        }
    }

    // Validar contrasena
    if (!contrasena || typeof contrasena !== 'string' || contrasena.trim() === '') {
        errores.push('El campo "contrasena" es obligatorio.');
    } else if (contrasena.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres.');
    }

    // Validar telefono (opcional)
    if (telefono !== undefined && telefono !== null && typeof telefono !== 'string') {
        errores.push('El campo "telefono" debe ser una cadena de texto.');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al registrar cliente', 400, errores));
    }

    // Sanitización
    req.body.nombre_completo = nombre_completo.trim();
    req.body.correo = correo.trim().toLowerCase();
    if (telefono) req.body.telefono = telefono.trim();

    next();
};

/**
 * Middleware para validar datos de entrada en el Login de Clientes
 */
export const validarLogin = (req, res, next) => {
    const { correo, contrasena } = req.body;
    const errores = [];

    // Validar correo
    if (!correo || typeof correo !== 'string' || correo.trim() === '') {
        errores.push('El campo "correo" es obligatorio.');
    } else {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(correo.trim())) {
            errores.push('El campo "correo" debe ser una dirección de correo electrónico válida.');
        }
    }

    // Validar contrasena
    if (!contrasena || typeof contrasena !== 'string' || contrasena.trim() === '') {
        errores.push('El campo "contrasena" es obligatorio.');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al iniciar sesión', 400, errores));
    }

    // Sanitización
    req.body.correo = correo.trim().toLowerCase();

    next();
};
