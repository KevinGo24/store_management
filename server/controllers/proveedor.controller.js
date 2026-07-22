import { ProveedorService } from '../services/proveedor.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador HTTP para el módulo de Proveedores
 */

/**
 * @route   GET /api/proveedores
 * @desc    Obtener lista de proveedores (soporta filtro por búsqueda parcial ?buscar=...)
 * @access  Público
 */
export const getProveedores = asyncHandler(async (req, res) => {
    const filtros = {
        buscar: req.query.buscar ? String(req.query.buscar) : undefined,
        incluirInactivos: req.query.incluirInactivos === 'true'
    };

    const proveedores = await ProveedorService.listarProveedores(filtros);

    res.status(200).json({
        ok: true,
        mensaje: 'Proveedores obtenidos exitosamente.',
        total: proveedores.length,
        data: proveedores
    });
});

/**
 * @route   GET /api/proveedores/:id
 * @desc    Obtener detalle de un proveedor por ID
 * @access  Público
 */
export const getProveedorById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const proveedor = await ProveedorService.obtenerPorId(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Proveedor obtenido exitosamente.',
        data: proveedor
    });
});

/**
 * @route   POST /api/proveedores
 * @desc    Registrar un nuevo proveedor
 * @access  Público
 */
export const createProveedor = asyncHandler(async (req, res) => {
    const nuevoProveedor = await ProveedorService.crearProveedor(req.body);

    res.status(201).json({
        ok: true,
        mensaje: 'Proveedor creado exitosamente.',
        data: nuevoProveedor
    });
});

/**
 * @route   PUT /api/proveedores/:id
 * @desc    Actualizar los datos de un proveedor
 * @access  Público
 */
export const updateProveedor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const proveedorActualizado = await ProveedorService.actualizarProveedor(id, req.body);

    res.status(200).json({
        ok: true,
        mensaje: 'Proveedor actualizado exitosamente.',
        data: proveedorActualizado
    });
});

/**
 * @route   DELETE /api/proveedores/:id
 * @desc    Desactivar un proveedor (Soft Delete)
 * @access  Público
 */
export const deleteProveedor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const proveedorEliminado = await ProveedorService.eliminarProveedor(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Proveedor eliminado (desactivado) exitosamente.',
        data: proveedorEliminado
    });
});
