import { CategoriaModel } from '../models/categoria.model.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Capa de Servicios (Lógica de Negocio) para el Módulo de Categorías
 */
export const CategoriaService = {
    /**
     * Listar todas las categorías
     */
    async listarCategorias(incluirInactivos = false) {
        return await CategoriaModel.findAll(incluirInactivos);
    },

    /**
     * Obtener una categoría por su ID
     */
    async obtenerPorId(id) {
        const categoria = await CategoriaModel.findById(id);
        if (!categoria) {
            throw new AppError(`No se encontró la categoría con el ID ${id}.`, 404);
        }
        return categoria;
    },

    /**
     * Registrar una nueva categoría
     */
    async crearCategoria(datos) {
        // Verificar si ya existe una categoría con el mismo nombre
        const existeNombre = await CategoriaModel.findByNombre(datos.nombre);
        if (existeNombre) {
            throw new AppError(`Ya existe una categoría registrada con el nombre '${datos.nombre}'.`, 409);
        }

        return await CategoriaModel.create(datos);
    },

    /**
     * Actualizar una categoría existente
     */
    async actualizarCategoria(id, datos) {
        // 1. Verificar existencia de la categoría
        const categoriaExistente = await CategoriaModel.findById(id);
        if (!categoriaExistente) {
            throw new AppError(`No se encontró la categoría con el ID ${id} para actualizar.`, 404);
        }

        // 2. Si se desea cambiar el nombre, verificar que no colisione con otra categoría
        if (datos.nombre && datos.nombre.toLowerCase() !== categoriaExistente.nombre.toLowerCase()) {
            const existeNombre = await CategoriaModel.findByNombre(datos.nombre);
            if (existeNombre && existeNombre.id_categoria !== id) {
                throw new AppError(`El nombre '${datos.nombre}' ya está siendo utilizado por otra categoría.`, 409);
            }
        }

        return await CategoriaModel.update(id, datos);
    },

    /**
     * Eliminar (desactivar) una categoría (Soft Delete)
     */
    async eliminarCategoria(id) {
        // Verificar existencia
        const categoriaExistente = await CategoriaModel.findById(id);
        if (!categoriaExistente) {
            throw new AppError(`No se encontró la categoría con el ID ${id} para eliminar.`, 404);
        }

        if (!categoriaExistente.activo) {
            throw new AppError(`La categoría con el ID ${id} ya se encuentra inactiva.`, 400);
        }

        return await CategoriaModel.deleteSoft(id);
    }
};
