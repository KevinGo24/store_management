import { ProductoService } from '../services/producto.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador HTTP para el módulo de Productos
 */

/**
 * @route   GET /api/productos
 * @desc    Obtener lista de productos (soporta filtros por categoría, búsqueda y alerta de stock)
 * @access  Público
 */
export const getProductos = asyncHandler(async (req, res) => {
    const filtros = {
        id_categoria: req.query.id_categoria ? Number(req.query.id_categoria) : undefined,
        buscar: req.query.buscar ? String(req.query.buscar) : undefined,
        stockAlerta: req.query.stockAlerta === 'true',
        incluirInactivos: req.query.incluirInactivos === 'true'
    };

    const productos = await ProductoService.listarProductos(filtros);

    res.status(200).json({
        ok: true,
        mensaje: 'Productos obtenidos exitosamente.',
        total: productos.length,
        data: productos
    });
});

/**
 * @route   GET /api/productos/:id
 * @desc    Obtener detalle de un producto por ID
 * @access  Público
 */
export const getProductoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const producto = await ProductoService.obtenerPorId(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Producto obtenido exitosamente.',
        data: producto
    });
});

/**
 * @route   POST /api/productos
 * @desc    Crear un nuevo producto
 * @access  Público
 */
export const createProducto = asyncHandler(async (req, res) => {
    const nuevoProducto = await ProductoService.crearProducto(req.body);

    res.status(201).json({
        ok: true,
        mensaje: 'Producto creado exitosamente.',
        data: nuevoProducto
    });
});

/**
 * @route   PUT /api/productos/:id
 * @desc    Actualizar los datos de un producto existente
 * @access  Público
 */
export const updateProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const productoActualizado = await ProductoService.actualizarProducto(id, req.body);

    res.status(200).json({
        ok: true,
        mensaje: 'Producto actualizado exitosamente.',
        data: productoActualizado
    });
});

/**
 * @route   DELETE /api/productos/:id
 * @desc    Desactivar un producto (Soft Delete)
 * @access  Público
 */
export const deleteProducto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const productoEliminado = await ProductoService.eliminarProducto(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Producto eliminado (desactivado) exitosamente.',
        data: productoEliminado
    });
});
