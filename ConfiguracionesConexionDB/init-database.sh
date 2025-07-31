#!/bin/bash

# Script de inicialización de la base de datos Globalis
# Este script se ejecuta automáticamente al iniciar los contenedores

echo "=== Inicialización de la Base de Datos Globalis ==="

# Función para esperar a que SQL Server esté listo
wait_for_sqlserver() {
    echo "Esperando a que SQL Server esté listo..."
    while ! /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Globalis2024! -Q "SELECT 1" > /dev/null 2>&1; do
        sleep 5
    done
    echo "SQL Server está listo!"
}

# Función para crear la base de datos
create_database() {
    echo "Creando base de datos GlobalisDB..."
    /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Globalis2024! -Q "
    IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'GlobalisDB')
    BEGIN
        CREATE DATABASE GlobalisDB;
        PRINT 'Base de datos GlobalisDB creada exitosamente';
    END
    ELSE
    BEGIN
        PRINT 'La base de datos GlobalisDB ya existe';
    END
    "
}

# Función para restaurar el backup
restore_backup() {
    local backup_file="/backup/ConfiguracionesConexionDB.bak"
    
    if [ -f "$backup_file" ]; then
        echo "Restaurando backup de la base de datos..."
        /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Globalis2024! -Q "
        USE master;
        RESTORE DATABASE GlobalisDB 
        FROM DISK = '$backup_file'
        WITH REPLACE, RECOVERY;
        "
        echo "Backup restaurado exitosamente"
    else
        echo "Archivo de backup no encontrado en $backup_file"
        echo "Continuando con la estructura existente..."
    fi
}

# Función para ejecutar scripts de población
run_population_scripts() {
    echo "Ejecutando scripts de población de datos..."
    
    # Poblar menús
    if [ -f "/backup/poblar_menus.sql" ]; then
        echo "Ejecutando script de menús..."
        /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Globalis2024! -d GlobalisDB -i /backup/poblar_menus.sql
    fi
    
    # Poblar centros de costos
    if [ -f "/backup/poblar_centros_costos.sql" ]; then
        echo "Ejecutando script de centros de costos..."
        /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Globalis2024! -d GlobalisDB -i /backup/poblar_centros_costos.sql
    fi
    
    # Poblar movimientos contables
    if [ -f "/backup/poblar_movimientos_contables.sql" ]; then
        echo "Ejecutando script de movimientos contables..."
        /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Globalis2024! -d GlobalisDB -i /backup/poblar_movimientos_contables.sql
    fi
}

# Función para verificar la inicialización
verify_initialization() {
    echo "Verificando inicialización..."
    /opt/mssql-tools/bin/sqlcmd -S sqlserver -U sa -P Globalis2024! -d GlobalisDB -Q "
    SELECT 
        'Tablas creadas:' as Status,
        COUNT(*) as TableCount
    FROM sys.tables 
    WHERE name IN ('menus', 'centros_costos', 'movimientos_contables');
    "
}

# Ejecutar el proceso de inicialización
main() {
    wait_for_sqlserver
    create_database
    restore_backup
    run_population_scripts
    verify_initialization
    echo "=== Inicialización completada exitosamente ==="
}

# Ejecutar el script principal
main 