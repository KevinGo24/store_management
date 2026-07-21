import { DashboardModel } from '../models/dashboard.model.js';

/**
 * Capa de Servicios para el Dashboard del Negocio
 */
export const DashboardService = {

    /**
     * Consolidado de indicadores y totales generales
     */
    async obtenerResumenGeneral() {
        return await DashboardModel.getResumenGeneral();
    },

    /**
     * Consolidado del estado de inventario y historial crítico
     */
    async obtenerDashboardInventario() {
        return await DashboardModel.getInventarioInfo();
    },

    /**
     * Consolidado de métricas de ventas y productos estrella
     */
    async obtenerDashboardVentas() {
        return await DashboardModel.getVentasInfo();
    },

    /**
     * Consolidado de métricas de compras y relaciones con proveedores
     */
    async obtenerDashboardCompras() {
        return await DashboardModel.getComprasInfo();
    },

    /**
     * Consolidado global de alertas operacionales de la tienda
     */
    async obtenerDashboardAlertas() {
        return await DashboardModel.getAlertasInfo();
    }
};
