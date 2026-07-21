-- ============================================================
-- Módulo: Productos
-- Base de Datos: PostgreSQL
-- Archivo: server/sql/productos.sql
-- ============================================================

-- 1. Crear Tabla de Productos
CREATE TABLE IF NOT EXISTS Productos (
    id_producto SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,          -- SKU o Código de producto único
    codigo_barras VARCHAR(50) UNIQUE,             -- Código EAN/UPC para escáner
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    marca VARCHAR(100),                            -- Marca del producto
    unidad_medida VARCHAR(20) DEFAULT 'unidad',    -- unidad, kg, litro, caja, paquete, etc.
    precio_compra NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (precio_compra >= 0),
    precio_venta NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (precio_venta >= 0),
    stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo INT NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
    imagen_url TEXT,                               -- URL de imagen para el catálogo visual
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Llave Foránea hacia Categorias (Restringe la eliminación de categorías usadas)
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES Categorias (id_categoria)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 2. Índices de rendimiento para consultas frecuentes de Búsqueda, Dashboard e Inventario
CREATE INDEX IF NOT EXISTS idx_productos_id_categoria ON Productos(id_categoria);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON Productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_stock_alerta ON Productos(stock_actual, stock_minimo) WHERE activo = TRUE;

-- 3. Trigger para actualización automática de fecha_actualizacion
DROP TRIGGER IF EXISTS trigger_productos_fecha_actualizacion ON Productos;

CREATE TRIGGER trigger_productos_fecha_actualizacion
    BEFORE UPDATE ON Productos
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion_column();

-- 4. Datos Iniciales (Seeds) vinculados a las Categorías Semilla
INSERT INTO Productos 
(id_categoria, codigo, codigo_barras, nombre, marca, unidad_medida, precio_compra, precio_venta, stock_actual, stock_minimo, descripcion, imagen_url) 
VALUES
(
    1, 
    'PROD-ELE-001', 
    '7701234567890', 
    'Auriculares Inalámbricos Pro', 
    'BlackShark', 
    'unidad', 
    45.00, 
    79.99, 
    30, 
    10, 
    'Cancelación de ruido activa y batería de hasta 30 horas de duración.',
    'https://i.blogs.es/3d1180/blackshark1/1366_2000.jpeg'
),
(
    2, 
    'PROD-MOD-001', 
    '7701234567891', 
    'Mochila Urbana Impermeable', 
    'UrbanGear', 
    'unidad', 
    22.50, 
    45.00, 
    15, 
    5, 
    'Diseño ergonómico con compartimento seguro para laptop de 15 pulgadas.',
    'https://i5.walmartimages.cl/asr/7c5c0a19-0cab-4943-83de-f6450a8256ad.288539c61d3ce8077fc20184a7835f63.jpeg'
),
(
    3, 
    'PROD-HOG-001', 
    '7701234567892', 
    'Termo de Acero Inoxidable 500ml', 
    'EcoSapiens', 
    'unidad', 
    11.00, 
    24.99, 
    4, 
    8, 
    'Mantiene tus bebidas frías o calientes durante más de 12 horas continuas.',
    'https://www.tiendaecosapiens.com/cdn/shop/files/Termo_de_Acero_Inoxidable_500_ml.jpg'
)
ON CONFLICT (codigo) DO NOTHING;
