import { CategoriaService } from '../services/categoria.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador de peticiones HTTP para el módulo de Categorías
 */

/**
 * @route   GET /api/categorias
 * @desc    Obtener lista de categorías
 * @access  Público
 */
export const getCategorias = asyncHandler(async (req, res) => {
    const incluirInactivos = req.query.incluirInactivos === 'true';
    const categorias = await CategoriaService.listarCategorias(incluirInactivos);

    res.status(200).json({
        ok: true,
        mensaje: 'Categorías obtenidas exitosamente.',
        total: categorias.length,
        data: categorias
    });
});

/**
 * @route   GET /api/categorias/:id
 * @desc    Obtener una categoría específica por ID
 * @access  Público
 */
export const getCategoriaById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const categoria = await CategoriaService.obtenerPorId(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Categoría obtenida exitosamente.',
        data: categoria
    });
});

/**
 * @route   POST /api/categorias
 * @desc    Crear una nueva categoría
 * @access  Público
 */
export const createCategoria = asyncHandler(async (req, res) => {
    const nuevaCategoria = await CategoriaService.crearCategoria(req.body);

    res.status(201).json({
        ok: true,
        mensaje: 'Categoría creada exitosamente.',
        data: nuevaCategoria
    });
});

/**
 * @route   PUT /api/categorias/:id
 * @desc    Actualizar los datos de una categoría
 * @access  Público
 */
export const updateCategoria = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const categoriaActualizada = await CategoriaService.actualizarCategoria(id, req.body);

    res.status(200).json({
        ok: true,
        mensaje: 'Categoría actualizada exitosamente.',
        data: categoriaActualizada
    });
});

/**
 * @route   DELETE /api/categorias/:id
 * @desc    Desactivar (soft delete) una categoría
 * @access  Público
 */
export const deleteCategoria = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const categoriaEliminada = await CategoriaService.eliminarCategoria(id);

    res.status(200).json({
        ok: true,
        mensaje: 'Categoría eliminada (desactivada) exitosamente.',
        data: categoriaEliminada
    });
});
