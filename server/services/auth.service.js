import bcrypt from 'bcrypt';
import { AuthModel } from '../models/auth.model.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Capa de Servicios (Lógica de Negocio) para Autenticación de Clientes
 */
export const AuthService = {

    /**
     * Lógica de autenticación de credenciales de cliente (Login)
     * @param {string} correo
     * @param {string} contrasena
     */
    async login(correo, contrasena) {
        // 1. Buscar al cliente por correo electrónico
        const cliente = await AuthModel.findByCorreo(correo);
        if (!cliente) {
            // Error genérico controlado por seguridad
            throw new AppError('Correo o contraseña incorrectos.', 401);
        }

        // 2. Comparar el hash de la contraseña
        const contrasenaValida = await bcrypt.compare(contrasena, cliente.contrasena_hash);
        if (!contrasenaValida) {
            throw new AppError('Correo o contraseña incorrectos.', 401);
        }

        // 3. Retornar datos seguros del cliente
        return {
            id_cliente: cliente.id_cliente,
            nombre_completo: cliente.nombre_completo,
            correo: cliente.correo
        };
    },

    /**
     * Lógica de registro de un nuevo cliente
     * @param {object} datos - { nombre_completo, correo, contrasena, telefono }
     */
    async registrar(datos) {
        const { nombre_completo, correo, contrasena, telefono } = datos;

        // 1. Verificar si el correo ya existe
        const existeCliente = await AuthModel.findByCorreo(correo);
        if (existeCliente) {
            throw new AppError('El correo electrónico ya está registrado.', 400);
        }

        // 2. Encriptar contraseña mediante bcrypt con 10 salt rounds
        const saltRounds = 10;
        const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

        // 3. Crear el cliente
        const nuevoCliente = await AuthModel.create({
            nombre_completo,
            correo,
            contrasena_hash,
            telefono
        });

        return {
            id_cliente: nuevoCliente.id_cliente,
            nombre_completo: nuevoCliente.nombre_completo,
            correo: nuevoCliente.correo
        };
    }
};
