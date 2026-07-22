import { Router } from 'express';
import { login, registrar } from '../controllers/auth.controller.js';
import { validarLogin, validarRegistro } from '../validations/auth.validation.js';

const router = Router();

// POST /api/login — Iniciar sesión de cliente
router.post('/login', validarLogin, login);

// POST /api/register — Registrar un nuevo cliente
router.post('/register', validarRegistro, registrar);

export default router;
