import pool from '../db.js';
import { InventarioModel } from '../models/inventario.model.js';
import { ProductoModel } from '../models/producto.model.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Capa de Servicios (Lógica de Negocio) para la Gestión de Inventarios
 */
export const InventarioService = {
    /**
     * Registrar un movimiento de inventario (Entrada, Salida o Ajuste)
     * Centraliza la modificación del stock y garantiza auditoría inmutable.
     */
    async registrarMovimiento(datos, dbClient = null) {
        const {
            id_producto,
            tipo_movimiento,
            origen,
            referencia,
            cantidad,
            costo_unitario,
            observacion,
            usuario_responsable = 'Sistema'
        } = datos;

        // 1. Verificar existencia y estado del producto
        const producto = await ProductoModel.findById(id_producto);
        if (!producto) {
            throw new AppError(`No se encontró el producto con el ID ${id_producto}.`, 404);
        }
        if (!producto.activo) {
            throw new AppError(`El producto '${producto.nombre}' se encuentra inactivo.`, 400);
        }

        const stockAnterior = Number(producto.stock_actual);
        let stockNuevo = stockAnterior;

        // 2. Lógica de cálculo de stock y prevención de stock negativo
        if (tipo_movimiento === 'Entrada') {
            stockNuevo = stockAnterior + cantidad;
        } else if (tipo_movimiento === 'Salida') {
            if (stockAnterior < cantidad) {
                throw new AppError(
                    `Stock insuficiente para el producto '${producto.nombre}'. Stock actual: ${stockAnterior}, Cantidad solicitada: ${cantidad}.`,
                    400
                );
            }
            stockNuevo = stockAnterior - cantidad;
        } else if (tipo_movimiento === 'Ajuste') {
            // En un ajuste manual, cantidad representa la diferencia o el nuevo valor
            // Para mantener consistencia: si se envía un ajuste positivo/negativo o directo
            stockNuevo = cantidad; // Ajuste directo a la cantidad deseada
        }

        // Usar cliente transaccional existente o crear una nueva transacción si no viene uno
        const isExternalClient = !!dbClient;
        const client = dbClient || await pool.connect();

        try {
            if (!isExternalClient) await client.query('BEGIN');

            // Actualizar stock del producto
            await client.query(
                'UPDATE Productos SET stock_actual = $1 WHERE id_producto = $2',
                [stockNuevo, id_producto]
            );

            // Registrar movimiento en el historial
            const movimientoGuardado = await InventarioModel.createMovimiento(client, {
                id_producto,
                tipo_movimiento,
                origen,
                referencia,
                cantidad,
                stock_anterior: stockAnterior,
                stock_nuevo: stockNuevo,
                costo_unitario: costo_unitario !== undefined ? costo_unitario : producto.precio_compra,
                observacion,
                usuario_responsable
            });

            if (!isExternalClient) await client.query('COMMIT');

            movimientoGuardado.nombre_producto = producto.nombre;
            movimientoGuardado.codigo_producto = producto.codigo;
            return movimientoGuardado;

        } catch (error) {
            if (!isExternalClient) await client.query('ROLLBACK');
            throw error;
        } finally {
            if (!isExternalClient) client.release();
        }
    },

    /**
     * Consultar estado actual del stock con badges de estatus
     */
    async consultarStockActual(filtros = {}) {
        const productos = await ProductoModel.findAll(filtros);

        return productos.map(p => ({
            id_producto: p.id_producto,
            codigo: p.codigo,
            nombre: p.nombre,
            categoria: p.nombre_categoria,
            marca: p.marca,
            unidad_medida: p.unidad_medida,
            precio_compra: p.precio_compra,
            precio_venta: p.precio_venta,
            stock_actual: p.stock_actual,
            stock_minimo: p.stock_minimo,
            estatus_stock: p.stock_actual === 0
                ? 'AGOTADO'
                : p.stock_actual <= p.stock_minimo
                    ? 'ALERTA'
                    : 'NORMAL',
            valor_inventario: Number((p.stock_actual * p.precio_compra).toFixed(2))
        }));
    },

    /**
     * Obtener el historial completo de movimientos
     */
    async obtenerHistorialMovimientos(filtros = {}) {
        return await InventarioModel.findMovimientos(filtros);
    },

    /**
     * Obtener un movimiento específico por su ID
     */
    async obtenerMovimientoPorId(id) {
        const movimiento = await InventarioModel.findById(id);
        if (!movimiento) {
            throw new AppError(`No se encontró el movimiento con el ID ${id}.`, 404);
        }
        return movimiento;
    },

    /**
     * Obtener consolidados y métricas para el Dashboard de Inventario
     */
    async obtenerResumenDashboard() {
        return await InventarioModel.getMetricsSummary();
    }
};
