import pool from '../db.js';

/**
 * Capa de Acceso a Datos (Model) para la entidad Productos
 */
export const ProductoModel = {
    /**
     * Obtener productos con filtros opcionales (búsqueda, categoría, stock bajo, etc.)
     */
    async findAll(filtros = {}) {
        const { id_categoria, buscar, stockAlerta, incluirInactivos } = filtros;
        
        let query = `
            SELECT 
                p.*,
                c.nombre AS nombre_categoria
            FROM Productos p
            INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE 1=1
        `;

        const params = [];
        let index = 1;

        if (!incluirInactivos) {
            query += ` AND p.activo = TRUE`;
        }

        if (id_categoria) {
            query += ` AND p.id_categoria = $${index++}`;
            params.push(id_categoria);
        }

        if (stockAlerta) {
            query += ` AND p.stock_actual <= p.stock_minimo`;
        }

        if (buscar) {
            query += ` AND (LOWER(p.nombre) LIKE $${index} OR LOWER(p.codigo) LIKE $${index} OR LOWER(COALESCE(p.marca, '')) LIKE $${index})`;
            params.push(`%${buscar.toLowerCase()}%`);
            index++;
        }

        query += ` ORDER BY p.id_producto ASC`;

        const result = await pool.query(query, params);
        return result.rows;
    },

    /**
     * Buscar un producto por ID con información de su Categoría
     */
    async findById(id) {
        const query = `
            SELECT 
                p.*,
                c.nombre AS nombre_categoria
            FROM Productos p
            INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    /**
     * Buscar un producto por Código SKU
     */
    async findByCodigo(codigo) {
        const query = 'SELECT * FROM Productos WHERE LOWER(codigo) = LOWER($1)';
        const result = await pool.query(query, [codigo]);
        return result.rows[0] || null;
    },

    /**
     * Buscar un producto por Código de Barras
     */
    async findByCodigoBarras(codigo_barras) {
        if (!codigo_barras) return null;
        const query = 'SELECT * FROM Productos WHERE LOWER(codigo_barras) = LOWER($1)';
        const result = await pool.query(query, [codigo_barras]);
        return result.rows[0] || null;
    },

    /**
     * Crear un nuevo producto
     */
    async create(datos) {
        const {
            id_categoria,
            codigo,
            codigo_barras,
            nombre,
            descripcion,
            marca,
            unidad_medida,
            precio_compra,
            precio_venta,
            stock_actual,
            stock_minimo,
            imagen_url
        } = datos;

        const query = `
            INSERT INTO Productos (
                id_categoria, codigo, codigo_barras, nombre, descripcion, marca,
                unidad_medida, precio_compra, precio_venta, stock_actual, stock_minimo, imagen_url
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;

        const values = [
            id_categoria,
            codigo,
            codigo_barras || null,
            nombre,
            descripcion || null,
            marca || null,
            unidad_medida || 'unidad',
            precio_compra,
            precio_venta,
            stock_actual,
            stock_minimo,
            imagen_url || null
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Actualizar datos de un producto por ID
     */
    async update(id, datos) {
        const camposPermitidos = [
            'id_categoria', 'codigo', 'codigo_barras', 'nombre', 'descripcion',
            'marca', 'unidad_medida', 'precio_compra', 'precio_venta',
            'stock_actual', 'stock_minimo', 'imagen_url', 'activo'
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
            UPDATE Productos
            SET ${campos.join(', ')}
            WHERE id_producto = $${index}
            RETURNING *
        `;

        const result = await pool.query(query, valores);
        return result.rows[0] || null;
    },

    /**
     * Actualizar el stock actual (Modo incremento/decremento para Inventario/Compras)
     */
    async updateStock(id, cantidad, operacion = 'sumar') {
        const signo = operacion === 'restar' ? '-' : '+';
        const query = `
            UPDATE Productos
            SET stock_actual = stock_actual ${signo} $1
            WHERE id_producto = $2
            RETURNING *
        `;
        const result = await pool.query(query, [cantidad, id]);
        return result.rows[0] || null;
    },

    /**
     * Eliminación Lógica (Soft Delete)
     */
    async deleteSoft(id) {
        const query = `
            UPDATE Productos
            SET activo = FALSE
            WHERE id_producto = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
};
