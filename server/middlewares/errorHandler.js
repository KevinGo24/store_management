/**
 * Middleware global para captura y formateo de errores en Express.
 */

/**
 * Clase de Error Personalizada para errores de lógica de negocio (HTTP Status definible)
 */
export class AppError extends Error {
    constructor(mensaje, statusCode = 400, errores = []) {
        super(mensaje);
        this.statusCode = statusCode;
        this.errores = errores;
        this.isOperational = true; // Error controlado de la aplicación
    }
}

/**
 * Middleware para envolver funciones asíncronas y evitar bloques try/catch repetitivos en controladores
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Middleware global de manejo de errores
 */
export const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`, err.stack);

    // Si es un error operativo (AppError)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            ok: false,
            mensaje: err.message,
            errores: err.errores.length > 0 ? err.errores : undefined
        });
    }

    // Error de clave duplicada en PostgreSQL (código 23505)
    if (err.code === '23505') {
        return res.status(409).json({
            ok: false,
            mensaje: 'El registro ya existe. Uno de los campos únicos está duplicado.',
            error: err.detail
        });
    }

    // Error de sintaxis JSON o body mal formado
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Cuerpo de la petición JSON mal formado.'
        });
    }

    // Error interno del servidor no controlado (500)
    return res.status(500).json({
        ok: false,
        mensaje: 'Error interno del servidor.'
    });
};
