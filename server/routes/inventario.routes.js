import { Router } from 'express';
import {
    registrarMovimiento,
    getHistorialMovimientos,
    getMovimientoById,
    getStockActual,
    getDashboardInventario
} from '../controllers/inventario.controller.js';
import {
    validarRegistrarMovimiento,
    validarFiltrosInventario,
    validarIdMovimientoParam
} from '../validations/inventario.validation.js';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// Rutas de Movimientos
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/inventario/movimientos — Registrar movimiento manual (Entrada/Salida/Ajuste)
router.post('/movimientos', validarRegistrarMovimiento, registrarMovimiento);

// GET /api/inventario/movimientos — Historial con filtros opcionales
router.get('/movimientos', validarFiltrosInventario, getHistorialMovimientos);

// GET /api/inventario/movimientos/:id — Detalle de un movimiento específico
router.get('/movimientos/:id', validarIdMovimientoParam, getMovimientoById);

// ─────────────────────────────────────────────────────────────────────────────
// Rutas de Stock y Dashboard
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/inventario/stock — Estado actual del stock con estatus NORMAL/ALERTA/AGOTADO
router.get('/stock', getStockActual);

// GET /api/inventario/dashboard — KPIs y métricas del inventario
router.get('/dashboard', getDashboardInventario);

export default router;
