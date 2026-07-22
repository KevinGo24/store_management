import { InventarioService } from '../services/inventario.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador HTTP para el Módulo de Inventario
 *
 * Expone los métodos del InventarioService a través de endpoints REST.
 * Este es el único punto de entrada para operaciones manuales sobre existencias.
 */

/**
 * @route   POST /api/inventario/movimientos
 * @desc    Registrar manualmente un movimiento de inventario (Entrada, Salida o Ajuste)
 * @access  Público
 * @body    { id_producto, tipo_movimiento, origen, referencia?, cantidad,
 *            costo_unitario?, observacion?, usuario_responsable? }
 */
export const registrarMovimiento = asyncHandler(async (req, res) => {
    const movimiento = await InventarioService.registrarMovimiento(req.body);

    res.status(201).json({
        ok: true,
        mensaje: 'Movimiento de inventario registrado exitosamente.',
        data: movimiento
    });
});

/**
 * @route   GET /api/inventario/movimientos
 * @desc    Obtener el historial completo de movimientos con filtros opcionales
 * @access  Público
 * @query   id_producto, tipo_movimiento, origen, buscar, limite
 */
export const getHistorialMovimientos = asyncHandler(async (req, res) => {
    const filtros = {
        id_producto:     req.query.id_producto    ? Number(req.query.id_producto)    : undefined,
        tipo_movimiento: req.query.tipo_movimiento ? String(req.query.tipo_movimiento) : undefined,
        origen:          req.query.origen          ? String(req.query.origen)          : undefined,
        buscar:          req.query.buscar          ? String(req.query.buscar)          : undefined,
        limite:          req.query.limite          ? Number(req.query.limite)          : 100
    };

    const movimientos = await InventarioService.obtenerHistorialMovimientos(filtros);

    res.status(200).json({
        ok: true,
        mensaje: 'Historial de movimientos obtenido exitosamente.',
        total: movimientos.length,
        data: movimientos
    });
});

/**
 * @route   GET /api/inventario/movimientos/:id
 * @desc    Obtener el detalle de un movimiento específico por ID
 * @access  Público
 */
export const getMovimientoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movimiento = await InventarioService.obtenerMovimientoPorId(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Movimiento obtenido exitosamente.',
        data: movimiento
    });
});

/**
 * @route   GET /api/inventario/stock
 * @desc    Consultar el estado actual del stock de todos los productos activos.
 *          Incluye badge de estatus: NORMAL, ALERTA o AGOTADO.
 * @access  Público
 * @query   id_categoria, buscar, stockAlerta
 */
export const getStockActual = asyncHandler(async (req, res) => {
    const filtros = {
        id_categoria: req.query.id_categoria ? Number(req.query.id_categoria) : undefined,
        buscar:       req.query.buscar       ? String(req.query.buscar)       : undefined,
        stockAlerta:  req.query.stockAlerta === 'true'
    };

    const stock = await InventarioService.consultarStockActual(filtros);

    res.status(200).json({
        ok: true,
        mensaje: 'Estado del stock obtenido exitosamente.',
        total: stock.length,
        data: stock
    });
});

/**
 * @route   GET /api/inventario/dashboard
 * @desc    Obtener métricas y KPIs del dashboard de inventarios:
 *          valor total, productos agotados, alertas, rotación y últimos movimientos.
 * @access  Público
 */
export const getDashboardInventario = asyncHandler(async (req, res) => {
    const resumen = await InventarioService.obtenerResumenDashboard();

    res.status(200).json({
        ok: true,
        mensaje: 'Métricas del dashboard de inventario obtenidas exitosamente.',
        data: resumen
    });
});
