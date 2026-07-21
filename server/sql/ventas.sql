-- ============================================================
-- Módulo: Ventas y Detalle de Ventas
-- Base de Datos: PostgreSQL
-- Archivo: server/sql/ventas.sql
-- Depende de: categorias.sql, productos.sql
-- ============================================================

-- 1. Tabla Encabezado de Ventas
CREATE TABLE IF NOT EXISTS Ventas (
    id_venta         SERIAL PRIMARY KEY,
    numero_venta     VARCHAR(50)  NOT NULL UNIQUE,          -- Código único ej. VNT-2026-0001
    nombre_cliente   VARCHAR(150),                          -- Nombre del comprador (flexible hasta módulo Clientes)
    documento_cliente VARCHAR(30),                          -- Cédula / NIT del comprador (opcional)
    fecha_venta      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subtotal         NUMERIC(12, 2) NOT NULL DEFAULT 0.00   CHECK (subtotal  >= 0),
    impuesto         NUMERIC(12, 2) NOT NULL DEFAULT 0.00   CHECK (impuesto  >= 0),
    descuento        NUMERIC(12, 2) NOT NULL DEFAULT 0.00   CHECK (descuento >= 0),
    total            NUMERIC(12, 2) NOT NULL DEFAULT 0.00   CHECK (total     >= 0),
    estado           VARCHAR(20)  NOT NULL DEFAULT 'Completada'
                       CHECK (estado IN ('Completada', 'Cancelada')),
    observaciones    TEXT,
    fecha_creacion   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Detalle de Ventas (Relación N:M entre Ventas y Productos)
CREATE TABLE IF NOT EXISTS Detalle_Ventas (
    id_detalle_venta SERIAL PRIMARY KEY,
    id_venta         INT  NOT NULL,
    id_producto      INT  NOT NULL,
    cantidad         INT  NOT NULL CHECK (cantidad       > 0),
    precio_unitario  NUMERIC(12, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal         NUMERIC(12, 2) NOT NULL CHECK (subtotal        >= 0),

    -- Llave Foránea hacia Ventas (Cascada al eliminar encabezado)
    CONSTRAINT fk_detalle_ventas_venta
        FOREIGN KEY (id_venta)
        REFERENCES Ventas (id_venta)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- Llave Foránea hacia Productos (Restringida)
    CONSTRAINT fk_detalle_ventas_producto
        FOREIGN KEY (id_producto)
        REFERENCES Productos (id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 3. Índices de Rendimiento para Consultas Frecuentes, Reportes y Dashboard
CREATE INDEX IF NOT EXISTS idx_ventas_numero       ON Ventas(numero_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_estado       ON Ventas(estado);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha        ON Ventas(fecha_venta DESC);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente      ON Ventas(LOWER(COALESCE(nombre_cliente, '')));
CREATE INDEX IF NOT EXISTS idx_detalle_ventas_venta    ON Detalle_Ventas(id_venta);
CREATE INDEX IF NOT EXISTS idx_detalle_ventas_producto ON Detalle_Ventas(id_producto);

-- 4. Trigger para actualización automática de fecha_actualizacion
DROP TRIGGER IF EXISTS trigger_ventas_fecha_actualizacion ON Ventas;

CREATE TRIGGER trigger_ventas_fecha_actualizacion
    BEFORE UPDATE ON Ventas
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion_column();

-- 5. Datos Iniciales (Seeds) — Referencia el producto PROD-ELE-001 (id_producto = 1)
INSERT INTO Ventas (
    numero_venta, nombre_cliente, documento_cliente,
    subtotal, impuesto, descuento, total, estado, observaciones
) VALUES
(
    'VNT-2026-0001',
    'Juan García López',
    '1234567890',
    79.99,
    0.00,
    0.00,
    79.99,
    'Completada',
    'Venta de muestra — carga inicial del sistema'
)
ON CONFLICT (numero_venta) DO NOTHING;

-- Detalle de la venta semilla VNT-2026-0001 (1 unidad de Auriculares Inalámbricos Pro)
INSERT INTO Detalle_Ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal)
SELECT v.id_venta, 1, 1, 79.99, 79.99
FROM Ventas v
WHERE v.numero_venta = 'VNT-2026-0001'
ON CONFLICT DO NOTHING;
