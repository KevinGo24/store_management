import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para la entidad Compras y Detalle_Compras
 */
export const CompraModel = {
    /**
     * Obtener listado de compras con información de Proveedor y filtros
     */
    async findAll(filtros = {}) {
        const { id_proveedor, estado, buscar } = filtros;

        let query = `
            SELECT 
                c.*,
                p.nombre AS nombre_proveedor,
                p.nit AS nit_proveedor
            FROM Compras c
            INNER JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
            WHERE 1=1
        `;

        const params = [];
        let index = 1;

        if (id_proveedor) {
            query += ` AND c.id_proveedor = $${index++}`;
            params.push(id_proveedor);
        }

        if (estado) {
            query += ` AND c.estado = $${index++}`;
            params.push(estado);
        }

        if (buscar) {
            query += ` AND (LOWER(c.numero_compra) LIKE $${index} OR LOWER(p.nombre) LIKE $${index} OR LOWER(p.nit) LIKE $${index})`;
            params.push(`%${buscar.toLowerCase()}%`);
            index++;
        }

        query += ` ORDER BY c.id_compra DESC`;

        const result = await pool.query(query, params);
        return result.rows;
    },

    /**
     * Obtener compra por ID con su Proveedor y la lista completa de sus ítems (detalles)
     */
    async findById(id) {
        const queryHeader = `
            SELECT 
                c.*,
                p.nombre AS nombre_proveedor,
                p.nit AS nit_proveedor,
                p.correo AS correo_proveedor,
                p.telefono AS telefono_proveedor,
                p.condiciones_pago
            FROM Compras c
            INNER JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
            WHERE c.id_compra = $1
        `;

        const headerResult = await pool.query(queryHeader, [id]);
        const compra = headerResult.rows[0];

        if (!compra) return null;

        const queryDetails = `
            SELECT 
                dc.*,
                prod.nombre AS nombre_producto,
                prod.codigo AS codigo_producto,
                prod.unidad_medida,
                prod.imagen_url
            FROM Detalle_Compras dc
            INNER JOIN Productos prod ON dc.id_producto = prod.id_producto
            WHERE dc.id_compra = $1
            ORDER BY dc.id_detalle_compra ASC
        `;

        const detailsResult = await pool.query(queryDetails, [id]);
        compra.detalles = detailsResult.rows;

        return compra;
    },

    /**
     * Buscar compra por Número de Compra
     */
    async findByNumeroCompra(numero_compra) {
        const query = 'SELECT * FROM Compras WHERE LOWER(numero_compra) = LOWER($1)';
        const result = await pool.query(query, [numero_compra]);
        return result.rows[0] || null;
    },

    /**
     * Obtener únicamente la lista de detalles de una compra (útil para el ajuste automático de stock)
     */
    async getDetallesByCompraId(id_compra) {
        const query = 'SELECT * FROM Detalle_Compras WHERE id_compra = $1';
        const result = await pool.query(query, [id_compra]);
        return result.rows;
    },

    /**
     * Insertar el encabezado de compra (soporta cliente de transacción)
     */
    async createHeader(dbClient, datos) {
        const {
            id_proveedor,
            numero_compra,
            subtotal,
            impuesto,
            descuento,
            total,
            estado,
            observaciones
        } = datos;

        const query = `
            INSERT INTO Compras (
                id_proveedor, numero_compra, subtotal, impuesto, descuento, total, estado, observaciones
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const values = [
            id_proveedor,
            numero_compra,
            subtotal,
            impuesto,
            descuento,
            total,
            estado || 'Pendiente',
            observaciones || null
        ];

        const result = await dbClient.query(query, values);
        return result.rows[0];
    },

    /**
     * Insertar un ítem individual en Detalle_Compras (soporta cliente de transacción)
     */
    async createDetail(dbClient, datos) {
        const { id_compra, id_producto, cantidad, precio_unitario, subtotal } = datos;

        const query = `
            INSERT INTO Detalle_Compras (id_compra, id_producto, cantidad, precio_unitario, subtotal)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const result = await dbClient.query(query, [
            id_compra,
            id_producto,
            cantidad,
            precio_unitario,
            subtotal
        ]);

        return result.rows[0];
    },

    /**
     * Actualizar el estado de una orden de compra.
     * @param {number} id - ID de la compra.
     * @param {string} nuevoEstado - Estado destino.
     * @param {object|null} dbClient - Cliente transaccional opcional. Si se pasa,
     *   la operación se ejecuta dentro de la transacción activa del llamador.
     */
    async updateEstado(id, nuevoEstado, dbClient = null) {
        const client = dbClient || pool;
        const query = `
            UPDATE Compras
            SET estado = $1
            WHERE id_compra = $2
            RETURNING *
        `;
        const result = await client.query(query, [nuevoEstado, id]);
        return result.rows[0] || null;
    }
};
