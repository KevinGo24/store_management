import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para la entidad Ventas y Detalle_Ventas
 */
export const VentaModel = {

    /**
     * Obtener listado de ventas con filtros opcionales
     * @param {object} filtros - { estado, buscar, fecha_inicio, fecha_fin }
     */
    async findAll(filtros = {}) {
        const { estado, buscar, fecha_inicio, fecha_fin } = filtros;

        let query = `
            SELECT
                v.*,
                COUNT(dv.id_detalle_venta)::INT AS total_items
            FROM Ventas v
            LEFT JOIN Detalle_Ventas dv ON v.id_venta = dv.id_venta
            WHERE 1=1
        `;

        const params = [];
        let index = 1;

        if (estado) {
            query += ` AND v.estado = $${index++}`;
            params.push(estado);
        }

        if (buscar) {
            query += ` AND (
                LOWER(v.numero_venta)                        LIKE $${index} OR
                LOWER(COALESCE(v.nombre_cliente,    ''))     LIKE $${index} OR
                LOWER(COALESCE(v.documento_cliente, ''))     LIKE $${index}
            )`;
            params.push(`%${buscar.toLowerCase()}%`);
            index++;
        }

        if (fecha_inicio) {
            query += ` AND v.fecha_venta >= $${index++}`;
            params.push(fecha_inicio);
        }

        if (fecha_fin) {
            query += ` AND v.fecha_venta <= $${index++}`;
            params.push(fecha_fin);
        }

        query += ` GROUP BY v.id_venta ORDER BY v.id_venta DESC`;

        const result = await pool.query(query, params);
        return result.rows;
    },

    /**
     * Obtener venta por ID con su Detalle completo e información de Productos
     * @param {number} id
     */
    async findById(id) {
        // Encabezado
        const headerResult = await pool.query(
            `SELECT * FROM Ventas WHERE id_venta = $1`,
            [id]
        );
        const venta = headerResult.rows[0];
        if (!venta) return null;

        // Detalles con nombre y código de producto
        const detailsResult = await pool.query(
            `SELECT
                dv.*,
                p.nombre        AS nombre_producto,
                p.codigo        AS codigo_producto,
                p.unidad_medida,
                p.imagen_url
            FROM Detalle_Ventas dv
            INNER JOIN Productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = $1
            ORDER BY dv.id_detalle_venta ASC`,
            [id]
        );
        venta.detalles = detailsResult.rows;
        return venta;
    },

    /**
     * Buscar venta por número único
     * @param {string} numero_venta
     */
    async findByNumeroVenta(numero_venta) {
        const result = await pool.query(
            `SELECT * FROM Ventas WHERE LOWER(numero_venta) = LOWER($1)`,
            [numero_venta]
        );
        return result.rows[0] || null;
    },

    /**
     * Insertar el encabezado de una venta (soporta cliente transaccional)
     * @param {object} dbClient - Cliente de transacción PostgreSQL
     * @param {object} datos
     */
    async createHeader(dbClient, datos) {
        const {
            numero_venta,
            nombre_cliente,
            documento_cliente,
            subtotal,
            impuesto,
            descuento,
            total,
            estado,
            observaciones
        } = datos;

        const query = `
            INSERT INTO Ventas (
                numero_venta, nombre_cliente, documento_cliente,
                subtotal, impuesto, descuento, total, estado, observaciones
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;

        const values = [
            numero_venta,
            nombre_cliente   || null,
            documento_cliente || null,
            subtotal,
            impuesto,
            descuento,
            total,
            estado || 'Completada',
            observaciones    || null
        ];

        const result = await dbClient.query(query, values);
        return result.rows[0];
    },

    /**
     * Insertar un ítem en Detalle_Ventas (soporta cliente transaccional)
     * @param {object} dbClient
     * @param {object} datos - { id_venta, id_producto, cantidad, precio_unitario, subtotal }
     */
    async createDetail(dbClient, datos) {
        const { id_venta, id_producto, cantidad, precio_unitario, subtotal } = datos;

        const query = `
            INSERT INTO Detalle_Ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const result = await dbClient.query(query, [
            id_venta,
            id_producto,
            cantidad,
            precio_unitario,
            subtotal
        ]);
        return result.rows[0];
    },

    /**
     * Actualizar el estado de una venta.
     * @param {number} id
     * @param {string} nuevoEstado
     * @param {object|null} dbClient - Cliente transaccional opcional para atomicidad.
     */
    async updateEstado(id, nuevoEstado, dbClient = null) {
        const client = dbClient || pool;
        const result = await client.query(
            `UPDATE Ventas SET estado = $1 WHERE id_venta = $2 RETURNING *`,
            [nuevoEstado, id]
        );
        return result.rows[0] || null;
    }
};
