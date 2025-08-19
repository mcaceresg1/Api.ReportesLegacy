-- =====================================================
-- SCRIPT PARA AGREGAR MENÚ DEL LIBRO MAYOR DE CONTABILIDAD
-- =====================================================

-- Verificar si el menú ya existe
IF NOT EXISTS (SELECT 1 FROM dbo.Menus WHERE descripcion = 'Libro Mayor de Contabilidad' AND areaUsuaria = '4.- Contabilidad')
BEGIN
    -- Insertar el menú del Libro Mayor de Contabilidad
    INSERT INTO dbo.Menus (descripcion, padreId, icon, ruta, areaUsuaria, sistemaCode, routePath, estado) VALUES
    ('Libro Mayor de Contabilidad', NULL, 'BookOpen', 'CG / RST / LO / Libro Mayor de Contabilidad', '4.- Contabilidad', 'EXACTUS', '/home/libro-mayor-contabilidad', 1);
    
    PRINT 'Menú "Libro Mayor de Contabilidad" agregado exitosamente'
END
ELSE
BEGIN
    PRINT 'El menú "Libro Mayor de Contabilidad" ya existe'
END

-- Verificar si la relación rol-sistema-menú ya existe para el rol 2 (Contabilidad)
IF NOT EXISTS (
    SELECT 1 
    FROM dbo.RolSistemaMenu rsm
    INNER JOIN dbo.Menus m ON rsm.menuId = m.id
    WHERE rsm.rolId = 2 
    AND m.descripcion = 'Libro Mayor de Contabilidad'
    AND m.areaUsuaria = '4.- Contabilidad'
)
BEGIN
    -- Obtener el ID del menú y del sistema
    DECLARE @MenuId INT, @SistemaId INT;
    
    SELECT @MenuId = id FROM dbo.Menus WHERE descripcion = 'Libro Mayor de Contabilidad' AND areaUsuaria = '4.- Contabilidad';
    SELECT @SistemaId = id FROM dbo.Sistemas WHERE descripcion = 'Exactus';
    
    IF @MenuId IS NOT NULL AND @SistemaId IS NOT NULL
    BEGIN
        -- Crear la relación rol-sistema-menú
        INSERT INTO dbo.RolSistemaMenu (rolId, sistemaId, menuId, estado, createdAt, updatedAt) VALUES
        (2, @SistemaId, @MenuId, 1, GETDATE(), GETDATE());
        
        PRINT 'Relación rol-sistema-menú creada para el rol Contabilidad'
    END
    ELSE
    BEGIN
        PRINT 'Error: No se pudo encontrar el menú o el sistema'
    END
END
ELSE
BEGIN
    PRINT 'La relación rol-sistema-menú ya existe para el rol Contabilidad'
END

-- Verificar que el menú esté disponible para el rol administrador (rol 1)
IF NOT EXISTS (
    SELECT 1 
    FROM dbo.RolSistemaMenu rsm
    INNER JOIN dbo.Menus m ON rsm.menuId = m.id
    WHERE rsm.rolId = 1 
    AND m.descripcion = 'Libro Mayor de Contabilidad'
    AND m.areaUsuaria = '4.- Contabilidad'
)
BEGIN
    -- Obtener el ID del menú y del sistema
    DECLARE @MenuIdAdmin INT, @SistemaIdAdmin INT;
    
    SELECT @MenuIdAdmin = id FROM dbo.Menus WHERE descripcion = 'Libro Mayor de Contabilidad' AND areaUsuaria = '4.- Contabilidad';
    SELECT @SistemaIdAdmin = id FROM dbo.Sistemas WHERE descripcion = 'Exactus';
    
    IF @MenuIdAdmin IS NOT NULL AND @SistemaIdAdmin IS NOT NULL
    BEGIN
        -- Crear la relación rol-sistema-menú para el administrador
        INSERT INTO dbo.RolSistemaMenu (rolId, sistemaId, menuId, estado, createdAt, updatedAt) VALUES
        (1, @SistemaIdAdmin, @MenuIdAdmin, 1, GETDATE(), GETDATE());
        
        PRINT 'Relación rol-sistema-menú creada para el rol Administrador'
    END
    ELSE
    BEGIN
        PRINT 'Error: No se pudo encontrar el menú o el sistema para el administrador'
    END
END
ELSE
BEGIN
    PRINT 'La relación rol-sistema-menú ya existe para el rol Administrador'
END

-- Verificación final
PRINT '==================== VERIFICACIÓN FINAL ===================='
PRINT 'Menú creado:'
SELECT id, descripcion, areaUsuaria, sistemaCode, routePath, estado 
FROM dbo.Menus 
WHERE descripcion = 'Libro Mayor de Contabilidad' 
AND areaUsuaria = '4.- Contabilidad';

PRINT 'Relaciones creadas:'
SELECT rsm.rolId, r.descripcion as Rol, m.descripcion as Menu, s.descripcion as Sistema
FROM dbo.RolSistemaMenu rsm
INNER JOIN dbo.Roles r ON rsm.rolId = r.id
INNER JOIN dbo.Menus m ON rsm.menuId = m.id
INNER JOIN dbo.Sistemas s ON rsm.sistemaId = s.id
WHERE m.descripcion = 'Libro Mayor de Contabilidad'
AND m.areaUsuaria = '4.- Contabilidad'
ORDER BY rsm.rolId;

PRINT '==================== SCRIPT COMPLETADO ===================='

