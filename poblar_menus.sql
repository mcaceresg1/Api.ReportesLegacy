-- =====================================================
-- SCRIPT PARA POBLAR BASE DE DATOS DE MENÚS
-- ACTUALIZADO CON DATOS COMPLETOS DE LA TABLA
-- =====================================================

-- Limpiar datos existentes (solo para desarrollo)
DELETE FROM dbo.RolSistemaMenu;
DELETE FROM dbo.Menus;

-- =====================================================
-- 1. VERIFICAR ROLES EXISTENTES Y CREAR FALTANTES
-- =====================================================
PRINT 'Verificando roles existentes...'

-- Rol 3: Atención Cliente
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE id = 3)
BEGIN
    SET IDENTITY_INSERT dbo.Roles ON;
    INSERT INTO dbo.Roles (id, descripcion, descripcion_completa, estado, createdAt, updatedAt) VALUES
    (3, 'Atención Cliente', '1.- Atención Cliente', 1, GETDATE(), GETDATE());
    SET IDENTITY_INSERT dbo.Roles OFF;
    PRINT 'Rol Atención Cliente creado'
END
ELSE
    PRINT 'Rol Atención Cliente ya existe'

-- Rol 4: Tesorería y Caja
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE id = 4)
BEGIN
    SET IDENTITY_INSERT dbo.Roles ON;
    INSERT INTO dbo.Roles (id, descripcion, descripcion_completa, estado, createdAt, updatedAt) VALUES
    (4, 'Tesorería y Caja', '2.- Tesorería y Caja', 1, GETDATE(), GETDATE());
    SET IDENTITY_INSERT dbo.Roles OFF;
    PRINT 'Rol Tesorería y Caja creado'
END
ELSE
    PRINT 'Rol Tesorería y Caja ya existe'

-- Rol 5: Gestión de Personal
IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE id = 5)
BEGIN
    SET IDENTITY_INSERT dbo.Roles ON;
    INSERT INTO dbo.Roles (id, descripcion, descripcion_completa, estado, createdAt, updatedAt) VALUES
    (5, 'Gestión de Personal', '5.- Gestión de Personal', 1, GETDATE(), GETDATE());
    SET IDENTITY_INSERT dbo.Roles OFF;
    PRINT 'Rol Gestión de Personal creado'
END
ELSE
    PRINT 'Rol Gestión de Personal ya existe'

-- =====================================================
-- 2. VERIFICAR Y CREAR SISTEMAS FALTANTES
-- =====================================================
PRINT 'Verificando sistemas existentes...'

-- Crear sistema Excel (ID 5) si no existe
IF NOT EXISTS (SELECT 1 FROM dbo.Sistemas WHERE descripcion = 'Excel')
BEGIN
    INSERT INTO dbo.Sistemas (descripcion, estado, createdAt, updatedAt) VALUES
    ('Excel', 1, GETDATE(), GETDATE());
    PRINT 'Sistema Excel creado'
END
ELSE
    PRINT 'Sistema Excel ya existe'

-- =====================================================
-- 3. SISTEMAS EXISTENTES MAPEADOS
-- =====================================================
-- ID 1: Exactus (EXACTUS)
-- ID 2: Clipper (CLIPPER-TNEW0000, CLIPPER-PARQUE1)  
-- ID 3: Oficon (ORACLE, OFICON)
-- ID 4: Hmis (HMIS)
-- ID 5: Excel (EXCEL)

PRINT 'Usando sistemas existentes:'
SELECT id, descripcion FROM dbo.Sistemas ORDER BY id;

-- =====================================================
-- 4. INSERTAR MENÚS PRINCIPALES Y SUBMENÚS
-- =====================================================
PRINT 'Insertando menús completos...'

INSERT INTO dbo.Menus (descripcion, padreId, icon, ruta, areaUsuaria, sistemaCode, routePath, estado) VALUES

-- ===== 1.- ATENCIÓN CLIENTE =====
('Contratos / Inf. Financiera', NULL, 'CreditCard', 'Contratos / Inf. Financiera', '1.- Atención Cliente', 'ORACLE', '/home/contratos-financiera', 1),
('Consultas / Contratos', NULL, 'Search', 'Consultas / Contratos', '1.- Atención Cliente', 'CLIPPER-TNEW0000', '/home/consultas-contratos', 1),
('Documentos / Contratos', NULL, 'FileText', 'Documentos / Contratos', '1.- Atención Cliente', 'CLIPPER-PARQUE1', '/home/documentos-contratos', 1),
('Contratos / Contratos', NULL, 'FileCheck', 'Contratos / Contratos', '1.- Atención Cliente', 'HMIS', '/home/hmis-contratos', 1),

-- ===== 2.- TESORERÍA Y CAJA =====
('CxP / TRN / Documentos', NULL, 'Receipt', 'CxP / TRN / Documentos', '2.- Tesorería y Caja', 'EXACTUS', '/home/cxp-documentos', 1),
('CxP / RST / RCXP / Detalle de Movimientos por Pagar', NULL, 'BarChart', 'CxP / RST / RCXP / Detalle de Movimientos por Pagar', '2.- Tesorería y Caja', 'EXACTUS', '/home/detalle-movimientos-pagar', 1),
('CG / RST / LO / MC / Reporte de Movimientos Contables', NULL, 'PieChart', 'CG / RST / LO / MC / Reporte de Movimientos Contables', '2.- Tesorería y Caja', 'EXACTUS', '/home/reporte-movimientos-contables-tesoreria', 1),

-- ===== 4.- CONTABILIDAD =====
-- Menús de Configuración (CG / CO)
('De Cuentas Contables', NULL, 'Calculator', 'CG / CO / De Cuentas Contables', '4.- Contabilidad', 'EXACTUS', '/home/cuentas-contables', 1),
('De Centros de Costo', NULL, 'Building', 'CG / CO / De Centros de Costo', '4.- Contabilidad', 'EXACTUS', '/home/centros-costo', 1),
('De Períodos Contables', NULL, 'Calendar', 'CG / CO / De Períodos Contables', '4.- Contabilidad', 'EXACTUS', '/home/periodos-contables', 1),
('Por NITs', NULL, 'Hash', 'CG / CO / Por NITs', '4.- Contabilidad', 'EXACTUS', '/home/nits', 1),
('De Saldos Promedios', NULL, 'TrendingUp', 'CG / CO / De Saldos Promedios', '4.- Contabilidad', 'EXACTUS', '/home/saldos-promedios', 1),

-- Libro Mayor (Menú Principal con Submenús)
('Libro Mayor', NULL, 'Book', 'CG / CO / Libro Mayor', '4.- Contabilidad', 'EXACTUS', '/home/libro-mayor', 1),

-- Reportes Libros Oficiales (CG / RST / LO)
('Libro Mayor de Contabilidad', NULL, 'BookOpen', 'CG / RST / LO / Libro Mayor de Contabilidad', '4.- Contabilidad', 'EXACTUS', '/home/libro-mayor-contabilidad', 1),
('Diario de Contabilidad', NULL, 'FileText', 'CG / RST / LO / Diario de Contabilidad', '4.- Contabilidad', 'EXACTUS', '/home/diario-contabilidad', 1),
('Diario de Contabilidad - Plan Contable', NULL, 'Map', 'CG / RST / LO / Diario de Contabilidad - Plan Contable', '4.- Contabilidad', 'EXACTUS', '/home/diario-plan-contable', 1),
('Balance de Comprobacion', NULL, 'Scale', 'CG / RST / LO / Balance de Comprobacion', '4.- Contabilidad', 'EXACTUS', '/home/balance-comprobacion', 1),
('Reporte Generico de Saldos', NULL, 'Database', 'CG / RST / LO / Reporte Generico de Saldos', '4.- Contabilidad', 'EXACTUS', '/home/reporte-saldos', 1),

-- Reportes Movimientos Contables (CG / RST / MC)
('Reporte de Movimientos Contables', NULL, 'Activity', 'CG / RST / MC / Reporte de Movimientos Contables', '4.- Contabilidad', 'EXACTUS', '/home/movimientos-contables', 1),
('Movimientos Contables Agrupados por NIT - Dimension Contable', NULL, 'Users', 'CG / RST / MC / Movimientos Contables Agrupados por NIT - Dimension Contable', '4.- Contabilidad', 'EXACTUS', '/home/movimientos-agrupados-nit', 1),
('Listado Comparativo de Movimientos por Centro de Costos', NULL, 'GitCompare', 'CG / RST / MC / Listado Comparativo de Movimientos por Centro de Costos', '4.- Contabilidad', 'EXACTUS', '/home/comparativo-centros-costo', 1),
('Reporte de Gastos por Clase Destino', NULL, 'Target', 'CG / RST / MC / Reporte de Gastos por Clase Destino', '4.- Contabilidad', 'EXACTUS', '/home/gastos-clase-destino', 1),
('Resumen de Asientos', NULL, 'List', 'CG / RST / MC / Resumen de Asientos', '4.- Contabilidad', 'EXACTUS', '/home/resumen-asientos', 1),
('Reporte de Asientos sin Dimensión', NULL, 'AlertCircle', 'CG / RST / MC / Reporte de Asientos sin Dimensión', '4.- Contabilidad', 'EXACTUS', '/home/asientos-sin-dimension', 1),
('Catalogo de Cuentas Contables Creadas o Modificadas', NULL, 'Edit3', 'CG / RST / MC / Catalogo de Cuentas Contables Creadas o Modificadas', '4.- Contabilidad', 'EXACTUS', '/home/catalogo-cuentas-modificadas', 1),

-- Estados Financieros (CG / RST / EF)
('Estado de Situacion Financiera', NULL, 'FileSpreadsheet', 'CG / RST / EF / Estado de Situacion Financiera', '4.- Contabilidad', 'EXACTUS', '/home/estado-situacion-financiera', 1),
('Estado de Resultados', NULL, 'TrendingUp', 'CG / RST / EF / Estado de Resultados', '4.- Contabilidad', 'EXACTUS', '/home/estado-resultados', 1),

-- CONTABILIDAD OFICON
('Libro Diario', NULL, 'Book', 'CONTABILIDAD / Empresa / Reportes / LO / Libro Diario', '4.- Contabilidad', 'OFICON', '/home/libro-diario-oficon', 1),
('Libro Mayor General Analítico', NULL, 'BookOpen', 'CONTABILIDAD / Empresa / Reportes / LO / Libro Mayor General Analítico', '4.- Contabilidad', 'OFICON', '/home/libro-mayor-analitico-oficon', 1),
('Registros / Compras', NULL, 'ShoppingCart', 'CONTABILIDAD / Empresa / Reportes / LO / Registros / Compras', '4.- Contabilidad', 'OFICON', '/home/registros-compras-oficon', 1),
('Registros / Ventas', NULL, 'ShoppingBag', 'CONTABILIDAD / Empresa / Reportes / LO / Registros / Ventas', '4.- Contabilidad', 'OFICON', '/home/registros-ventas-oficon', 1),
('Balance de Comprobacion OFICON', NULL, 'Scale', 'CONTABILIDAD / Empresa / Reportes / LO / Balances / Balance de Comprobacion', '4.- Contabilidad', 'OFICON', '/home/balance-comprobacion-oficon', 1),
('Libro Inventarios y Balances', NULL, 'Package', 'CONTABILIDAD / Empresa / Reportes / LO / Libro Inventarios y Balances', '4.- Contabilidad', 'OFICON', '/home/libro-inventarios-balances-oficon', 1),
('Patrimonio Neto / Reporte', NULL, 'PiggyBank', 'CONTABILIDAD / Empresa / Reportes / LO / Patrimonio Neto / Reporte', '4.- Contabilidad', 'OFICON', '/home/patrimonio-neto-oficon', 1),

-- ===== 5.- GESTIÓN DE PERSONAL =====
-- EXACTUS
('Acciones de Personal', NULL, 'Users', 'GN / Favoritos / Acciones de Personal', '5.- Gestión de Personal', 'EXACTUS', '/home/acciones-personal', 1),
('Contratos', NULL, 'Edit', 'GN /Favoritos / Contratos', '5.- Gestión de Personal', 'EXACTUS', '/home/contratos-gestion', 1),
('Interfaz de Reportes (CX) / Prestamos', NULL, 'CreditCard', 'GN /Favoritos / Interfaz de Reportes (CX) / Prestamos', '5.- Gestión de Personal', 'EXACTUS', '/home/prestamos-cx', 1),
('Rol de Vacaciones', NULL, 'Calendar', 'GN /Favoritos / Rol de Vacaciones', '5.- Gestión de Personal', 'EXACTUS', '/home/rol-vacaciones', 1),
('Interfaz Reportes (GN) / Reporte Anualizado', NULL, 'BarChart', 'GN /Favoritos / Interfaz Reportes (GN) / Reporte Anualizado', '5.- Gestión de Personal', 'EXACTUS', '/home/reporte-anualizado-gn', 1),
('Boletas / Boleta Pago "FIDPLAN"', NULL, 'Receipt', 'GN /Favoritos / Boletas / Boleta Pago "FIDPLAN"', '5.- Gestión de Personal', 'EXACTUS', '/home/boleta-pago-fidplan', 1),
('Prestamos de Cuenta Corriente (CX)', NULL, 'Banknote', 'GN /Favoritos / Prestamos de Cuenta Corriente (CX)', '5.- Gestión de Personal', 'EXACTUS', '/home/prestamos-cuenta-corriente', 1),

-- EXCEL
('Planillon', NULL, 'Grid3X3', 'Planillon', '5.- Gestión de Personal', 'EXCEL', '/home/planillon-excel', 1),

-- OFICON
('Planilla Anualizada', NULL, 'Calendar', 'GN / OFICON / Planilla Anualizada', '5.- Gestión de Personal', 'OFICON', '/home/planilla-anualizada-oficon', 1);

PRINT 'Menús principales insertados'

-- =====================================================
-- 5. INSERTAR SUBMENÚS DEL LIBRO MAYOR
-- =====================================================
DECLARE @LibroMayorId INT;
SELECT @LibroMayorId = id FROM dbo.Menus WHERE descripcion = 'Libro Mayor' AND areaUsuaria = '4.- Contabilidad';

IF @LibroMayorId IS NOT NULL
BEGIN
    INSERT INTO dbo.Menus (descripcion, padreId, icon, ruta, areaUsuaria, sistemaCode, routePath, estado) VALUES
    ('Del Mayor / Asientos', @LibroMayorId, 'Edit', 'CG / CO / Del Mayor / Asientos', '4.- Contabilidad', 'EXACTUS', '/home/libro-mayor/asientos', 1),
    ('Del Diario / Asientos', @LibroMayorId, 'FileEdit', 'CG / CO / Del Diario / Asientos', '4.- Contabilidad', 'EXACTUS', '/home/libro-mayor/diario-asientos', 1);
    
    PRINT 'Submenús del Libro Mayor insertados'
END

-- =====================================================
-- 6. CREAR RELACIONES ROL-SISTEMA-MENÚ
-- =====================================================
PRINT 'Creando relaciones rol-sistema-menú...'

-- ROL 1 (ADMINISTRADOR) - ACCESO A TODOS LOS MENÚS EN TODOS LOS SISTEMAS
INSERT INTO dbo.RolSistemaMenu (rolId, sistemaId, menuId, estado, createdAt, updatedAt)
SELECT 1, 
       CASE 
           WHEN sistemaCode = 'EXACTUS' THEN 1
           WHEN sistemaCode LIKE 'CLIPPER%' THEN 2
           WHEN sistemaCode = 'ORACLE' OR sistemaCode = 'OFICON' THEN 3
           WHEN sistemaCode = 'HMIS' THEN 4
           WHEN sistemaCode = 'EXCEL' THEN 5
           ELSE 1 -- Por defecto Exactus
       END as sistemaId,
       id, 1, GETDATE(), GETDATE()
FROM dbo.Menus;

-- ROL 2 (CONTABILIDAD) - Solo menús de contabilidad
INSERT INTO dbo.RolSistemaMenu (rolId, sistemaId, menuId, estado, createdAt, updatedAt)
SELECT 2, 
       CASE 
           WHEN sistemaCode = 'EXACTUS' THEN 1
           WHEN sistemaCode LIKE 'CLIPPER%' THEN 2
           WHEN sistemaCode = 'ORACLE' OR sistemaCode = 'OFICON' THEN 3
           WHEN sistemaCode = 'HMIS' THEN 4
           WHEN sistemaCode = 'EXCEL' THEN 5
           ELSE 1
       END as sistemaId,
       id, 1, GETDATE(), GETDATE()
FROM dbo.Menus 
WHERE areaUsuaria = '4.- Contabilidad';

-- ROL 3 (ATENCIÓN CLIENTE) - Solo menús de su área
INSERT INTO dbo.RolSistemaMenu (rolId, sistemaId, menuId, estado, createdAt, updatedAt)
SELECT 3, 
       CASE 
           WHEN sistemaCode = 'EXACTUS' THEN 1
           WHEN sistemaCode LIKE 'CLIPPER%' THEN 2
           WHEN sistemaCode = 'ORACLE' OR sistemaCode = 'OFICON' THEN 3
           WHEN sistemaCode = 'HMIS' THEN 4
           WHEN sistemaCode = 'EXCEL' THEN 5
           ELSE 1
       END as sistemaId,
       id, 1, GETDATE(), GETDATE()
FROM dbo.Menus 
WHERE areaUsuaria = '1.- Atención Cliente';

-- ROL 4 (TESORERÍA) - Solo menús de su área
INSERT INTO dbo.RolSistemaMenu (rolId, sistemaId, menuId, estado, createdAt, updatedAt)
SELECT 4, 
       CASE 
           WHEN sistemaCode = 'EXACTUS' THEN 1
           WHEN sistemaCode LIKE 'CLIPPER%' THEN 2
           WHEN sistemaCode = 'ORACLE' OR sistemaCode = 'OFICON' THEN 3
           WHEN sistemaCode = 'HMIS' THEN 4
           WHEN sistemaCode = 'EXCEL' THEN 5
           ELSE 1
       END as sistemaId,
       id, 1, GETDATE(), GETDATE()
FROM dbo.Menus 
WHERE areaUsuaria = '2.- Tesorería y Caja';

-- ROL 5 (GESTIÓN PERSONAL) - Solo menús de su área
INSERT INTO dbo.RolSistemaMenu (rolId, sistemaId, menuId, estado, createdAt, updatedAt)
SELECT 5, 
       CASE 
           WHEN sistemaCode = 'EXACTUS' THEN 1
           WHEN sistemaCode LIKE 'CLIPPER%' THEN 2
           WHEN sistemaCode = 'ORACLE' OR sistemaCode = 'OFICON' THEN 3
           WHEN sistemaCode = 'HMIS' THEN 4
           WHEN sistemaCode = 'EXCEL' THEN 5
           ELSE 1
       END as sistemaId,
       id, 1, GETDATE(), GETDATE()
FROM dbo.Menus 
WHERE areaUsuaria = '5.- Gestión de Personal';

PRINT 'Relaciones creadas'

-- =====================================================
-- 6. VERIFICACIÓN DE DATOS
-- =====================================================
PRINT '==================== VERIFICACIÓN ===================='
PRINT 'Roles existentes:'
SELECT id, descripcion, descripcion_completa FROM dbo.Roles ORDER BY id;

PRINT 'Sistemas existentes:'
SELECT id, descripcion FROM dbo.Sistemas ORDER BY id;

PRINT 'Menús creados:'
SELECT COUNT(*) as TotalMenus FROM dbo.Menus;
SELECT areaUsuaria, COUNT(*) as MenusPorArea 
FROM dbo.Menus 
GROUP BY areaUsuaria 
ORDER BY areaUsuaria;

PRINT 'Relaciones creadas:'
SELECT COUNT(*) as TotalRelaciones FROM dbo.RolSistemaMenu;

PRINT 'Menús por rol:'
SELECT r.id, r.descripcion as Rol, COUNT(rsm.menuId) as TotalMenus
FROM dbo.Roles r
LEFT JOIN dbo.RolSistemaMenu rsm ON r.id = rsm.rolId
GROUP BY r.id, r.descripcion
ORDER BY r.id;

PRINT 'Menús por sistema:'
SELECT s.descripcion as Sistema, COUNT(rsm.menuId) as TotalMenus
FROM dbo.Sistemas s
LEFT JOIN dbo.RolSistemaMenu rsm ON s.id = rsm.sistemaId
GROUP BY s.id, s.descripcion
ORDER BY s.id;

-- Verificación específica para ROL 2 (Contabilidad)
PRINT 'Menús específicos para ROL 2 (Contabilidad):'
SELECT m.descripcion, m.sistemaCode, m.areaUsuaria
FROM dbo.Menus m
INNER JOIN dbo.RolSistemaMenu rsm ON m.id = rsm.menuId
WHERE rsm.rolId = 2
ORDER BY m.sistemaCode, m.descripcion;

PRINT '==================== SCRIPT COMPLETADO ====================' 