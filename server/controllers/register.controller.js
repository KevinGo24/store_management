import bcrypt from 'bcrypt';
import pool from '../db.js';

export const registrarCliente = async (req, res) => {
  try {
    // Express recibe los datos a través de req.body
    const { nombre_completo, correo, contrasena, telefono } = req.body;
    
    // Encriptar la contraseña
    const saltRounds = 10;
    const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

    // Guardar en la Base de Datos
    const query = 'INSERT INTO Clientes (nombre_completo, correo, contrasena_hash, telefono) VALUES ($1, $2, $3, $4) RETURNING id_cliente, nombre_completo, correo';
    const result = await pool.query(query, [nombre_completo, correo, contrasena_hash, telefono]);

    // Enviar respuesta exitosa al frontend
    res.status(201).json({ 
        mensaje: "Cliente registrado con éxito",
        cliente: result.rows[0]
    });

  } catch (error) {
    console.error("Error al registrar cliente:", error);
    if (error.code === '23505') { // Código de error de PostgreSQL para "Dato duplicado"
        return res.status(400).json({ mensaje: "El correo electrónico ya está registrado." });
    }
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};