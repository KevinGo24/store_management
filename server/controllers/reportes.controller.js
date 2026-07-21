import { ReporteService } from '../services/reportes.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador HTTP para el Módulo de Reportes Analíticos de la Tienda
 */

/**
 * @route   GET /api/reportes/ventas
 * @desc    Obtener reporte analítico de ventas en un rango de fechas
 * @access  Público
 * @query   fecha_inicio, fecha_fin
 */
export const getReporteVentas = asyncHandler(async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    const reporte = await ReporteService.obtenerReporteVentas(fecha_inicio, fecha_fin);

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte de ventas obtenido exitosamente.',
        data: reporte
    });
});

/**
 * @route   GET /api/reportes/compras
 * @desc    Obtener reporte analítico de compras en un rango de fechas
 * @access  Público
 * @query   fecha_inicio, fecha_fin
 */
export const getReporteCompras = asyncHandler(async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    const reporte = await ReporteService.obtenerReporteCompras(fecha_inicio, fecha_fin);

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte de compras obtenido exitosamente.',
        data: reporte
    });
});

/**
 * @route   GET /api/reportes/inventario
 * @desc    Obtener reporte de valorización de inventario, stock crítico y mayor existencia
 * @access  Público
 */
export const getReporteInventario = asyncHandler(async (req, res) => {
    const reporte = await ReporteService.obtenerReporteInventario();

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte de inventario obtenido exitosamente.',
        data: reporte
    });
});

/**
 * @route   GET /api/reportes/productos
 * @desc    Obtener reporte analítico del catálogo de productos (activos/inactivos, sin movimiento, etc.)
 * @access  Público
 */
export const getReporteProductos = asyncHandler(async (req, res) => {
    const reporte = await ReporteService.obtenerReporteProductos();

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte de productos obtenido exitosamente.',
        data: reporte
    });
});

/**
 * @route   GET /api/reportes/proveedores
 * @desc    Obtener reporte analítico de proveedores y su volumen comercial
 * @access  Público
 */
export const getReporteProveedores = asyncHandler(async (req, res) => {
    const reporte = await ReporteService.obtenerReporteProveedores();

    res.status(200).json({
        ok: true,
        mensaje: 'Reporte de proveedores obtenido exitosamente.',
        data: reporte
    });
});
