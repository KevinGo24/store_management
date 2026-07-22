import { Router } from 'express';
import {
    getResumen,
    getInventario,
    getVentas,
    getCompras,
    getAlertas
} from '../controllers/dashboard.controller.js';

const router = Router();

// GET /api/dashboard/resumen — Indicadores y contadores generales de la tienda
router.get('/resumen', getResumen);

// GET /api/dashboard/inventario — Productos críticos, agotados y movimientos recientes
router.get('/inventario', getInventario);

// GET /api/dashboard/ventas — Facturación de ventas, ventas recientes y productos estrella
router.get('/ventas', getVentas);

// GET /api/dashboard/compras — Abastecimiento de compras, montos totales y proveedores frecuentes
router.get('/compras', getCompras);

// GET /api/dashboard/alertas — Consolidado de todas las alertas y notificaciones del sistema
router.get('/alertas', getAlertas);

export default router;
