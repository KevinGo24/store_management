import bcrypt from 'bcrypt';
import pool from '../db.js';

export const loginCliente = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar al cliente por correo en la BD
    const query = 'SELECT * FROM Clientes WHERE correo = $1';
    const result = await pool.query(query, [correo]);

    if (result.rows.length === 0) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." });
    }

    const cliente = result.rows[0];

    // Comparar la contraseña enviada con la guardada
    const constrasenaValida = await bcrypt.compare(contrasena, cliente.contrasena_hash);

    if (!constrasenaValida) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." });
    }

    // Login exitoso
    res.status(200).json({
      mensaje: "Login exitoso",
      cliente: {
        id_cliente: cliente.id_cliente,
        nombre_completo: cliente.nombre_completo,
        correo: cliente.correo,
        rol: cliente.rol || 'cliente'
      }
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};