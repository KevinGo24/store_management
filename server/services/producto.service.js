import { ProductoModel } from '../models/producto.model.js';
import { CategoriaModel } from '../models/categoria.model.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Capa de Servicios (Lógica de Negocio) para la entidad Productos
 */
export const ProductoService = {
    /**
     * Listar productos con opción de filtros (categoría, búsqueda por texto, alerta de stock)
     */
    async listarProductos(filtros = {}) {
        return await ProductoModel.findAll(filtros);
    },

    /**
     * Obtener un producto por su ID
     */
    async obtenerPorId(id) {
        const producto = await ProductoModel.findById(id);
        if (!producto) {
            throw new AppError(`No se encontró el producto con el ID ${id}.`, 404);
        }
        return producto;
    },

    /**
     * Registrar un nuevo producto
     */
    async crearProducto(datos) {
        // 1. Validar que la categoría asignada exista
        const categoriaExistente = await CategoriaModel.findById(datos.id_categoria);
        if (!categoriaExistente) {
            throw new AppError(`La categoría con ID ${datos.id_categoria} no existe.`, 400);
        }

        if (!categoriaExistente.activo) {
            throw new AppError(`No se puede asignar el producto a una categoría inactiva.`, 400);
        }

        // 2. Verificar que el código (SKU) sea único
        const existeCodigo = await ProductoModel.findByCodigo(datos.codigo);
        if (existeCodigo) {
            throw new AppError(`Ya existe un producto registrado con el código SKU '${datos.codigo}'.`, 409);
        }

        // 3. Verificar código de barras si se proporciona
        if (datos.codigo_barras) {
            const existeBarras = await ProductoModel.findByCodigoBarras(datos.codigo_barras);
            if (existeBarras) {
                throw new AppError(`El código de barras '${datos.codigo_barras}' ya está asignado a otro producto.`, 409);
            }
        }

        return await ProductoModel.create(datos);
    },

    /**
     * Actualizar datos de un producto
     */
    async actualizarProducto(id, datos) {
        // 1. Verificar existencia del producto
        const productoExistente = await ProductoModel.findById(id);
        if (!productoExistente) {
            throw new AppError(`No se encontró el producto con el ID ${id} para actualizar.`, 404);
        }

        // 2. Si se cambia la categoría, verificar su existencia
        if (datos.id_categoria && datos.id_categoria !== productoExistente.id_categoria) {
            const categoriaExistente = await CategoriaModel.findById(datos.id_categoria);
            if (!categoriaExistente) {
                throw new AppError(`La nueva categoría con ID ${datos.id_categoria} no existe.`, 400);
            }
            if (!categoriaExistente.activo) {
                throw new AppError(`No se puede asignar el producto a una categoría inactiva.`, 400);
            }
        }

        // 3. Si se cambia el código (SKU), verificar unicidad
        if (datos.codigo && datos.codigo.toLowerCase() !== productoExistente.codigo.toLowerCase()) {
            const existeCodigo = await ProductoModel.findByCodigo(datos.codigo);
            if (existeCodigo && existeCodigo.id_producto !== id) {
                throw new AppError(`El código SKU '${datos.codigo}' ya pertenece a otro producto.`, 409);
            }
        }

        // 4. Si se cambia el código de barras, verificar unicidad
        if (datos.codigo_barras && datos.codigo_barras !== productoExistente.codigo_barras) {
            const existeBarras = await ProductoModel.findByCodigoBarras(datos.codigo_barras);
            if (existeBarras && existeBarras.id_producto !== id) {
                throw new AppError(`El código de barras '${datos.codigo_barras}' ya pertenece a otro producto.`, 409);
            }
        }

        return await ProductoModel.update(id, datos);
    },

    /**
     * Desactivar un producto (Soft Delete)
     */
    async eliminarProducto(id) {
        const productoExistente = await ProductoModel.findById(id);
        if (!productoExistente) {
            throw new AppError(`No se encontró el producto con el ID ${id} para eliminar.`, 404);
        }

        if (!productoExistente.activo) {
            throw new AppError(`El producto con ID ${id} ya se encuentra inactivo.`, 400);
        }

        return await ProductoModel.deleteSoft(id);
    }
};
