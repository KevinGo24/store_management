-- ============================================================
-- Módulo: Inventario y Auditoría de Movimientos
-- Base de Datos: PostgreSQL
-- Archivo: server/sql/inventario.sql
-- ============================================================

-- 1. Crear Tabla de Movimientos_Inventario
CREATE TABLE IF NOT EXISTS Movimientos_Inventario (
    id_movimiento SERIAL PRIMARY KEY,
    id_producto INT NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('Entrada', 'Salida', 'Ajuste')),
    origen VARCHAR(30) NOT NULL CHECK (origen IN ('Compra', 'Venta', 'Ajuste_Manual', 'Devolucion', 'Inicial')),
    referencia VARCHAR(100),                          -- Código de Compra, Factura o Ticket ej. CMP-2026-0001
    cantidad INT NOT NULL CHECK (cantidad > 0),
    stock_anterior INT NOT NULL CHECK (stock_anterior >= 0),
    stock_nuevo INT NOT NULL CHECK (stock_nuevo >= 0),
    costo_unitario NUMERIC(12, 2) DEFAULT 0.00 CHECK (costo_unitario >= 0), -- Valoración exacta al momento del movimiento
    observacion TEXT,
    usuario_responsable VARCHAR(100) DEFAULT 'Sistema',
    fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Llave Foránea hacia Productos
    CONSTRAINT fk_movimientos_producto
        FOREIGN KEY (id_producto)
        REFERENCES Productos (id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 2. Índices de Rendimiento para Kardex, Auditoría y Reportes
CREATE INDEX IF NOT EXISTS idx_movimientos_id_producto ON Movimientos_Inventario(id_producto);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON Movimientos_Inventario(tipo_movimiento);
CREATE INDEX IF NOT EXISTS idx_movimientos_origen ON Movimientos_Inventario(origen);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON Movimientos_Inventario(fecha_movimiento DESC);

-- 3. Datos Iniciales (Seeds) para auditoría de productos existentes
INSERT INTO Movimientos_Inventario (
    id_producto, tipo_movimiento, origen, referencia, cantidad, stock_anterior, stock_nuevo, costo_unitario, observacion, usuario_responsable
) VALUES
(
    1, 
    'Entrada', 
    'Inicial', 
    'INIT-2026-001', 
    10, 
    0, 
    10, 
    45.00, 
    'Carga de inventario inicial', 
    'Administrador'
),
(
    1, 
    'Entrada', 
    'Compra', 
    'CMP-2026-0001', 
    20, 
    10, 
    30, 
    45.00, 
    'Ingreso por Orden de Compra CMP-2026-0001', 
    'Sistema'
),
(
    2, 
    'Entrada', 
    'Compra', 
    'CMP-2026-0001', 
    15, 
    0, 
    15, 
    22.50, 
    'Ingreso por Orden de Compra CMP-2026-0001', 
    'Sistema'
)
ON CONFLICT DO NOTHING;
