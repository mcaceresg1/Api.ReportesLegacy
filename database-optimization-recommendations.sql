-- =====================================================
-- RECOMENDACIONES DE OPTIMIZACIÓN DE BASE DE DATOS
-- Para mejorar el rendimiento de la API de Libro Diario
-- =====================================================

-- 1. ÍNDICES RECOMENDADOS PARA LA TABLA VOUCHER
-- =====================================================

-- Índice compuesto para consultas por MES y TIPOVOU
-- Este índice es crítico para las consultas de comprobantes
CREATE NONCLUSTERED INDEX IX_VOUCHER_MES_TIPOVOU_NUMERO 
ON VOUCHER (MES, TIPOVOU, NUMERO DESC)
INCLUDE (MONTOD, MONTOH, GLOSA, TDOC, NDOC, CUENTA)
WITH (FILLFACTOR = 90, PAD_INDEX = ON);

-- Índice para consultas por NUMERO (para detalles de comprobante)
CREATE NONCLUSTERED INDEX IX_VOUCHER_NUMERO 
ON VOUCHER (NUMERO)
INCLUDE (TIPOVOU, MONTOD, MONTOH, GLOSA, TDOC, NDOC, CUENTA, MES)
WITH (FILLFACTOR = 90, PAD_INDEX = ON);

-- Índice para consultas por CUENTA (si se necesita)
CREATE NONCLUSTERED INDEX IX_VOUCHER_CUENTA 
ON VOUCHER (CUENTA)
INCLUDE (MES, TIPOVOU, NUMERO, MONTOD, MONTOH)
WITH (FILLFACTOR = 90, PAD_INDEX = ON);

-- 2. ÍNDICES RECOMENDADOS PARA LA TABLA LIBROS
-- =====================================================

-- Índice para consultas por LIBRO y CODIGO
CREATE NONCLUSTERED INDEX IX_LIBROS_LIBRO_CODIGO 
ON LIBROS (LIBRO, CODIGO)
INCLUDE (NOMBRE)
WITH (FILLFACTOR = 95, PAD_INDEX = ON);

-- 3. ÍNDICES RECOMENDADOS PARA LA TABLA PCGR
-- =====================================================

-- Índice para consultas por CUENTA
CREATE NONCLUSTERED INDEX IX_PCGR_CUENTA 
ON PCGR (CUENTA)
INCLUDE (NOMBRE)
WITH (FILLFACTOR = 95, PAD_INDEX = ON);

-- 4. ESTADÍSTICAS Y MANTENIMIENTO
-- =====================================================

-- Actualizar estadísticas para optimizar el plan de ejecución
UPDATE STATISTICS VOUCHER WITH FULLSCAN;
UPDATE STATISTICS LIBROS WITH FULLSCAN;
UPDATE STATISTICS PCGR WITH FULLSCAN;

-- 5. CONFIGURACIÓN DE BASE DE DATOS RECOMENDADA
-- =====================================================

-- Configurar el nivel de compatibilidad (ajustar según la versión de SQL Server)
-- ALTER DATABASE [NombreBaseDatos] SET COMPATIBILITY_LEVEL = 150;

-- Configurar el modelo de recuperación (si es apropiado para el entorno)
-- ALTER DATABASE [NombreBaseDatos] SET RECOVERY SIMPLE;

-- Configurar el crecimiento automático de archivos
-- ALTER DATABASE [NombreBaseDatos] MODIFY FILE (NAME = 'NombreBaseDatos', FILEGROWTH = 100MB);
-- ALTER DATABASE [NombreBaseDatos] MODIFY FILE (NAME = 'NombreBaseDatos_Log', FILEGROWTH = 50MB);

-- 6. CONSULTAS DE MONITOREO
-- =====================================================

-- Consulta para verificar el uso de índices
SELECT 
    i.name AS IndexName,
    s.user_seeks,
    s.user_scans,
    s.user_lookups,
    s.user_updates,
    s.last_user_seek,
    s.last_user_scan,
    s.last_user_lookup
FROM sys.indexes i
LEFT JOIN sys.dm_db_index_usage_stats s ON i.object_id = s.object_id AND i.index_id = s.index_id
WHERE i.object_id = OBJECT_ID('VOUCHER')
ORDER BY s.user_seeks + s.user_scans + s.user_lookups DESC;

-- Consulta para identificar consultas lentas
SELECT 
    qs.total_elapsed_time / qs.execution_count AS avg_elapsed_time,
    qs.total_logical_reads / qs.execution_count AS avg_logical_reads,
    qs.execution_count,
    qt.text AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
WHERE qt.text LIKE '%VOUCHER%'
ORDER BY avg_elapsed_time DESC;

-- 7. RECOMENDACIONES ADICIONALES
-- =====================================================

-- Considerar particionado de la tabla VOUCHER por MES si es muy grande
-- CREATE PARTITION FUNCTION PF_VOUCHER_MES (VARCHAR(2))
-- AS RANGE LEFT FOR VALUES ('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');

-- Considerar compresión de datos para tablas grandes
-- ALTER INDEX ALL ON VOUCHER REBUILD WITH (DATA_COMPRESSION = PAGE);

-- 8. SCRIPT DE MANTENIMIENTO AUTOMÁTICO
-- =====================================================

-- Script para ejecutar periódicamente (ej. semanalmente)
-- Reorganizar índices fragmentados
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 
    'ALTER INDEX ' + i.name + ' ON ' + OBJECT_NAME(i.object_id) + ' REORGANIZE;' + CHAR(13)
FROM sys.indexes i
INNER JOIN sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
    ON i.object_id = ips.object_id AND i.index_id = ips.index_id
WHERE ips.avg_fragmentation_in_percent > 10 
    AND ips.avg_fragmentation_in_percent < 30
    AND i.name IS NOT NULL;

-- Reconstruir índices muy fragmentados
SELECT @sql = @sql + 
    'ALTER INDEX ' + i.name + ' ON ' + OBJECT_NAME(i.object_id) + ' REBUILD WITH (ONLINE = ON);' + CHAR(13)
FROM sys.indexes i
INNER JOIN sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
    ON i.object_id = ips.object_id AND i.index_id = ips.index_id
WHERE ips.avg_fragmentation_in_percent >= 30
    AND i.name IS NOT NULL;

-- Ejecutar el script generado
-- EXEC sp_executesql @sql;

-- Actualizar estadísticas
-- EXEC sp_updatestats;

PRINT 'Script de optimización completado. Revisar los resultados y ajustar según sea necesario.';