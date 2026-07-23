import { Router } from 'express';
import {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} from '../controllers/producto.controller.js';
import {
    validarCrearProducto,
    validarActualizarProducto,
    validarIdProductoParam
} from '../validations/producto.validation.js';

const router = Router();

// Ruta: GET /api/productos (Lista con filtros opcionales ?buscar=...&id_categoria=...&stockAlerta=true)
router.get('/', getProductos);

// Ruta: GET /api/productos/:id
router.get('/:id', validarIdProductoParam, getProductoById);

// Ruta: POST /api/productos
router.post('/', validarCrearProducto, createProducto);

// Ruta: PUT /api/productos/:id
router.put('/:id', validarIdProductoParam, validarActualizarProducto, updateProducto);

// Ruta: DELETE /api/productos/:id
router.delete('/:id', validarIdProductoParam, deleteProducto);

export default router;
