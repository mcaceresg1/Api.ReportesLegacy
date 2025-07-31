-- Script de inicialización de la base de datos Globalis
-- Este script se ejecuta automáticamente al iniciar los contenedores

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'GlobalisDB')
BEGIN
    CREATE DATABASE GlobalisDB;
    PRINT 'Base de datos GlobalisDB creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La base de datos GlobalisDB ya existe';
END
GO

-- Usar la base de datos
USE GlobalisDB;
GO

-- Restaurar el backup si existe
IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'GlobalisDB' AND state = 0)
BEGIN
    -- Verificar si el archivo de backup existe
    DECLARE @BackupFile NVARCHAR(500) = '/backup/ConfiguracionesConexionDB.bak';
    
    IF EXISTS (SELECT 1 FROM sys.dm_os_file_exists(@BackupFile))
    BEGIN
        PRINT 'Restaurando backup de la base de datos...';
        
        -- Restaurar el backup
        RESTORE DATABASE GlobalisDB 
        FROM DISK = @BackupFile
        WITH REPLACE, RECOVERY;
        
        PRINT 'Backup restaurado exitosamente';
    END
    ELSE
    BEGIN
        PRINT 'Archivo de backup no encontrado. Continuando con la estructura existente...';
    END
END
GO

-- Ejecutar scripts de población de datos
PRINT 'Ejecutando scripts de población de datos...';

-- Poblar menús
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'menus')
BEGIN
    PRINT 'Tabla menus existe, omitiendo script de creación';
END
ELSE
BEGIN
    PRINT 'Ejecutando script de menús...';
    -- Aquí se ejecutaría el contenido de poblar_menus.sql
END
GO

-- Poblar centros de costos
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'centros_costos')
BEGIN
    PRINT 'Tabla centros_costos existe, omitiendo script de creación';
END
ELSE
BEGIN
    PRINT 'Ejecutando script de centros de costos...';
    -- Aquí se ejecutaría el contenido de poblar_centros_costos.sql
END
GO

-- Poblar movimientos contables
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'movimientos_contables')
BEGIN
    PRINT 'Tabla movimientos_contables existe, omitiendo script de creación';
END
ELSE
BEGIN
    PRINT 'Ejecutando script de movimientos contables...';
    -- Aquí se ejecutaría el contenido de poblar_movimientos_contables.sql
END
GO

PRINT 'Inicialización de la base de datos completada';
GO 