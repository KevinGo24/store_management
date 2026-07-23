import { Router } from 'express';
import {
    getReporteVentas,
    getReporteCompras,
    getReporteInventario,
    getReporteProductos,
    getReporteProveedores
} from '../controllers/reportes.controller.js';
import { validarFechasReporte } from '../validations/reportes.validation.js';

const router = Router();

// GET /api/reportes/ventas — Ventas por fecha, total y más vendidos
router.get('/ventas', validarFechasReporte, getReporteVentas);

// GET /api/reportes/compras — Compras por fecha, total y proveedor
router.get('/compras', validarFechasReporte, getReporteCompras);

// GET /api/reportes/inventario — Valor total del inventario, agotados y mayores existencias
router.get('/inventario', getReporteInventario);

// GET /api/reportes/productos — Estadísticas del catálogo de productos y inactivos/sin movimientos
router.get('/productos', getReporteProductos);

// GET /api/reportes/proveedores — Historial comercial de compras por proveedor y proveedores sin compras
router.get('/proveedores', getReporteProveedores);

export default router;
