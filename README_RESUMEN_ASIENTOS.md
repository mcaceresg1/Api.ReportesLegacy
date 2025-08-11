# API de Resumen de Asientos Contables

## Descripción
Esta API genera reportes resumidos de movimientos contables agrupados por tipo de asiento, cuenta contable y centro de costo. Combina datos de las tablas `ASIENTO_MAYORIZADO`, `ASIENTO_DE_DIARIO`, `DIARIO`, `MAYOR`, `CUENTA_CONTABLE` y `TIPO_ASIENTO`.

## Endpoints

### GET /api/resumen-asientos/{conjunto}/resumen
Genera el reporte de resumen de asientos para un conjunto específico.

#### Parámetros de Ruta
- `conjunto` (requerido): Código del conjunto contable (ej: ASFSAC)

#### Parámetros de Query
- `fechaInicio` (opcional): Fecha de inicio del período (YYYY-MM-DD)
- `fechaFin` (opcional): Fecha final del período (YYYY-MM-DD)
- `tipoAsiento` (opcional): Filtro por tipo de asiento específico
- `cuentaContable` (opcional): Filtro por cuenta contable específica
- `centroCosto` (opcional): Filtro por centro de costo específico
- `usuario` (opcional): Filtro por usuario específico
- `contabilidad` (opcional): Tipo de contabilidad (F=Fiscal, A=Administrativo, T=Todos)

#### Ejemplos de Uso

**Reporte básico para un conjunto:**
```
GET /api/resumen-asientos/ASFSAC/resumen
```

**Reporte con filtros de fecha:**
```
GET /api/resumen-asientos/ASFSAC/resumen?fechaInicio=2023-01-01&fechaFin=2023-12-31
```

**Reporte filtrado por tipo de asiento:**
```
GET /api/resumen-asientos/ASFSAC/resumen?tipoAsiento=DIARIO
```

**Reporte con múltiples filtros:**
```
GET /api/resumen-asientos/ASFSAC/resumen?fechaInicio=2023-01-01&fechaFin=2023-12-31&contabilidad=F&centroCosto=ADMIN
```

## Estructura de Respuesta

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Reporte generado exitosamente con 150 registros",
  "data": [
    {
      "cuentaContableDesc": "Clientes",
      "sDescTipoAsiento": "Asiento de Diario",
      "cuentaContable": "01.1.0.0.000",
      "sNombreQuiebre": "DIARIO",
      "creditoLocal": 1000000.00,
      "creditoDolar": 250.00,
      "centroCosto": "ADMIN",
      "debitoLocal": 0.00,
      "debitoDolar": 0.00,
      "tipoAsiento": "DIARIO",
      "tipoReporte": "Resumen de Asientos",
      "nomUsuario": "ADMIN",
      "finicio": "2023-01-01T00:00:00.000Z",
      "quiebre": "DIARIO",
      "ffinal": "2023-12-31T23:59:59.999Z",
      "rowOrderBy": 1
    }
  ],
  "totalRegistros": 150,
  "fechaInicio": "2023-01-01T00:00:00.000Z",
  "fechaFin": "2023-12-31T23:59:59.999Z",
  "conjunto": "ASFSAC"
}
```

### Respuesta de Error (400/500)
```json
{
  "success": false,
  "message": "Error al generar reporte: El conjunto es requerido"
}
```

## Lógica del Reporte

### Agrupación de Datos
El reporte agrupa los movimientos contables por:
1. **Tipo de Asiento** (DIARIO, MAYORIZADO, etc.)
2. **Cuenta Contable** (código y descripción)
3. **Centro de Costo**
4. **Usuario**

### Cálculos
- **Débitos y Créditos**: Se suman los montos de las tablas `DIARIO` y `MAYOR`
- **Monedas**: Se manejan tanto montos en moneda local como en dólares
- **Período**: Se filtran por fechas de asiento
- **Contabilidad**: Se puede filtrar por tipo de contabilidad (Fiscal/Administrativo)

### Tablas Involucradas
- `ASIENTO_MAYORIZADO`: Asientos del mayor general
- `ASIENTO_DE_DIARIO`: Asientos del diario
- `DIARIO`: Movimientos del diario
- `MAYOR`: Movimientos del mayor
- `CUENTA_CONTABLE`: Catálogo de cuentas
- `TIPO_ASIENTO`: Tipos de asiento disponibles

## Consideraciones Técnicas

### Performance
- Se aplican índices en las fechas para optimizar las consultas
- Se utiliza `UNION ALL` para combinar datos de múltiples tablas
- Se implementa paginación y filtros para limitar el volumen de datos

### Seguridad
- Se valida el conjunto antes de ejecutar la consulta
- Se sanitizan los parámetros de entrada
- Se aplica middleware de optimización de consultas

### Logging
- Se registran todas las operaciones para auditoría
- Se incluyen logs de performance y errores
- Se documentan los filtros aplicados en cada consulta

## Casos de Uso

### 1. Reporte Mensual
Generar resumen de movimientos del mes actual para análisis contable.

### 2. Auditoría por Usuario
Revisar todos los movimientos realizados por un usuario específico.

### 3. Análisis por Centro de Costo
Evaluar la distribución de movimientos por centro de costo.

### 4. Consolidación Fiscal vs Administrativo
Comparar movimientos entre contabilidad fiscal y administrativa.

## Dependencias

- **Base de Datos**: SQL Server con soporte para transacciones
- **Framework**: Express.js con TypeScript
- **Inyección de Dependencias**: InversifyJS
- **Documentación**: Swagger/OpenAPI
- **Middleware**: Validación de consultas y optimización de performance

## Instalación y Configuración

1. Asegurar que las dependencias estén instaladas
2. Configurar la conexión a la base de datos
3. Verificar que el contenedor de Inversify esté configurado
4. Probar la conectividad con la base de datos

## Monitoreo y Mantenimiento

- Revisar logs de performance regularmente
- Monitorear el uso de memoria en consultas grandes
- Verificar la integridad de los datos de entrada
- Actualizar índices de base de datos según sea necesario
