-- ============================================================
-- Módulo: Proveedores
-- Base de Datos: PostgreSQL
-- Archivo: server/sql/proveedores.sql
-- ============================================================

-- 1. Crear Tabla de Proveedores
CREATE TABLE IF NOT EXISTS Proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nit VARCHAR(30) NOT NULL UNIQUE,                -- NIT / RUT / Identificación Fiscal única
    correo VARCHAR(100),
    telefono VARCHAR(30),
    direccion TEXT,
    ciudad VARCHAR(100),
    contacto_principal VARCHAR(100),                -- Nombre de la persona de contacto
    condiciones_pago VARCHAR(50) DEFAULT 'Contado', -- Contado, Crédito 15 días, Crédito 30 días, etc.
    tiempo_entrega_dias INT DEFAULT 1 CHECK (tiempo_entrega_dias >= 0), -- Días estimados de abastecimiento
    sitio_web VARCHAR(255),
    observaciones TEXT,                             -- Datos bancarios, notas fiscales o acuerdos comerciales
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Índices de Rendimiento para Búsquedas e Integración con Compras
CREATE INDEX IF NOT EXISTS idx_proveedores_nit ON Proveedores(nit);
CREATE INDEX IF NOT EXISTS idx_proveedores_nombre ON Proveedores(LOWER(nombre));
CREATE INDEX IF NOT EXISTS idx_proveedores_activo ON Proveedores(activo);

-- 3. Trigger para actualización automática de fecha_actualizacion
DROP TRIGGER IF EXISTS trigger_proveedores_fecha_actualizacion ON Proveedores;

CREATE TRIGGER trigger_proveedores_fecha_actualizacion
    BEFORE UPDATE ON Proveedores
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion_column();

-- 4. Datos Iniciales (Seeds)
INSERT INTO Proveedores (
    nombre, nit, correo, telefono, direccion, ciudad, contacto_principal, condiciones_pago, tiempo_entrega_dias, sitio_web, observaciones
) VALUES
(
    'Distribuidora TechCorp S.A.S.',
    '900123456-1',
    'ventas@techcorp.com',
    '+57 601 555 1234',
    'Calle 100 # 15-20, Oficina 501',
    'Bogotá',
    'Carlos Mendoza',
    'Crédito 30 días',
    3,
    'https://www.techcorp.com',
    'Proveedor principal de tecnología y accesorios de computación. Descuento del 5% por pronto pago.'
),
(
    'Comercializadora Textil del Norte',
    '800987654-2',
    'contacto@textilnorte.com',
    '+57 604 444 8899',
    'Carrera 43A # 1-50',
    'Medellín',
    'María Fernanda Gómez',
    'Contado',
    2,
    'https://www.textilnorte.com',
    'Entrega directa en bodega. Facturación electrónica inmediata.'
),
(
    'Suministros Globales del Caribe',
    '901456789-3',
    'atencion@suministrosglobales.co',
    '+57 605 333 7711',
    'Vía 40 # 73-290',
    'Barranquilla',
    'Jorge Eliécer Silva',
    'Crédito 15 días',
    5,
    'https://www.suministrosglobales.co',
    'Proveedor de productos de hogar, termos e insumos generales.'
)
ON CONFLICT (nit) DO NOTHING;
