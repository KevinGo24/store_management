import { Router } from 'express';
import {
    getProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deleteProveedor
} from '../controllers/proveedor.controller.js';
import {
    validarCrearProveedor,
    validarActualizarProveedor,
    validarIdProveedorParam
} from '../validations/proveedor.validation.js';

const router = Router();

// Ruta: GET /api/proveedores
router.get('/', getProveedores);

// Ruta: GET /api/proveedores/:id
router.get('/:id', validarIdProveedorParam, getProveedorById);

// Ruta: POST /api/proveedores
router.post('/', validarCrearProveedor, createProveedor);

// Ruta: PUT /api/proveedores/:id
router.put('/:id', validarIdProveedorParam, validarActualizarProveedor, updateProveedor);

// Ruta: DELETE /api/proveedores/:id
router.delete('/:id', validarIdProveedorParam, deleteProveedor);

export default router;
