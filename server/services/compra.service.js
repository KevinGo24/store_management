import pool from '../db.js';
import { CompraModel } from '../models/compra.model.js';
import { ProveedorModel } from '../models/proveedor.model.js';
import { ProductoModel } from '../models/producto.model.js';
import { InventarioService } from './inventario.service.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Capa de Servicios (Lógica de Negocio) para el Módulo de Compras
 *
 * DECISIÓN ARQUITECTÓNICA:
 * Este módulo NO modifica directamente el stock de los productos.
 * Toda modificación de existencias se delega a InventarioService.registrarMovimiento(),
 * que garantiza: (1) actualización atómica del stock, (2) registro de auditoría en
 * Movimientos_Inventario, (3) compatibilidad con el cliente transaccional PostgreSQL.
 */
export const CompraService = {

    /**
     * Listar compras con filtros opcionales
     */
    async listarCompras(filtros = {}) {
        return await CompraModel.findAll(filtros);
    },

    /**
     * Obtener una compra por ID con sus ítems detallados
     */
    async obtenerPorId(id) {
        const compra = await CompraModel.findById(id);
        if (!compra) {
            throw new AppError(`No se encontró la orden de compra con el ID ${id}.`, 404);
        }
        return compra;
    },

    /**
     * Registrar una nueva orden de compra con transacción relacional.
     * Si el estado inicial es 'Recibida', registra las entradas de inventario
     * a través de InventarioService (nunca directamente sobre ProductoModel).
     */
    async crearCompra(datos) {
        const {
            id_proveedor,
            numero_compra,
            detalles,
            impuesto = 0.00,
            descuento = 0.00,
            estado = 'Pendiente',
            observaciones
        } = datos;

        // 1. Validar existencia y estado del Proveedor
        const proveedorExistente = await ProveedorModel.findById(id_proveedor);
        if (!proveedorExistente) {
            throw new AppError(`El proveedor con ID ${id_proveedor} no existe.`, 400);
        }
        if (!proveedorExistente.activo) {
            throw new AppError(`No se puede registrar una compra a un proveedor inactivo.`, 400);
        }

        // 2. Generar o validar número de compra único
        let numCompra = numero_compra;
        if (!numCompra) {
            numCompra = `CMP-${Date.now()}`;
        } else {
            const existeNumero = await CompraModel.findByNumeroCompra(numCompra);
            if (existeNumero) {
                throw new AppError(`El número de compra '${numCompra}' ya está registrado.`, 409);
            }
        }

        // 3. Validar productos de los detalles y calcular subtotales
        let subtotalCalculado = 0;
        const detallesProcesados = [];

        for (const item of detalles) {
            const producto = await ProductoModel.findById(item.id_producto);
            if (!producto) {
                throw new AppError(`El producto con ID ${item.id_producto} no existe.`, 400);
            }
            if (!producto.activo) {
                throw new AppError(
                    `El producto '${producto.nombre}' se encuentra inactivo y no puede ser comprado.`, 400
                );
            }

            const subtotalItem = Number((item.cantidad * item.precio_unitario).toFixed(2));
            subtotalCalculado += subtotalItem;

            detallesProcesados.push({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario,
                subtotal: subtotalItem
            });
        }

        const subtotal = Number(subtotalCalculado.toFixed(2));
        const totalCalculado = Number((subtotal + impuesto - descuento).toFixed(2));

        if (totalCalculado < 0) {
            throw new AppError('El total de la compra no puede ser un valor negativo.', 400);
        }

        // 4. Iniciar Transacción PostgreSQL
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Insertar Encabezado de la Compra
            const nuevaCompra = await CompraModel.createHeader(client, {
                id_proveedor,
                numero_compra: numCompra,
                subtotal,
                impuesto,
                descuento,
                total: totalCalculado,
                estado,
                observaciones
            });

            // Insertar Detalles y, si aplica, registrar movimientos de Inventario
            const detallesGuardados = [];
            for (const item of detallesProcesados) {
                const detalleGuardado = await CompraModel.createDetail(client, {
                    id_compra: nuevaCompra.id_compra,
                    ...item
                });
                detallesGuardados.push(detalleGuardado);

                // Si la compra se crea directamente en 'Recibida', registrar Entrada en Inventario.
                // Se pasa el cliente transaccional (client) para mantener atomicidad total.
                if (estado === 'Recibida') {
                    await InventarioService.registrarMovimiento({
                        id_producto: item.id_producto,
                        tipo_movimiento: 'Entrada',
                        origen: 'Compra',
                        referencia: numCompra,
                        cantidad: item.cantidad,
                        costo_unitario: item.precio_unitario,
                        observacion: `Ingreso directo por Orden de Compra ${numCompra}`,
                        usuario_responsable: 'Sistema'
                    }, client);
                }
            }

            await client.query('COMMIT');

            nuevaCompra.detalles = detallesGuardados;
            return nuevaCompra;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Cambiar estado de una compra (Pendiente ➔ Recibida ➔ Cancelada).
     *
     * Cuando el cambio implica movimiento de stock, toda la operación
     * (movimientos de Inventario + actualización de estado de Compra) ocurre
     * dentro de una única transacción PostgreSQL para garantizar atomicidad total.
     */
    async cambiarEstadoCompra(id, nuevoEstado) {
        const compraExistente = await CompraModel.findById(id);
        if (!compraExistente) {
            throw new AppError(`No se encontró la compra con el ID ${id}.`, 404);
        }

        const estadoActual = compraExistente.estado;

        // Validaciones de reglas de negocio
        if (estadoActual === nuevoEstado) {
            throw new AppError(`La compra ya se encuentra en estado '${nuevoEstado}'.`, 400);
        }

        if (estadoActual === 'Cancelada') {
            throw new AppError('No se puede cambiar el estado de una compra que ha sido cancelada.', 400);
        }

        // Determinar si el cambio requiere movimientos de Inventario
        const requiereMovimientoInventario =
            (estadoActual === 'Pendiente' && nuevoEstado === 'Recibida') ||
            (estadoActual === 'Recibida'  && nuevoEstado === 'Cancelada');

        // Transición simple sin afectar inventario (ej. Pendiente → Cancelada)
        if (!requiereMovimientoInventario) {
            return await CompraModel.updateEstado(id, nuevoEstado);
        }

        // Transición con afectación de inventario → transacción para atomicidad total
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const item of compraExistente.detalles) {

                if (estadoActual === 'Pendiente' && nuevoEstado === 'Recibida') {
                    // A. Pendiente → Recibida: Entrada de mercancía al inventario
                    await InventarioService.registrarMovimiento({
                        id_producto: item.id_producto,
                        tipo_movimiento: 'Entrada',
                        origen: 'Compra',
                        referencia: compraExistente.numero_compra,
                        cantidad: item.cantidad,
                        costo_unitario: item.precio_unitario,
                        observacion: `Recepción de Orden de Compra ${compraExistente.numero_compra}`,
                        usuario_responsable: 'Sistema'
                    }, client);

                } else if (estadoActual === 'Recibida' && nuevoEstado === 'Cancelada') {
                    // B. Recibida → Cancelada: Reversión de stock mediante Devolución
                    await InventarioService.registrarMovimiento({
                        id_producto: item.id_producto,
                        tipo_movimiento: 'Salida',
                        origen: 'Devolucion',
                        referencia: compraExistente.numero_compra,
                        cantidad: item.cantidad,
                        costo_unitario: item.precio_unitario,
                        observacion: `Reversión por cancelación de Compra ${compraExistente.numero_compra}`,
                        usuario_responsable: 'Sistema'
                    }, client);
                }
            }

            // Actualizar el estado de la compra dentro de la misma transacción
            const compraActualizada = await CompraModel.updateEstado(id, nuevoEstado, client);

            await client.query('COMMIT');
            return compraActualizada;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
};
