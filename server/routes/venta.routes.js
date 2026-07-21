import { Router } from 'express';
import {
    getVentas,
    getVentaById,
    createVenta,
    cancelarVenta
} from '../controllers/venta.controller.js';
import {
    validarCrearVenta,
    validarCancelarVenta,
    validarIdVentaParam
} from '../validations/venta.validation.js';

const router = Router();

// GET /api/ventas — Listar ventas (filtros: estado, buscar, fecha_inicio, fecha_fin)
router.get('/', getVentas);

// GET /api/ventas/:id — Detalle de una venta con sus ítems
router.get('/:id', validarIdVentaParam, getVentaById);

// POST /api/ventas — Registrar nueva venta (descuenta stock vía Inventario)
router.post('/', validarCrearVenta, createVenta);

// PUT /api/ventas/:id/cancelar — Cancelar venta (revierte stock vía Inventario)
router.put('/:id/cancelar', validarIdVentaParam, validarCancelarVenta, cancelarVenta);

export default router;
