import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para la entidad Categorías
 */
export const CategoriaModel = {
    /**
     * Obtener todas las categorías (por defecto solo las activas)
     */
    async findAll(incluirInactivos = false) {
        const query = incluirInactivos
            ? 'SELECT * FROM Categorias ORDER BY id_categoria ASC'
            : 'SELECT * FROM Categorias WHERE activo = TRUE ORDER BY id_categoria ASC';
        
        const result = await pool.query(query);
        return result.rows;
    },

    /**
     * Buscar una categoría por su ID
     */
    async findById(id) {
        const query = 'SELECT * FROM Categorias WHERE id_categoria = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Buscar una categoría por su nombre exacto (insensible a mayúsculas/minúsculas)
     */
    async findByNombre(nombre) {
        const query = 'SELECT * FROM Categorias WHERE LOWER(nombre) = LOWER($1)';
        const result = await pool.query(query, [nombre]);
        return result.rows[0] || null;
    },

    /**
     * Crear una nueva categoría
     */
    async create({ nombre, descripcion }) {
        const query = `
            INSERT INTO Categorias (nombre, descripcion)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await pool.query(query, [nombre, descripcion || null]);
        return result.rows[0];
    },

    /**
     * Actualizar una categoría existente por ID
     */
    async update(id, datos) {
        const { nombre, descripcion, activo } = datos;
        
        // Construcción dinámica de la consulta UPDATE
        const campos = [];
        const valores = [];
        let index = 1;

        if (nombre !== undefined) {
            campos.push(`nombre = $${index++}`);
            valores.push(nombre);
        }
        if (descripcion !== undefined) {
            campos.push(`descripcion = $${index++}`);
            valores.push(descripcion);
        }
        if (activo !== undefined) {
            campos.push(`activo = $${index++}`);
            valores.push(activo);
        }

        if (campos.length === 0) return null;

        valores.push(id);
        const query = `
            UPDATE Categorias
            SET ${campos.join(', ')}
            WHERE id_categoria = $${index}
            RETURNING *
        `;

        const result = await pool.query(query, valores);
        return result.rows[0] || null;
    },

    /**
     * Eliminación lógica (Soft Delete: activo = false)
     */
    async deleteSoft(id) {
        const query = `
            UPDATE Categorias
            SET activo = FALSE
            WHERE id_categoria = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Eliminación física (DELETE FROM)
     */
    async deletePhysical(id) {
        const query = 'DELETE FROM Categorias WHERE id_categoria = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
};
