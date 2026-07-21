import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para Autenticación de Clientes
 */
export const AuthModel = {
    
    /**
     * Buscar un cliente por su correo electrónico
     * @param {string} correo
     */
    async findByCorreo(correo) {
        const query = 'SELECT * FROM Clientes WHERE LOWER(correo) = LOWER($1)';
        const result = await pool.query(query, [correo]);
        return result.rows[0] || null;
    },

    /**
     * Crear un nuevo registro de cliente en la base de datos
     * @param {object} datos - { nombre_completo, correo, contrasena_hash, telefono }
     */
    async create(datos) {
        const { nombre_completo, correo, contrasena_hash, telefono } = datos;
        const query = `
            INSERT INTO Clientes (nombre_completo, correo, contrasena_hash, telefono)
            VALUES ($1, $2, $3, $4)
            RETURNING id_cliente, nombre_completo, correo, telefono, fecha_creacion
        `;
        const values = [nombre_completo, correo, contrasena_hash, telefono || null];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
};
