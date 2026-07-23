import { ReporteModel } from '../models/reporte.model.js';

/**
 * Capa de Servicios para la Generación de Reportes Analíticos de la Tienda
 */
export const ReporteService = {

    /**
     * Consolidar reporte de ventas por rango de fecha
     */
    async obtenerReporteVentas(fechaInicio, fechaFin) {
        // Rangos por defecto amplios si no se especifican
        const inicio = fechaInicio || '2000-01-01';
        const fin    = fechaFin    || new Date().toISOString().split('T')[0];

        // Asegurar formato timestamp para abarcar el día completo (00:00:00 a 23:59:59)
        const timestampInicio = `${inicio} 00:00:00`;
        const timestampFin    = `${fin} 23:59:59`;

        return await ReporteModel.getVentasReport(timestampInicio, timestampFin);
    },

    /**
     * Consolidar reporte de compras por rango de fecha
     */
    async obtenerReporteCompras(fechaInicio, fechaFin) {
        const inicio = fechaInicio || '2000-01-01';
        const fin    = fechaFin    || new Date().toISOString().split('T')[0];

        const timestampInicio = `${inicio} 00:00:00`;
        const timestampFin    = `${fin} 23:59:59`;

        return await ReporteModel.getComprasReport(timestampInicio, timestampFin);
    },

    /**
     * Consolidar reporte de valorización y stock de inventario
     */
    async obtenerReporteInventario() {
        return await ReporteModel.getInventarioReport();
    },

    /**
     * Consolidar reporte analítico de catálogo de productos
     */
    async obtenerReporteProductos() {
        return await ReporteModel.getProductosReport();
    },

    /**
     * Consolidar reporte de proveedores y compras
     */
    async obtenerReporteProveedores() {
        return await ReporteModel.getProveedoresReport();
    }
};
