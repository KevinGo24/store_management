import { DashboardService } from '../services/dashboard.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador HTTP para el Dashboard Consolidado
 */

/**
 * @route   GET /api/dashboard/resumen
 * @desc    Obtener indicadores generales y totales de la tienda
 * @access  Público
 */
export const getResumen = asyncHandler(async (req, res) => {
    const resumen = await DashboardService.obtenerResumenGeneral();

    res.status(200).json({
        ok: true,
        mensaje: 'Resumen del dashboard obtenido exitosamente.',
        data: resumen
    });
});

/**
 * @route   GET /api/dashboard/inventario
 * @desc    Obtener estado crítico de inventario, productos agotados y auditoría reciente
 * @access  Público
 */
export const getInventario = asyncHandler(async (req, res) => {
    const inventario = await DashboardService.obtenerDashboardInventario();

    res.status(200).json({
        ok: true,
        mensaje: 'Información de inventario para dashboard obtenida exitosamente.',
        data: inventario
    });
});

/**
 * @route   GET /api/dashboard/ventas
 * @desc    Obtener métricas, productos más vendidos e historial reciente de ventas
 * @access  Público
 */
export const getVentas = asyncHandler(async (req, res) => {
    const ventas = await DashboardService.obtenerDashboardVentas();

    res.status(200).json({
        ok: true,
        mensaje: 'Información de ventas para dashboard obtenida exitosamente.',
        data: ventas
    });
});

/**
 * @route   GET /api/dashboard/compras
 * @desc    Obtener métricas de compra, gastos y últimos proveedores activos
 * @access  Público
 */
export const getCompras = asyncHandler(async (req, res) => {
    const compras = await DashboardService.obtenerDashboardCompras();

    res.status(200).json({
        ok: true,
        mensaje: 'Información de compras para dashboard obtenida exitosamente.',
        data: compras
    });
});

/**
 * @route   GET /api/dashboard/alertas
 * @desc    Consolidar alertas de stock crítico, productos agotados y documentos pendientes/cancelados
 * @access  Público
 */
export const getAlertas = asyncHandler(async (req, res) => {
    const alertas = await DashboardService.obtenerDashboardAlertas();

    res.status(200).json({
        ok: true,
        mensaje: 'Alertas consolidadas obtenidas exitosamente.',
        data: alertas
    });
});
