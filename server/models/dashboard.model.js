import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para Consultas de Agregación del Dashboard
 *
 * Módulo de Solo Lectura. No modifica tablas. Consolida e interroga la base
 * de datos de forma eficiente mediante consultas agrupadas y subconsultas.
 */
export const DashboardModel = {

    /**
     * Obtener indicadores y totales generales
     */
    async getResumenGeneral() {
        const query = `
            SELECT
                (SELECT COUNT(*)::INT FROM Productos) AS total_productos,
                (SELECT COUNT(*)::INT FROM Categorias WHERE activo = TRUE) AS total_categorias,
                (SELECT COUNT(*)::INT FROM Proveedores WHERE activo = TRUE) AS total_proveedores,
                (SELECT COALESCE(SUM(stock_actual), 0)::INT FROM Productos WHERE activo = TRUE) AS stock_total,
                (SELECT COUNT(*)::INT FROM Productos WHERE activo = TRUE) AS productos_activos,
                (SELECT COUNT(*)::INT FROM Productos WHERE stock_actual <= stock_minimo AND stock_actual > 0 AND activo = TRUE) AS productos_stock_bajo,
                (SELECT COUNT(*)::INT FROM Productos WHERE stock_actual = 0 AND activo = TRUE) AS productos_agotados,
                (SELECT COUNT(*)::INT FROM Compras) AS total_compras,
                (SELECT COUNT(*)::INT FROM Ventas) AS total_ventas
        `;
        const result = await pool.query(query);
        return result.rows[0];
    },

    /**
     * Obtener métricas e información del Inventario
     */
    async getInventarioInfo() {
        const queryCriticos = `
            SELECT id_producto, codigo, nombre, stock_actual, stock_minimo
            FROM Productos
            WHERE stock_actual <= stock_minimo AND stock_actual > 0 AND activo = TRUE
            ORDER BY stock_actual ASC
            LIMIT 10
        `;

        const queryAgotados = `
            SELECT id_producto, codigo, nombre
            FROM Productos
            WHERE stock_actual = 0 AND activo = TRUE
            ORDER BY nombre ASC
        `;

        const queryMovimientos = `
            SELECT m.id_movimiento, m.tipo_movimiento, m.origen, m.referencia, m.cantidad,
                   m.stock_anterior, m.stock_nuevo, m.fecha_movimiento, m.usuario_responsable,
                   p.nombre AS nombre_producto, p.codigo AS codigo_producto
            FROM Movimientos_Inventario m
            INNER JOIN Productos p ON m.id_producto = p.id_producto
            ORDER BY m.id_movimiento DESC
            LIMIT 10
        `;

        const [criticosRes, agotadosRes, movimientosRes] = await Promise.all([
            pool.query(queryCriticos),
            pool.query(queryAgotados),
            pool.query(queryMovimientos)
        ]);

        return {
            productos_stock_critico: criticosRes.rows,
            productos_agotados: agotadosRes.rows,
            ultimos_movimientos: movimientosRes.rows
        };
    },

    /**
     * Obtener métricas e información de Ventas
     */
    async getVentasInfo() {
        const queryVentasResumen = `
            SELECT 
                COUNT(*)::INT AS cantidad_ventas,
                COALESCE(SUM(total), 0.00)::NUMERIC(12,2) AS total_vendido
            FROM Ventas
            WHERE estado = 'Completada'
        `;

        const queryVentasRecientes = `
            SELECT id_venta, numero_venta, nombre_cliente, total, fecha_venta, estado
            FROM Ventas
            ORDER BY id_venta DESC
            LIMIT 10
        `;

        const queryMasVendidos = `
            SELECT 
                p.id_producto,
                p.nombre,
                p.codigo AS sku,
                SUM(dv.cantidad)::INT AS unidades_vendidas,
                SUM(dv.subtotal)::NUMERIC(12,2) AS total_ventas_valor
            FROM Detalle_Ventas dv
            INNER JOIN Ventas v ON dv.id_venta = v.id_venta
            INNER JOIN Productos p ON dv.id_producto = p.id_producto
            WHERE v.estado = 'Completada'
            GROUP BY p.id_producto, p.nombre, p.codigo
            ORDER BY unidades_vendidas DESC
            LIMIT 5
        `;

        const [resumenRes, recientesRes, masVendidosRes] = await Promise.all([
            pool.query(queryVentasResumen),
            pool.query(queryVentasRecientes),
            pool.query(queryMasVendidos)
        ]);

        return {
            cantidad_ventas: resumenRes.rows[0].cantidad_ventas,
            total_vendido: Number(resumenRes.rows[0].total_vendido),
            ventas_recientes: recientesRes.rows,
            productos_mas_vendidos: masVendidosRes.rows.map(item => ({
                ...item,
                total_ventas_valor: Number(item.total_ventas_valor)
            }))
        };
    },

    /**
     * Obtener métricas e información de Compras
     */
    async getComprasInfo() {
        const queryComprasResumen = `
            SELECT 
                COUNT(*)::INT AS cantidad_compras,
                COALESCE(SUM(total), 0.00)::NUMERIC(12,2) AS total_comprado
            FROM Compras
            WHERE estado = 'Recibida'
        `;

        const queryComprasRecientes = `
            SELECT c.id_compra, c.numero_compra, p.nombre AS nombre_proveedor, c.total, c.fecha_compra, c.estado
            FROM Compras c
            INNER JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
            ORDER BY c.id_compra DESC
            LIMIT 10
        `;

        const queryProveedoresRecientes = `
            SELECT DISTINCT 
                prov.id_proveedor, prov.nombre, prov.nit, prov.correo,
                MAX(c.fecha_compra) AS ultima_compra
            FROM Compras c
            INNER JOIN Proveedores prov ON c.id_proveedor = prov.id_proveedor
            WHERE prov.activo = TRUE
            GROUP BY prov.id_proveedor, prov.nombre, prov.nit, prov.correo
            ORDER BY ultima_compra DESC
            LIMIT 5
        `;

        const [resumenRes, recientesRes, provRecientesRes] = await Promise.all([
            pool.query(queryComprasResumen),
            pool.query(queryComprasRecientes),
            pool.query(queryProveedoresRecientes)
        ]);

        return {
            cantidad_compras: resumenRes.rows[0].cantidad_compras,
            total_comprado: Number(resumenRes.rows[0].total_comprado),
            compras_recientes: recientesRes.rows,
            ultimos_proveedores: provRecientesRes.rows
        };
    },

    /**
     * Obtener el consolidado de alertas vigentes
     */
    async getAlertasInfo() {
        const queryStockMinimo = `
            SELECT id_producto, nombre, codigo AS sku, stock_actual, stock_minimo
            FROM Productos
            WHERE stock_actual <= stock_minimo AND stock_actual > 0 AND activo = TRUE
            ORDER BY stock_actual ASC
        `;

        const queryAgotados = `
            SELECT id_producto, nombre, codigo AS sku
            FROM Productos
            WHERE stock_actual = 0 AND activo = TRUE
            ORDER BY nombre ASC
        `;

        const queryComprasPendientes = `
            SELECT c.id_compra, c.numero_compra, prov.nombre AS nombre_proveedor, c.total, c.fecha_compra
            FROM Compras c
            INNER JOIN Proveedores prov ON c.id_proveedor = prov.id_proveedor
            WHERE c.estado = 'Pendiente'
            ORDER BY c.fecha_compra ASC
        `;

        const queryVentasCanceladas = `
            SELECT id_venta, numero_venta, nombre_cliente, total, fecha_venta
            FROM Ventas
            WHERE estado = 'Cancelada'
            ORDER BY fecha_venta DESC
            LIMIT 10
        `;

        const [minimoRes, agotadosRes, comprasRes, ventasRes] = await Promise.all([
            pool.query(queryStockMinimo),
            pool.query(queryAgotados),
            pool.query(queryComprasPendientes),
            pool.query(queryVentasCanceladas)
        ]);

        return {
            alertas_stock_minimo: minimoRes.rows,
            productos_agotados: agotadosRes.rows,
            compras_pendientes: comprasRes.rows,
            ventas_canceladas: ventasRes.rows
        };
    }
};
