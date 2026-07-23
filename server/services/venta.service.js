import pool from '../db.js';
import { VentaModel } from '../models/venta.model.js';
import { ProductoModel } from '../models/producto.model.js';
import { InventarioService } from './inventario.service.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Capa de Servicios (Lógica de Negocio) para el Módulo de Ventas
 *
 * DECISIÓN ARQUITECTÓNICA:
 * Al igual que Compras, este módulo NO modifica directamente el stock.
 * Toda salida de inventario generada por una venta se registra mediante
 * InventarioService.registrarMovimiento() con tipo_movimiento='Salida', origen='Venta'.
 * Esto garantiza trazabilidad completa en Movimientos_Inventario.
 */
export const VentaService = {

    /**
     * Listar ventas con filtros opcionales
     */
    async listarVentas(filtros = {}) {
        return await VentaModel.findAll(filtros);
    },

    /**
     * Obtener una venta por su ID con detalles completos
     */
    async obtenerPorId(id) {
        const venta = await VentaModel.findById(id);
        if (!venta) {
            throw new AppError(`No se encontró la venta con el ID ${id}.`, 404);
        }
        return venta;
    },

    /**
     * Registrar una nueva venta.
     *
     * Flujo:
     *  1. Validar existencia y stock de cada producto.
     *  2. Calcular subtotales y total.
     *  3. BEGIN transacción.
     *  4. Insertar encabezado Venta.
     *  5. Para cada ítem: insertar Detalle_Venta + InventarioService.registrarMovimiento(Salida).
     *  6. COMMIT.
     */
    async crearVenta(datos) {
        const {
            numero_venta,
            nombre_cliente,
            documento_cliente,
            detalles,
            impuesto  = 0.00,
            descuento = 0.00,
            observaciones
        } = datos;

        // 1. Generar o validar número de venta único
        let numVenta = numero_venta;
        if (!numVenta) {
            numVenta = `VNT-${Date.now()}`;
        } else {
            const existeNumero = await VentaModel.findByNumeroVenta(numVenta);
            if (existeNumero) {
                throw new AppError(`El número de venta '${numVenta}' ya está registrado.`, 409);
            }
        }

        // 2. Validar productos y verificar stock disponible antes de iniciar la transacción
        let subtotalCalculado = 0;
        const detallesProcesados = [];

        for (const item of detalles) {
            const producto = await ProductoModel.findById(item.id_producto);
            if (!producto) {
                throw new AppError(`El producto con ID ${item.id_producto} no existe.`, 400);
            }
            if (!producto.activo) {
                throw new AppError(
                    `El producto '${producto.nombre}' se encuentra inactivo y no puede ser vendido.`, 400
                );
            }
            if (producto.stock_actual < item.cantidad) {
                throw new AppError(
                    `Stock insuficiente para '${producto.nombre}'. ` +
                    `Stock actual: ${producto.stock_actual}, cantidad solicitada: ${item.cantidad}.`,
                    400
                );
            }

            const subtotalItem = Number((item.cantidad * item.precio_unitario).toFixed(2));
            subtotalCalculado += subtotalItem;

            detallesProcesados.push({
                id_producto:     item.id_producto,
                cantidad:        item.cantidad,
                precio_unitario: item.precio_unitario,
                subtotal:        subtotalItem,
                // Guardamos el costo de compra del producto para registrarlo en el movimiento
                costo_unitario:  Number(producto.precio_compra)
            });
        }

        const subtotal        = Number(subtotalCalculado.toFixed(2));
        const totalCalculado  = Number((subtotal + impuesto - descuento).toFixed(2));

        if (totalCalculado < 0) {
            throw new AppError('El total de la venta no puede ser un valor negativo.', 400);
        }

        // 3. Iniciar Transacción PostgreSQL
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Insertar Encabezado de la Venta
            const nuevaVenta = await VentaModel.createHeader(client, {
                numero_venta:     numVenta,
                nombre_cliente,
                documento_cliente,
                subtotal,
                impuesto,
                descuento,
                total:            totalCalculado,
                estado:           'Completada',
                observaciones
            });

            // Insertar Detalles y registrar Salida en Inventario (dentro de la misma transacción)
            const detallesGuardados = [];
            for (const item of detallesProcesados) {
                const detalleGuardado = await VentaModel.createDetail(client, {
                    id_venta:        nuevaVenta.id_venta,
                    id_producto:     item.id_producto,
                    cantidad:        item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal:        item.subtotal
                });
                detallesGuardados.push(detalleGuardado);

                // Registrar Salida en Inventario — la única forma autorizada de reducir stock
                await InventarioService.registrarMovimiento({
                    id_producto:         item.id_producto,
                    tipo_movimiento:     'Salida',
                    origen:              'Venta',
                    referencia:          numVenta,
                    cantidad:            item.cantidad,
                    costo_unitario:      item.costo_unitario,
                    observacion:         `Salida por Venta ${numVenta}`,
                    usuario_responsable: 'Sistema'
                }, client);
            }

            await client.query('COMMIT');

            nuevaVenta.detalles = detallesGuardados;
            return nuevaVenta;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Cancelar una venta completada.
     *
     * Solo se permite cancelar ventas en estado 'Completada'.
     * La cancelación revierte el inventario mediante una Devolución,
     * todo dentro de una transacción para garantizar atomicidad.
     */
    async cancelarVenta(id) {
        const ventaExistente = await VentaModel.findById(id);
        if (!ventaExistente) {
            throw new AppError(`No se encontró la venta con el ID ${id}.`, 404);
        }

        if (ventaExistente.estado === 'Cancelada') {
            throw new AppError('La venta ya se encuentra cancelada.', 400);
        }

        // Iniciar transacción: revertir inventario + actualizar estado en forma atómica
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const item of ventaExistente.detalles) {
                // Registrar Entrada de Devolución — restaura el stock reducido por la venta
                await InventarioService.registrarMovimiento({
                    id_producto:         item.id_producto,
                    tipo_movimiento:     'Entrada',
                    origen:              'Devolucion',
                    referencia:          ventaExistente.numero_venta,
                    cantidad:            item.cantidad,
                    costo_unitario:      0, // En devoluciones no se recalcula el costo
                    observacion:         `Reversión por cancelación de Venta ${ventaExistente.numero_venta}`,
                    usuario_responsable: 'Sistema'
                }, client);
            }

            const ventaActualizada = await VentaModel.updateEstado(id, 'Cancelada', client);

            await client.query('COMMIT');
            return ventaActualizada;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
};
