import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para el Módulo de Inventario
 */
export const InventarioModel = {
    /**
     * Registrar un nuevo movimiento en la bitácora de auditoría Movimientos_Inventario
     * (Soporta cliente de transacción o pool directo)
     */
    async createMovimiento(dbClient, datos) {
        const client = dbClient || pool;

        const {
            id_producto,
            tipo_movimiento,
            origen,
            referencia,
            cantidad,
            stock_anterior,
            stock_nuevo,
            costo_unitario,
            observacion,
            usuario_responsable
        } = datos;

        const query = `
            INSERT INTO Movimientos_Inventario (
                id_producto, tipo_movimiento, origen, referencia, cantidad,
                stock_anterior, stock_nuevo, costo_unitario, observacion, usuario_responsable
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        const values = [
            id_producto,
            tipo_movimiento,
            origen,
            referencia || null,
            cantidad,
            stock_anterior,
            stock_nuevo,
            costo_unitario || 0.00,
            observacion || null,
            usuario_responsable || 'Sistema'
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    },

    /**
     * Obtener el historial completo de movimientos con filtros y JOIN a Productos y Categorías
     */
    async findMovimientos(filtros = {}) {
        const { id_producto, tipo_movimiento, origen, buscar, limite = 100 } = filtros;

        let query = `
            SELECT 
                m.*,
                p.nombre AS nombre_producto,
                p.codigo AS codigo_producto,
                p.unidad_medida,
                COALESCE(c.nombre, 'Sin categoría') AS nombre_categoria,
                m.fecha_movimiento AS fecha_creacion,
                m.tipo_movimiento AS tipo
            FROM Movimientos_Inventario m
            INNER JOIN Productos p ON m.id_producto = p.id_producto
            LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE 1=1
        `;

        const params = [];
        let index = 1;

        if (id_producto) {
            query += ` AND m.id_producto = $${index++}`;
            params.push(id_producto);
        }

        if (tipo_movimiento) {
            query += ` AND m.tipo_movimiento = $${index++}`;
            params.push(tipo_movimiento);
        }

        if (origen) {
            query += ` AND m.origen = $${index++}`;
            params.push(origen);
        }

        if (buscar) {
            query += ` AND (LOWER(p.nombre) LIKE $${index} OR LOWER(p.codigo) LIKE $${index} OR LOWER(COALESCE(m.referencia, '')) LIKE $${index})`;
            params.push(`%${buscar.toLowerCase()}%`);
            index++;
        }

        query += ` ORDER BY m.id_movimiento DESC LIMIT $${index}`;
        params.push(limite);

        const result = await pool.query(query, params);
        return result.rows;
    },

    /**
     * Buscar movimiento por ID
     */
    async findById(id) {
        const query = `
            SELECT 
                m.*,
                p.nombre AS nombre_producto,
                p.codigo AS codigo_producto,
                p.unidad_medida
            FROM Movimientos_Inventario m
            INNER JOIN Productos p ON m.id_producto = p.id_producto
            WHERE m.id_movimiento = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Consulta consolidada de métricas del Dashboard de Inventarios
     */
    async getMetricsSummary() {
        // 1. Resumen global de productos e inventario
        const queryResumen = `
            SELECT 
                COUNT(*) AS total_productos,
                COALESCE(SUM(stock_actual * precio_compra), 0) AS valor_inventario_costo,
                COALESCE(SUM(stock_actual * precio_venta), 0) AS valor_inventario_venta,
                COUNT(*) FILTER (WHERE stock_actual = 0 AND activo = TRUE) AS productos_agotados,
                COUNT(*) FILTER (WHERE stock_actual > 0 AND stock_actual <= stock_minimo AND activo = TRUE) AS existencias_bajas
            FROM Productos
            WHERE activo = TRUE
        `;
        const resumenResult = await pool.query(queryResumen);

        // 2. Tabla de alertas de reabastecimiento (Productos urgentes)
        const queryAlertas = `
            SELECT 
                id_producto,
                nombre,
                codigo AS sku,
                stock_actual,
                stock_minimo,
                CASE 
                    WHEN stock_actual = 0 THEN 'AGOTADO'
                    WHEN stock_actual <= stock_minimo THEN 'URGENTE'
                    ELSE 'OK'
                END AS estatus
            FROM Productos
            WHERE stock_actual <= stock_minimo AND activo = TRUE
            ORDER BY stock_actual ASC
            LIMIT 10
        `;
        const alertasResult = await pool.query(queryAlertas);

        // 3. Últimos 5 movimientos
        const queryUltimosMovimientos = `
            SELECT 
                m.id_movimiento,
                m.tipo_movimiento,
                m.origen,
                m.cantidad,
                m.fecha_movimiento,
                p.nombre AS producto,
                m.usuario_responsable AS usuario
            FROM Movimientos_Inventario m
            INNER JOIN Productos p ON m.id_producto = p.id_producto
            ORDER BY m.id_movimiento DESC
            LIMIT 5
        `;
        const movimientosResult = await pool.query(queryUltimosMovimientos);

        // 4. Productos con mayor rotación (frecuencia de movimiento)
        const queryRotacion = `
            SELECT 
                p.id_producto,
                p.nombre AS producto,
                p.codigo AS sku,
                COUNT(m.id_movimiento) AS total_movimientos,
                COALESCE(SUM(m.cantidad), 0) AS total_unidades_movidas
            FROM Movimientos_Inventario m
            INNER JOIN Productos p ON m.id_producto = p.id_producto
            GROUP BY p.id_producto, p.nombre, p.codigo
            ORDER BY total_unidades_movidas DESC
            LIMIT 5
        `;
        const rotacionResult = await pool.query(queryRotacion);

        return {
            kpis: resumenResult.rows[0],
            tablas: {
                alertasReabastecimiento: alertasResult.rows,
                ultimosMovimientos: movimientosResult.rows,
                productosMayorRotacion: rotacionResult.rows
            }
        };
    }
};
