import { Router } from 'express';
import {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
} from '../controllers/categoria.controller.js';
import {
    validarCrearCategoria,
    validarActualizarCategoria,
    validarIdCategoriaParam
} from '../validations/categoria.validation.js';

const router = Router();

// Ruta: /api/categorias
router.get('/', getCategorias);

// Ruta: /api/categorias/:id
router.get('/:id', validarIdCategoriaParam, getCategoriaById);

// Ruta: /api/categorias (Crear)
router.post('/', validarCrearCategoria, createCategoria);

// Ruta: /api/categorias/:id (Actualizar)
router.put('/:id', validarIdCategoriaParam, validarActualizarCategoria, updateCategoria);

// Ruta: /api/categorias/:id (Eliminar / Soft delete)
router.delete('/:id', validarIdCategoriaParam, deleteCategoria);

export default router;
