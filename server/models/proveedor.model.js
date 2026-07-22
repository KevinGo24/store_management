import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para la entidad Proveedores
 */
export const ProveedorModel = {
    /**
     * Obtener todos los proveedores con búsqueda opcional y filtro de inactivos
     */
    async findAll(filtros = {}) {
        const { buscar, incluirInactivos } = filtros;

        let query = 'SELECT * FROM Proveedores WHERE 1=1';
        const params = [];
        let index = 1;

        if (!incluirInactivos) {
            query += ' AND activo = TRUE';
        }

        if (buscar) {
            query += ` AND (
                LOWER(nombre) LIKE $${index} OR 
                LOWER(nit) LIKE $${index} OR 
                LOWER(COALESCE(contacto_principal, '')) LIKE $${index} OR 
                LOWER(COALESCE(ciudad, '')) LIKE $${index}
            )`;
            params.push(`%${buscar.toLowerCase()}%`);
            index++;
        }

        query += ' ORDER BY id_proveedor ASC';

        const result = await pool.query(query, params);
        return result.rows;
    },

    /**
     * Buscar un proveedor por su ID
     */
    async findById(id) {
        const query = 'SELECT * FROM Proveedores WHERE id_proveedor = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Buscar un proveedor por NIT / Identificación Fiscal
     */
    async findByNit(nit) {
        const query = 'SELECT * FROM Proveedores WHERE LOWER(nit) = LOWER($1)';
        const result = await pool.query(query, [nit]);
        return result.rows[0] || null;
    },

    /**
     * Crear un nuevo proveedor
     */
    async create(datos) {
        const {
            nombre,
            nit,
            correo,
            telefono,
            direccion,
            ciudad,
            contacto_principal,
            condiciones_pago,
            tiempo_entrega_dias,
            sitio_web,
            observaciones
        } = datos;

        const query = `
            INSERT INTO Proveedores (
                nombre, nit, correo, telefono, direccion, ciudad, contacto_principal,
                condiciones_pago, tiempo_entrega_dias, sitio_web, observaciones
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;

        const values = [
            nombre,
            nit,
            correo || null,
            telefono || null,
            direccion || null,
            ciudad || null,
            contacto_principal || null,
            condiciones_pago || 'Contado',
            tiempo_entrega_dias || 1,
            sitio_web || null,
            observaciones || null
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Actualizar datos de un proveedor existente por ID
     */
    async update(id, datos) {
        const camposPermitidos = [
            'nombre', 'nit', 'correo', 'telefono', 'direccion', 'ciudad',
            'contacto_principal', 'condiciones_pago', 'tiempo_entrega_dias',
            'sitio_web', 'observaciones', 'activo'
        ];

        const campos = [];
        const valores = [];
        let index = 1;

        for (const clave of camposPermitidos) {
            if (datos[clave] !== undefined) {
                campos.push(`${clave} = $${index++}`);
                valores.push(datos[clave]);
            }
        }

        if (campos.length === 0) return null;

        valores.push(id);
        const query = `
            UPDATE Proveedores
            SET ${campos.join(', ')}
            WHERE id_proveedor = $${index}
            RETURNING *
        `;

        const result = await pool.query(query, valores);
        return result.rows[0] || null;
    },

    /**
     * Eliminación Lógica (Soft Delete)
     */
    async deleteSoft(id) {
        const query = `
            UPDATE Proveedores
            SET activo = FALSE
            WHERE id_proveedor = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
};
