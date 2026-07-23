import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para Consultas de Reportes Analíticos
 *
 * Módulo de Solo Lectura. No modifica tablas. Realiza consultas complejas
 * de agregación y filtros de rango de fecha de manera directa y optimizada.
 */
export const ReporteModel = {

    /**
     * Reporte consolidado de Ventas en un rango de fechas
     * @param {string} fechaInicio - ISO / YYYY-MM-DD
     * @param {string} fechaFin - ISO / YYYY-MM-DD
     */
    async getVentasReport(fechaInicio, fechaFin) {
        // Ventas por rango
        const queryVentas = `
            SELECT id_venta, numero_venta, nombre_cliente, documento_cliente, total, fecha_venta, estado
            FROM Ventas
            WHERE fecha_venta >= $1 AND fecha_venta <= $2
            ORDER BY fecha_venta DESC
        `;

        // Totales consolidados (sólo completadas)
        const queryConsolidado = `
            SELECT
                COUNT(*)::INT AS cantidad_ventas,
                COALESCE(SUM(total), 0.00)::NUMERIC(12,2) AS total_vendido
            FROM Ventas
            WHERE estado = 'Completada' AND fecha_venta >= $1 AND fecha_venta <= $2
        `;

        // Productos más vendidos en el rango
        const queryMasVendidos = `
            SELECT
                p.id_producto,
                p.nombre AS nombre_producto,
                p.codigo AS sku,
                SUM(dv.cantidad)::INT AS cantidad_vendida,
                SUM(dv.subtotal)::NUMERIC(12,2) AS subtotal_vendido
            FROM Detalle_Ventas dv
            INNER JOIN Ventas v ON dv.id_venta = v.id_venta
            INNER JOIN Productos p ON dv.id_producto = p.id_producto
            WHERE v.estado = 'Completada' AND v.fecha_venta >= $1 AND v.fecha_venta <= $2
            GROUP BY p.id_producto, p.nombre, p.codigo
            ORDER BY cantidad_vendida DESC
            LIMIT 10
        `;

        const [ventasRes, consolidadoRes, masVendidosRes] = await Promise.all([
            pool.query(queryVentas, [fechaInicio, fechaFin]),
            pool.query(queryConsolidado, [fechaInicio, fechaFin]),
            pool.query(queryMasVendidos, [fechaInicio, fechaFin])
        ]);

        return {
            rango_fechas: { inicio: fechaInicio, fin: fechaFin },
            consolidado: {
                cantidad_ventas: consolidadoRes.rows[0].cantidad_ventas,
                total_vendido: Number(consolidadoRes.rows[0].total_vendido)
            },
            ventas_detalle: ventasRes.rows,
            productos_mas_vendidos: masVendidosRes.rows.map(item => ({
                ...item,
                subtotal_vendido: Number(item.subtotal_vendido)
            }))
        };
    },

    /**
     * Reporte consolidado de Compras en un rango de fechas
     * @param {string} fechaInicio - ISO / YYYY-MM-DD
     * @param {string} fechaFin - ISO / YYYY-MM-DD
     */
    async getComprasReport(fechaInicio, fechaFin) {
        // Compras por rango
        const queryCompras = `
            SELECT c.id_compra, c.numero_compra, p.nombre AS nombre_proveedor, c.total, c.fecha_compra, c.estado
            FROM Compras c
            INNER JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
            WHERE c.fecha_compra >= $1 AND c.fecha_compra <= $2
            ORDER BY c.fecha_compra DESC
        `;

        // Totales consolidados (sólo recibidas)
        const queryConsolidado = `
            SELECT
                COUNT(*)::INT AS cantidad_compras,
                COALESCE(SUM(total), 0.00)::NUMERIC(12,2) AS total_comprado
            FROM Compras
            WHERE estado = 'Recibida' AND fecha_compra >= $1 AND fecha_compra <= $2
        `;

        // Compras por proveedor en el rango
        const queryPorProveedor = `
            SELECT
                p.id_proveedor,
                p.nombre AS nombre_proveedor,
                p.nit,
                COUNT(c.id_compra)::INT AS total_compras,
                COALESCE(SUM(c.total), 0.00)::NUMERIC(12,2) AS total_monto
            FROM Compras c
            INNER JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
            WHERE c.estado = 'Recibida' AND c.fecha_compra >= $1 AND c.fecha_compra <= $2
            GROUP BY p.id_proveedor, p.nombre, p.nit
            ORDER BY total_monto DESC
        `;

        // Productos más comprados en el rango
        const queryMasComprados = `
            SELECT
                prod.id_producto,
                prod.nombre AS nombre_producto,
                prod.codigo AS sku,
                SUM(dc.cantidad)::INT AS cantidad_comprada,
                SUM(dc.subtotal)::NUMERIC(12,2) AS subtotal_comprado
            FROM Detalle_Compras dc
            INNER JOIN Compras c ON dc.id_compra = c.id_compra
            INNER JOIN Productos prod ON dc.id_producto = prod.id_producto
            WHERE c.estado = 'Recibida' AND c.fecha_compra >= $1 AND c.fecha_compra <= $2
            GROUP BY prod.id_producto, prod.nombre, prod.codigo
            ORDER BY cantidad_comprada DESC
            LIMIT 10
        `;

        const [comprasRes, consolidadoRes, porProveedorRes, masCompradosRes] = await Promise.all([
            pool.query(queryCompras, [fechaInicio, fechaFin]),
            pool.query(queryConsolidado, [fechaInicio, fechaFin]),
            pool.query(queryPorProveedor, [fechaInicio, fechaFin]),
            pool.query(queryMasComprados, [fechaInicio, fechaFin])
        ]);

        return {
            rango_fechas: { inicio: fechaInicio, fin: fechaFin },
            consolidado: {
                cantidad_compras: consolidadoRes.rows[0].cantidad_compras,
                total_comprado: Number(consolidadoRes.rows[0].total_comprado)
            },
            compras_detalle: comprasRes.rows,
            compras_por_proveedor: porProveedorRes.rows.map(item => ({
                ...item,
                total_monto: Number(item.total_monto)
            })),
            productos_mas_comprados: masCompradosRes.rows.map(item => ({
                ...item,
                subtotal_comprado: Number(item.subtotal_comprado)
            }))
        };
    },

    /**
     * Reporte consolidado de Inventario
     */
    async getInventarioReport() {
        const queryValor = `
            SELECT
                COALESCE(SUM(stock_actual * precio_compra), 0.00)::NUMERIC(12,2) AS valor_inventario_compra,
                COALESCE(SUM(stock_actual * precio_venta), 0.00)::NUMERIC(12,2) AS valor_inventario_venta
            FROM Productos
            WHERE activo = TRUE
        `;

        const queryAgotados = `
            SELECT p.id_producto, p.nombre, p.codigo AS sku, c.nombre AS nombre_categoria, p.stock_minimo
            FROM Productos p
            INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE p.stock_actual = 0 AND p.activo = TRUE
            ORDER BY p.nombre ASC
        `;

        const queryStockMinimo = `
            SELECT p.id_producto, p.nombre, p.codigo AS sku, c.nombre AS nombre_categoria, p.stock_actual, p.stock_minimo
            FROM Productos p
            INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE p.stock_actual <= p.stock_minimo AND p.stock_actual > 0 AND p.activo = TRUE
            ORDER BY p.stock_actual ASC
        `;

        const queryMayorExistencia = `
            SELECT p.id_producto, p.nombre, p.codigo AS sku, c.nombre AS nombre_categoria, p.stock_actual, p.precio_compra
            FROM Productos p
            INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE p.activo = TRUE
            ORDER BY p.stock_actual DESC
            LIMIT 10
        `;

        const [valorRes, agotadosRes, minimoRes, mayorRes] = await Promise.all([
            pool.query(queryValor),
            pool.query(queryAgotados),
            pool.query(queryStockMinimo),
            pool.query(queryMayorExistencia)
        ]);

        return {
            valoracion: {
                valor_inventario_costo: Number(valorRes.rows[0].valor_inventario_compra),
                valor_inventario_venta: Number(valorRes.rows[0].valor_inventario_venta),
                margen_potencial_valor: Number((valorRes.rows[0].valor_inventario_venta - valorRes.rows[0].valor_inventario_compra).toFixed(2))
            },
            productos_agotados: agotadosRes.rows,
            productos_stock_minimo: minimoRes.rows,
            productos_mayor_existencia: mayorRes.rows.map(item => ({
                ...item,
                precio_compra: Number(item.precio_compra),
                valor_total_costo: Number((item.stock_actual * item.precio_compra).toFixed(2))
            }))
        };
    },

    /**
     * Reporte analítico de catálogo de Productos
     */
    async getProductosReport() {
        // Conteo generales
        const queryGeneral = `
            SELECT
                COUNT(*) FILTER (WHERE activo = TRUE)::INT AS total_activos,
                COUNT(*) FILTER (WHERE activo = FALSE)::INT AS total_inactivos
            FROM Productos
        `;

        // Productos por categoría
        const queryPorCategoria = `
            SELECT
                c.id_categoria,
                c.nombre AS nombre_categoria,
                COUNT(p.id_producto)::INT AS cantidad_productos
            FROM Categorias c
            LEFT JOIN Productos p ON c.id_categoria = p.id_categoria
            GROUP BY c.id_categoria, c.nombre
            ORDER BY cantidad_productos DESC
        `;

        // Productos sin movimiento
        const querySinMovimiento = `
            SELECT p.id_producto, p.nombre, p.codigo AS sku, c.nombre AS nombre_categoria, p.stock_actual, p.fecha_creacion
            FROM Productos p
            INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE p.activo = TRUE AND p.id_producto NOT IN (
                SELECT DISTINCT id_producto
                FROM Movimientos_Inventario
                WHERE origen IN ('Compra', 'Venta', 'Ajuste_Manual', 'Devolucion')
            )
            ORDER BY p.fecha_creacion DESC
        `;

        const [generalRes, porCategoriaRes, sinMovRes] = await Promise.all([
            pool.query(queryGeneral),
            pool.query(queryPorCategoria),
            pool.query(querySinMovimiento)
        ]);

        return {
            resumen: generalRes.rows[0],
            productos_por_categoria: porCategoriaRes.rows,
            productos_sin_movimiento: sinMovRes.rows
        };
    },

    /**
     * Reporte consolidado de Proveedores
     */
    async getProveedoresReport() {
        // Compras realizadas por proveedor (general)
        const queryComprasPorProveedor = `
            SELECT
                p.id_proveedor,
                p.nombre,
                p.nit,
                p.correo,
                p.telefono,
                p.activo,
                COUNT(c.id_compra)::INT AS cantidad_compras,
                COALESCE(SUM(c.total), 0.00)::NUMERIC(12,2) AS total_comprado
            FROM Proveedores p
            LEFT JOIN Compras c ON p.id_proveedor = c.id_proveedor AND c.estado = 'Recibida'
            GROUP BY p.id_proveedor, p.nombre, p.nit, p.correo, p.telefono, p.activo
            ORDER BY total_comprado DESC
        `;

        // Proveedores sin compras registradas
        const querySinCompras = `
            SELECT id_proveedor, nombre, nit, correo, telefono, activo
            FROM Proveedores
            WHERE id_proveedor NOT IN (
                SELECT DISTINCT id_proveedor FROM Compras
            )
            ORDER BY nombre ASC
        `;

        const [comprasRes, sinComprasRes] = await Promise.all([
            pool.query(queryComprasPorProveedor),
            pool.query(querySinCompras)
        ]);

        // Proveedores más utilizados (Top 5 con mayor volumen de compras)
        const proveedoresMasUtilizados = [...comprasRes.rows]
            .sort((a, b) => b.cantidad_compras - a.cantidad_compras)
            .slice(0, 5);

        return {
            compras_por_proveedor: comprasRes.rows.map(item => ({
                ...item,
                total_comprado: Number(item.total_comprado)
            })),
            proveedores_mas_utilizados: proveedoresMasUtilizados.map(item => ({
                id_proveedor: item.id_proveedor,
                nombre: item.nombre,
                nit: item.nit,
                cantidad_compras: item.cantidad_compras,
                total_comprado: Number(item.total_comprado)
            })),
            proveedores_sin_compras: sinComprasRes.rows
        };
    }
};
