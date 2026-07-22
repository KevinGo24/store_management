import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Controlador HTTP para Autenticación de Clientes
 */

/**
 * @route   POST /api/login
 * @desc    Iniciar sesión de cliente (comprobación de credenciales)
 * @access  Público
 */
export const login = asyncHandler(async (req, res) => {
    const { correo, contrasena } = req.body;
    const cliente = await AuthService.login(correo, contrasena);

    res.status(200).json({
        mensaje: "Login exitoso",
        cliente: {
            id_cliente: cliente.id_cliente,
            nombre_completo: cliente.nombre_completo,
            correo: cliente.correo
        }
    });
});

/**
 * @route   POST /api/register
 * @desc    Registrar un nuevo cliente en el sistema
 * @access  Público
 */
export const registrar = asyncHandler(async (req, res) => {
    const cliente = await AuthService.registrar(req.body);

    res.status(201).json({
        mensaje: "Cliente registrado con éxito",
        cliente: {
            id_cliente: cliente.id_cliente,
            nombre_completo: cliente.nombre_completo,
            correo: cliente.correo
        }
    });
});
