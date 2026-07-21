import { VentaService } from '../services/venta.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador HTTP para el Módulo de Ventas
 */

/**
 * @route   GET /api/ventas
 * @desc    Obtener listado de ventas con filtros opcionales
 * @access  Público
 * @query   estado, buscar, fecha_inicio, fecha_fin
 */
export const getVentas = asyncHandler(async (req, res) => {
    const filtros = {
        estado:      req.query.estado      ? String(req.query.estado)      : undefined,
        buscar:      req.query.buscar      ? String(req.query.buscar)      : undefined,
        fecha_inicio: req.query.fecha_inicio ? String(req.query.fecha_inicio) : undefined,
        fecha_fin:    req.query.fecha_fin    ? String(req.query.fecha_fin)    : undefined
    };

    const ventas = await VentaService.listarVentas(filtros);

    res.status(200).json({
        ok: true,
        mensaje: 'Ventas obtenidas exitosamente.',
        total: ventas.length,
        data: ventas
    });
});

/**
 * @route   GET /api/ventas/:id
 * @desc    Obtener el detalle completo de una venta por ID (encabezado + ítems)
 * @access  Público
 */
export const getVentaById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const venta = await VentaService.obtenerPorId(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Venta obtenida exitosamente.',
        data: venta
    });
});

/**
 * @route   POST /api/ventas
 * @desc    Registrar una nueva venta. Descuenta stock automáticamente via Inventario.
 * @access  Público
 * @body    { numero_venta?, nombre_cliente?, documento_cliente?, detalles[],
 *            impuesto?, descuento?, observaciones? }
 */
export const createVenta = asyncHandler(async (req, res) => {
    const nuevaVenta = await VentaService.crearVenta(req.body);

    res.status(201).json({
        ok: true,
        mensaje: 'Venta registrada exitosamente.',
        data: nuevaVenta
    });
});

/**
 * @route   PUT /api/ventas/:id/cancelar
 * @desc    Cancelar una venta completada. Revierte el stock via Inventario (Devolución).
 * @access  Público
 */
export const cancelarVenta = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ventaCancelada = await VentaService.cancelarVenta(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Venta cancelada exitosamente. El inventario ha sido revertido.',
        data: ventaCancelada
    });
});
