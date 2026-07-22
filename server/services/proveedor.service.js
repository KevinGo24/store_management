import { ProveedorModel } from '../models/proveedor.model.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Capa de Servicios (Lógica de Negocio) para la entidad Proveedores
 */
export const ProveedorService = {
    /**
     * Listar todos los proveedores
     */
    async listarProveedores(filtros = {}) {
        return await ProveedorModel.findAll(filtros);
    },

    /**
     * Obtener un proveedor por su ID
     */
    async obtenerPorId(id) {
        const proveedor = await ProveedorModel.findById(id);
        if (!proveedor) {
            throw new AppError(`No se encontró el proveedor con el ID ${id}.`, 404);
        }
        return proveedor;
    },

    /**
     * Registrar un nuevo proveedor
     */
    async crearProveedor(datos) {
        // Verificar unicidad de NIT / Identificación Fiscal
        const existeNit = await ProveedorModel.findByNit(datos.nit);
        if (existeNit) {
            throw new AppError(`Ya existe un proveedor registrado con el NIT '${datos.nit}'.`, 409);
        }

        return await ProveedorModel.create(datos);
    },

    /**
     * Actualizar datos de un proveedor
     */
    async actualizarProveedor(id, datos) {
        // 1. Verificar existencia del proveedor
        const proveedorExistente = await ProveedorModel.findById(id);
        if (!proveedorExistente) {
            throw new AppError(`No se encontró el proveedor con el ID ${id} para actualizar.`, 404);
        }

        // 2. Si se actualiza el NIT, verificar que no pertenezca a otro proveedor
        if (datos.nit && datos.nit.toLowerCase() !== proveedorExistente.nit.toLowerCase()) {
            const existeNit = await ProveedorModel.findByNit(datos.nit);
            if (existeNit && existeNit.id_proveedor !== id) {
                throw new AppError(`El NIT '${datos.nit}' ya pertenece a otro proveedor registrado.`, 409);
            }
        }

        return await ProveedorModel.update(id, datos);
    },

    /**
     * Eliminar (desactivar) un proveedor (Soft Delete)
     */
    async eliminarProveedor(id) {
        const proveedorExistente = await ProveedorModel.findById(id);
        if (!proveedorExistente) {
            throw new AppError(`No se encontró el proveedor con el ID ${id} para eliminar.`, 404);
        }

        if (!proveedorExistente.activo) {
            throw new AppError(`El proveedor con ID ${id} ya se encuentra inactivo.`, 400);
        }

        return await ProveedorModel.deleteSoft(id);
    }
};
