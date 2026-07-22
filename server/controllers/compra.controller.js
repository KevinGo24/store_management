import { CompraService } from '../services/compra.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador HTTP para el módulo de Compras
 */

/**
 * @route   GET /api/compras
 * @desc    Obtener listado de órdenes de compra con filtros (proveedor, estado, búsqueda)
 * @access  Público
 */
export const getCompras = asyncHandler(async (req, res) => {
    const filtros = {
        id_proveedor: req.query.id_proveedor ? Number(req.query.id_proveedor) : undefined,
        estado: req.query.estado ? String(req.query.estado) : undefined,
        buscar: req.query.buscar ? String(req.query.buscar) : undefined
    };

    const compras = await CompraService.listarCompras(filtros);

    res.status(200).json({
        ok: true,
        mensaje: 'Órdenes de compra obtenidas exitosamente.',
        total: compras.length,
        data: compras
    });
});

/**
 * @route   GET /api/compras/:id
 * @desc    Obtener el detalle completo de una compra por ID (incluye datos del proveedor e ítems)
 * @access  Público
 */
export const getCompraById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const compra = await CompraService.obtenerPorId(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Orden de compra obtenida exitosamente.',
        data: compra
    });
});

/**
 * @route   POST /api/compras
 * @desc    Registrar una nueva orden de compra con múltiples productos
 * @access  Público
 */
export const createCompra = asyncHandler(async (req, res) => {
    const nuevaCompra = await CompraService.crearCompra(req.body);

    res.status(201).json({
        ok: true,
        mensaje: 'Orden de compra registrada exitosamente.',
        data: nuevaCompra
    });
});

/**
 * @route   PUT /api/compras/:id/estado
 * @desc    Actualizar el estado de una compra (Pendiente ➔ Recibida ➔ Cancelada) y sincronizar stock
 * @access  Público
 */
export const cambiarEstadoCompra = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const compraActualizada = await CompraService.cambiarEstadoCompra(id, estado);

    res.status(200).json({
        ok: true,
        mensaje: `El estado de la compra ha cambiado a '${estado}' exitosamente.`,
        data: compraActualizada
    });
});
