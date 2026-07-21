-- ============================================================
-- Módulo: Compras y Detalle de Compras
-- Base de Datos: PostgreSQL
-- Archivo: server/sql/compras.sql
-- ============================================================

-- 1. Tabla Encabezado de Compras
CREATE TABLE IF NOT EXISTS Compras (
    id_compra SERIAL PRIMARY KEY,
    id_proveedor INT NOT NULL,
    numero_compra VARCHAR(50) NOT NULL UNIQUE,          -- Código único de orden ej. CMP-2026-0001
    fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    impuesto NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (impuesto >= 0),
    descuento NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (descuento >= 0),
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Recibida', 'Cancelada')),
    observaciones TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Llave Foránea hacia Proveedores
    CONSTRAINT fk_compras_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES Proveedores (id_proveedor)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 2. Tabla Detalle de Compras (Relación N:M entre Compras y Productos)
CREATE TABLE IF NOT EXISTS Detalle_Compras (
    id_detalle_compra SERIAL PRIMARY KEY,
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),

    -- Llave Foránea hacia Compras (Cascada al eliminar encabezado)
    CONSTRAINT fk_detalle_compras_compra
        FOREIGN KEY (id_compra)
        REFERENCES Compras (id_compra)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- Llave Foránea hacia Productos
    CONSTRAINT fk_detalle_compras_producto
        FOREIGN KEY (id_producto)
        REFERENCES Productos (id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 3. Índices de Rendimiento para Consultas Frecuentes, Dashboard e Historial
CREATE INDEX IF NOT EXISTS idx_compras_id_proveedor ON Compras(id_proveedor);
CREATE INDEX IF NOT EXISTS idx_compras_numero ON Compras(numero_compra);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON Compras(estado);
CREATE INDEX IF NOT EXISTS idx_detalle_compras_id_compra ON Detalle_Compras(id_compra);
CREATE INDEX IF NOT EXISTS idx_detalle_compras_id_producto ON Detalle_Compras(id_producto);

-- 4. Trigger para actualización automática de fecha_actualizacion en Compras
DROP TRIGGER IF EXISTS trigger_compras_fecha_actualizacion ON Compras;

CREATE TRIGGER trigger_compras_fecha_actualizacion
    BEFORE UPDATE ON Compras
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion_column();

-- 5. Datos Iniciales (Seeds) de Compras con Estado 'Recibida'
INSERT INTO Compras (
    id_proveedor, numero_compra, subtotal, impuesto, descuento, total, estado, observaciones
) VALUES
(
    1, 
    'CMP-2026-0001', 
    1350.00, 
    256.50, 
    0.00, 
    1606.50, 
    'Recibida', 
    'Abastecimiento inicial de Auriculares Pro y Mochilas Urbanas'
)
ON CONFLICT (numero_compra) DO NOTHING;

-- Insertar detalle de la compra semilla CMP-2026-0001
INSERT INTO Detalle_Compras (id_compra, id_producto, cantidad, precio_unitario, subtotal)
SELECT c.id_compra, 1, 20, 45.00, 900.00
FROM Compras c WHERE c.numero_compra = 'CMP-2026-0001'
ON CONFLICT DO NOTHING;

INSERT INTO Detalle_Compras (id_compra, id_producto, cantidad, precio_unitario, subtotal)
SELECT c.id_compra, 2, 20, 22.50, 450.00
FROM Compras c WHERE c.numero_compra = 'CMP-2026-0001'
ON CONFLICT DO NOTHING;
