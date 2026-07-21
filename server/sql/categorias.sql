-- ============================================================
-- Módulo: Categorías
-- Base de Datos: PostgreSQL
-- Archivo: server/sql/categorias.sql
-- ============================================================

-- 1. Crear Tabla de Categorías
CREATE TABLE IF NOT EXISTS Categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Función y Trigger para actualización automática de fecha_actualizacion
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_categorias_fecha_actualizacion ON Categorias;

CREATE TRIGGER trigger_categorias_fecha_actualizacion
    BEFORE UPDATE ON Categorias
    FOR EACH ROW
    EXECUTE FUNCTION update_fecha_actualizacion_column();

-- 3. Datos Iniciales (Seeds)
INSERT INTO Categorias (nombre, descripcion) VALUES
    ('Electrónica', 'Dispositivos electrónicos, gadgets y accesorios tecnológicos'),
    ('Moda y Calzado', 'Prendas de vestir, calzado y accesorios de vestir'),
    ('Hogar y Cocina', 'Electrodomésticos, utensilios de cocina y artículos del hogar'),
    ('Herramientas', 'Herramientas manuales y eléctricas para construcción o reparación'),
    ('Deportes', 'Artículos deportivos, ropa de ejercicio y equipamiento')
ON CONFLICT (nombre) DO NOTHING;
