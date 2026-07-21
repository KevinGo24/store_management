import { AppError } from '../middlewares/errorHandler.js';

/**
 * Validar parámetros de fecha opcionales en consultas de reportes
 */
export const validarFechasReporte = (req, res, next) => {
    const { fecha_inicio, fecha_fin } = req.query;
    const errores = [];

    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (fecha_inicio && !regexFecha.test(fecha_inicio)) {
        errores.push('El parámetro "fecha_inicio" debe tener formato YYYY-MM-DD.');
    }

    if (fecha_fin && !regexFecha.test(fecha_fin)) {
        errores.push('El parámetro "fecha_fin" debe tener formato YYYY-MM-DD.');
    }

    // Validar que inicio no sea mayor que fin
    if (fecha_inicio && fecha_fin && regexFecha.test(fecha_inicio) && regexFecha.test(fecha_fin)) {
        const dInicio = new Date(fecha_inicio);
        const dFin    = new Date(fecha_fin);

        if (dInicio > dFin) {
            errores.push('La "fecha_inicio" no puede ser posterior a la "fecha_fin".');
        }
    }

    if (errores.length > 0) {
        return next(new AppError('Parámetros de consulta incorrectos para el reporte.', 400, errores));
    }

    next();
};
