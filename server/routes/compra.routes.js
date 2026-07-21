import { Router } from 'express';
import {
    getCompras,
    getCompraById,
    createCompra,
    cambiarEstadoCompra
} from '../controllers/compra.controller.js';
import {
    validarCrearCompra,
    validarCambiarEstadoCompra,
    validarIdCompraParam
} from '../validations/compra.validation.js';

const router = Router();

// Ruta: GET /api/compras (Lista con filtros ?estado=...&id_proveedor=...&buscar=...)
router.get('/', getCompras);

// Ruta: GET /api/compras/:id
router.get('/:id', validarIdCompraParam, getCompraById);

// Ruta: POST /api/compras
router.post('/', validarCrearCompra, createCompra);

// Ruta: PUT /api/compras/:id/estado (Actualizar estado y sincronizar stock automático)
router.put('/:id/estado', validarIdCompraParam, validarCambiarEstadoCompra, cambiarEstadoCompra);

export default router;
