-- Script para configurar UTF-8 y poblar las tablas centros_costos y movimientos_contables
-- Basado en el reporte LETRACAN.RPT

-- Configurar la base de datos para UTF-8
-- Nota: Para SQL Server, se usa COLLATE para manejar caracteres especiales
-- Si la base de datos no está configurada para UTF-8, se puede configurar a nivel de servidor

-- Crear la tabla centros_costos si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='centros_costos' AND xtype='U')
BEGIN
    CREATE TABLE centros_costos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(20) NOT NULL UNIQUE,
        descripcion VARCHAR(100) NOT NULL,
        activo BIT DEFAULT 1,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
    );
    
    -- Crear índices para optimizar consultas
    CREATE INDEX IX_centros_costos_codigo ON centros_costos(codigo);
    CREATE INDEX IX_centros_costos_activo ON centros_costos(activo);
END

-- Crear la tabla movimientos_contables si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='movimientos_contables' AND xtype='U')
BEGIN
    CREATE TABLE movimientos_contables (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cuenta VARCHAR(20) NOT NULL,
        descripcion VARCHAR(50) NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        centro_costo_id INT,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (centro_costo_id) REFERENCES centros_costos(id)
    );
    
    -- Crear índices para optimizar consultas
    CREATE INDEX IX_movimientos_contables_tipo ON movimientos_contables(tipo);
    CREATE INDEX IX_movimientos_contables_cuenta ON movimientos_contables(cuenta);
    CREATE INDEX IX_movimientos_contables_centro_costo_id ON movimientos_contables(centro_costo_id);
END

-- Limpiar datos existentes
DELETE FROM movimientos_contables;
DELETE FROM centros_costos;

-- Insertar centros de costo de ejemplo
INSERT INTO centros_costos (codigo, descripcion) VALUES
('01.01.01.01.01', 'Administración General'),
('01.01.01.01.02', 'Servicios Funerarios'),
('01.01.01.01.03', 'Mantenimiento de Instalaciones'),
('01.01.01.01.04', 'Ventas y Marketing'),
('01.01.01.01.05', 'Recursos Humanos'),
('01.01.01.01.06', 'Contabilidad y Finanzas'),
('01.01.01.01.07', 'Tecnología de Información'),
('01.01.01.01.08', 'Servicios Legales'),
('01.01.01.01.09', 'Seguridad'),
('01.01.01.01.10', 'Limpieza y Aseo'),
('01.01.02.02.00', 'FUNERARIA'),
('01.01.02.02.01', 'Servicios Especializados'),
('01.01.02.02.02', 'Equipos y Maquinaria'),
('01.01.02.02.03', 'Transporte Funerario'),
('01.01.02.02.04', 'Capilla y Ceremonias'),
('01.01.02.02.05', 'Cremación'),
('01.01.02.02.06', 'Cementerio'),
('01.01.02.02.07', 'Florería'),
('01.01.02.02.08', 'Carpintería'),
('01.01.02.02.09', 'Servicios Adicionales');

-- Obtener IDs de centros de costo para usar en las relaciones
DECLARE @centro_admin INT = (SELECT id FROM centros_costos WHERE codigo = '01.01.01.01.01');
DECLARE @centro_funeraria INT = (SELECT id FROM centros_costos WHERE codigo = '01.01.02.02.00');
DECLARE @centro_servicios INT = (SELECT id FROM centros_costos WHERE codigo = '01.01.01.01.02');
DECLARE @centro_mantenimiento INT = (SELECT id FROM centros_costos WHERE codigo = '01.01.01.01.03');
DECLARE @centro_ventas INT = (SELECT id FROM centros_costos WHERE codigo = '01.01.01.01.04');
DECLARE @centro_rrhh INT = (SELECT id FROM centros_costos WHERE codigo = '01.01.01.01.05');
DECLARE @centro_contabilidad INT = (SELECT id FROM centros_costos WHERE codigo = '01.01.01.01.06');

-- Insertar datos de ejemplo - Balance de Situación
INSERT INTO movimientos_contables (cuenta, descripcion, tipo, centro_costo_id) VALUES
('01.1.1.1.002', 'Clientes concesion colares', 'Balance de situación', @centro_ventas),
('01.1.1.1.001', 'Descuentos clientes concesion colares', 'Balance de situación', @centro_ventas),
('01.1.1.1.004', 'Clientes Fondo Mantenimiento', 'Balance de situación', @centro_mantenimiento),
('01.1.1.1.005', 'Otros gastos clientes concesion colares', 'Balance de situación', @centro_ventas),
('01.1.1.1.006', 'Clientes Prov. Incobrables colares', 'Balance de situación', @centro_contabilidad),
('01.1.1.1.007', 'Clientes Resciliados', 'Balance de situación', @centro_ventas),
('01.1.1.1.011', 'Asistencia Funeraria', 'Balance de situación', @centro_funeraria),
('01.1.1.1.012', 'Prov. Incobrables de Asistenc.Funeraria', 'Balance de situación', @centro_contabilidad),
('01.1.1.1.013', 'Clientes Resciliados Asist.Funeraria', 'Balance de situación', @centro_funeraria),
('02.1.1.1.002', 'Clientes concesion polares', 'Balance de situación', @centro_ventas),
('02.1.1.1.003', 'Descuentos clientes concesion', 'Balance de situación', @centro_ventas),
('02.1.1.1.004', 'Clientes Fondo Mantenimiento', 'Balance de situación', @centro_mantenimiento),
('02.1.1.1.005', 'Otros gastos clientes concesion', 'Balance de situación', @centro_ventas),
('02.1.1.1.006', 'Clientes prov. Incobrables Colares', 'Balance de situación', @centro_contabilidad),
('02.1.1.1.007', 'Clientes resciliados', 'Balance de situación', @centro_ventas),
('02.1.1.1.011', 'Asistencia Funeraria', 'Balance de situación', @centro_funeraria),
('02.1.1.1.012', 'Prov. Incobrables de Asistenc.', 'Balance de situación', @centro_contabilidad),
('02.1.1.1.013', 'Clientes resciliados Asist.Funeraria', 'Balance de situación', @centro_funeraria),
('03.1.1.1.001', 'Depósitos Caja Bancos', 'Balance de situación', @centro_contabilidad);

-- Insertar datos de ejemplo - Cuenta de orden
INSERT INTO movimientos_contables (cuenta, descripcion, tipo, centro_costo_id) VALUES
('04.1.1.1.001', 'Provision Capital Contratantes', 'Cuenta de orden', @centro_contabilidad),
('04.1.1.1.002', 'Provision Fondo de Mantenimiento', 'Cuenta de orden', @centro_mantenimiento),
('04.1.1.1.003', 'Provisión Incobrables', 'Cuenta de orden', @centro_contabilidad),
('04.1.1.1.004', 'Provision 10', 'Cuenta de orden', @centro_contabilidad),
('04.1.1.1.010', 'Asistencia Funeraria', 'Cuenta de orden', @centro_funeraria),
('04.1.1.1.011', 'Provision Incobrables Asistencia Funeraria', 'Cuenta de orden', @centro_contabilidad),
('05.1.1.1.001', 'Cuenta clientes Concesion', 'Cuenta de orden', @centro_ventas),
('05.1.1.1.004', 'Clientes de Mantenimiento', 'Cuenta de orden', @centro_mantenimiento),
('05.1.1.1.005', 'Otros gastos clientes concesion', 'Cuenta de orden', @centro_ventas),
('05.1.1.1.006', 'Clientes prov. Incobrables', 'Cuenta de orden', @centro_contabilidad),
('05.1.1.1.007', 'Clientes resciliados', 'Cuenta de orden', @centro_ventas),
('05.1.1.1.011', 'Asistencia Funeraria', 'Cuenta de orden', @centro_funeraria),
('05.1.1.1.012', 'Prov. Incobrables Asistencia', 'Cuenta de orden', @centro_contabilidad),
('05.1.1.1.013', 'Clientes resciliados Asist.Funeraria', 'Cuenta de orden', @centro_funeraria);

-- Insertar datos de ejemplo - Estado de resultados
INSERT INTO movimientos_contables (cuenta, descripcion, tipo, centro_costo_id) VALUES
('60.1.1.1.001', 'Ingresos por Servicios Funerarios', 'Estado de resultados', @centro_funeraria),
('60.1.1.1.002', 'Ingresos por Mantenimiento', 'Estado de resultados', @centro_mantenimiento),
('60.1.1.1.003', 'Otros Ingresos Operacionales', 'Estado de resultados', @centro_ventas),
('61.1.1.1.001', 'Costo de Ventas - Servicios', 'Estado de resultados', @centro_funeraria),
('61.1.1.1.002', 'Costo de Ventas - Productos', 'Estado de resultados', @centro_ventas),
('62.1.1.1.001', 'Gastos de Administración', 'Estado de resultados', @centro_admin),
('62.1.1.1.002', 'Gastos de Ventas', 'Estado de resultados', @centro_ventas),
('62.1.1.1.003', 'Gastos Financieros', 'Estado de resultados', @centro_contabilidad),
('62.1.1.1.004', 'Gastos de Personal', 'Estado de resultados', @centro_rrhh),
('62.1.1.1.005', 'Gastos de Servicios Públicos', 'Estado de resultados', @centro_admin),
('62.1.1.1.006', 'Gastos de Mantenimiento', 'Estado de resultados', @centro_mantenimiento),
('62.1.1.1.007', 'Gastos de Seguros', 'Estado de resultados', @centro_admin),
('62.1.1.1.008', 'Gastos de Impuestos', 'Estado de resultados', @centro_contabilidad),
('62.1.1.1.009', 'Otros Gastos Operacionales', 'Estado de resultados', @centro_admin),
('63.1.1.1.001', 'Ingresos Financieros', 'Estado de resultados', @centro_contabilidad),
('63.1.1.1.002', 'Gastos Financieros', 'Estado de resultados', @centro_contabilidad),
('64.1.1.1.001', 'Otros Ingresos', 'Estado de resultados', @centro_ventas),
('64.1.1.1.002', 'Otros Gastos', 'Estado de resultados', @centro_admin),
('65.1.1.1.001', 'Impuesto sobre la Renta', 'Estado de resultados', @centro_contabilidad);

-- Verificar la inserción de centros de costo
SELECT 
    'Centros de Costo' as tabla,
    COUNT(*) as cantidad_registros
FROM centros_costos 
WHERE activo = 1;

-- Verificar la inserción de movimientos contables por tipo
SELECT 
    'Movimientos Contables' as tabla,
    tipo,
    COUNT(*) as cantidad_registros
FROM movimientos_contables 
GROUP BY tipo 
ORDER BY tipo;

-- Mostrar algunos registros de ejemplo con centro de costo
SELECT TOP 10 
    mc.cuenta,
    mc.descripcion,
    mc.tipo,
    cc.codigo as centro_costo_codigo,
    cc.descripcion as centro_costo_descripcion,
    mc.createdAt
FROM movimientos_contables mc
LEFT JOIN centros_costos cc ON mc.centro_costo_id = cc.id
ORDER BY mc.tipo, mc.cuenta; 