import { AppError } from '../middlewares/errorHandler.js';

/**
 * Validaciones para la creación de un Producto
 */
export const validarCrearProducto = (req, res, next) => {
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
    } = req.body;

    const errores = [];

    // Validar id_categoria
    const idCatNum = Number(id_categoria);
    if (!id_categoria || !Number.isInteger(idCatNum) || idCatNum <= 0) {
        errores.push('El campo "id_categoria" es obligatorio y debe ser un ID entero positivo válido.');
    }

    // Validar código (SKU)
    if (!codigo || typeof codigo !== 'string' || codigo.trim() === '') {
        errores.push('El campo "codigo" (SKU) es obligatorio.');
    } else if (codigo.trim().length > 50) {
        errores.push('El campo "codigo" no puede exceder los 50 caracteres.');
    }

    // Validar nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        errores.push('El campo "nombre" es obligatorio.');
    } else if (nombre.trim().length > 150) {
        errores.push('El campo "nombre" no puede exceder los 150 caracteres.');
    }

    // Validar precios
    const pVentaNum = Number(precio_venta);
    if (precio_venta === undefined || isNaN(pVentaNum) || pVentaNum < 0) {
        errores.push('El campo "precio_venta" es obligatorio y debe ser un número mayor o igual a 0.');
    }

    if (precio_compra !== undefined && (isNaN(Number(precio_compra)) || Number(precio_compra) < 0)) {
        errores.push('El campo "precio_compra" debe ser un número mayor o igual a 0.');
    }

    // Validar stocks
    if (stock_actual !== undefined && (!Number.isInteger(Number(stock_actual)) || Number(stock_actual) < 0)) {
        errores.push('El campo "stock_actual" debe ser un número entero mayor o igual a 0.');
    }

    if (stock_minimo !== undefined && (!Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0)) {
        errores.push('El campo "stock_minimo" debe ser un número entero mayor o igual a 0.');
    }

    // Validar campos de texto opcionales
    if (marca !== undefined && marca !== null && typeof marca !== 'string') {
        errores.push('El campo "marca" debe ser texto.');
    }

    if (unidad_medida !== undefined && unidad_medida !== null && typeof unidad_medida !== 'string') {
        errores.push('El campo "unidad_medida" debe ser texto.');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al crear el producto', 400, errores));
    }

    // Sanitización
    req.body.id_categoria = idCatNum;
    req.body.codigo = codigo.trim();
    req.body.nombre = nombre.trim();
    if (codigo_barras) req.body.codigo_barras = codigo_barras.trim();
    if (descripcion) req.body.descripcion = descripcion.trim();
    if (marca) req.body.marca = marca.trim();
    if (unidad_medida) req.body.unidad_medida = unidad_medida.trim().toLowerCase();
    req.body.precio_compra = precio_compra !== undefined ? Number(precio_compra) : 0.00;
    req.body.precio_venta = pVentaNum;
    req.body.stock_actual = stock_actual !== undefined ? Number(stock_actual) : 0;
    req.body.stock_minimo = stock_minimo !== undefined ? Number(stock_minimo) : 5;
    if (imagen_url) req.body.imagen_url = imagen_url.trim();

    next();
};

/**
 * Validaciones para la actualización de un Producto
 */
export const validarActualizarProducto = (req, res, next) => {
    const {
        id_categoria,
        codigo,
        codigo_barras,
        nombre,
        precio_compra,
        precio_venta,
        stock_actual,
        stock_minimo,
        activo
    } = req.body;

    const errores = [];

    // Debe enviarse al menos un campo a modificar
    if (Object.keys(req.body).length === 0) {
        errores.push('Debe proporcionar al menos un campo para actualizar el producto.');
    }

    if (id_categoria !== undefined && (!Number.isInteger(Number(id_categoria)) || Number(id_categoria) <= 0)) {
        errores.push('El campo "id_categoria" debe ser un entero positivo válido.');
    }

    if (codigo !== undefined && (typeof codigo !== 'string' || codigo.trim() === '')) {
        errores.push('El campo "codigo" no puede estar vacío.');
    }

    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
        errores.push('El campo "nombre" no puede estar vacío.');
    }

    if (precio_venta !== undefined && (isNaN(Number(precio_venta)) || Number(precio_venta) < 0)) {
        errores.push('El campo "precio_venta" debe ser mayor o igual a 0.');
    }

    if (precio_compra !== undefined && (isNaN(Number(precio_compra)) || Number(precio_compra) < 0)) {
        errores.push('El campo "precio_compra" debe ser mayor o igual a 0.');
    }

    if (stock_actual !== undefined && (!Number.isInteger(Number(stock_actual)) || Number(stock_actual) < 0)) {
        errores.push('El campo "stock_actual" debe ser un número entero mayor o igual a 0.');
    }

    if (stock_minimo !== undefined && (!Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0)) {
        errores.push('El campo "stock_minimo" debe ser un número entero mayor o igual a 0.');
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
        errores.push('El campo "activo" debe ser un valor booleano (true o false).');
    }

    if (errores.length > 0) {
        return next(new AppError('Error de validación al actualizar el producto', 400, errores));
    }

    // Sanitización
    if (req.body.id_categoria) req.body.id_categoria = Number(id_categoria);
    if (req.body.codigo) req.body.codigo = codigo.trim();
    if (req.body.nombre) req.body.nombre = nombre.trim();
    if (req.body.precio_compra !== undefined) req.body.precio_compra = Number(precio_compra);
    if (req.body.precio_venta !== undefined) req.body.precio_venta = Number(precio_venta);
    if (req.body.stock_actual !== undefined) req.body.stock_actual = Number(stock_actual);
    if (req.body.stock_minimo !== undefined) req.body.stock_minimo = Number(stock_minimo);

    next();
};

/**
 * Validar ID de Producto en parámetros de URL
 */
export const validarIdProductoParam = (req, res, next) => {
    const { id } = req.params;
    const idNumero = Number(id);

    if (!id || !Number.isInteger(idNumero) || idNumero <= 0) {
        return next(new AppError('El ID del producto debe ser un número entero positivo.', 400));
    }

    req.params.id = idNumero;
    next();
};
