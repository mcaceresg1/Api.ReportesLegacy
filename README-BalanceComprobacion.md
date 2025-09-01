# API Balance de Comprobación

## Descripción

Esta API implementa el reporte de **Balance de Comprobación** siguiendo la arquitectura CQRS, principios SOLID y patrones de diseño establecidos en el proyecto. El reporte combina información de las tablas SALDO, MAYOR, DIARIO y CUENTA_CONTABLE para generar un balance de comprobación completo.

## Arquitectura Implementada

### Patrones Utilizados

- **CQRS (Command Query Responsibility Segregation)**: Separación de comandos y queries
- **Repository Pattern**: Abstracción del acceso a datos
- **Service Layer**: Lógica de negocio encapsulada
- **Dependency Injection**: Inversión de dependencias con Inversify
- **SOLID Principles**: Principios de diseño orientado a objetos

### Estructura de Archivos

```
src/
├── domain/
│   ├── entities/
│   │   └── BalanceComprobacion.ts                    # Entidad y interfaces
│   ├── repositories/
│   │   └── IBalanceComprobacionRepository.ts         # Contrato del repositorio
│   └── services/
│       └── IBalanceComprobacionService.ts            # Contrato del servicio
├── application/
│   ├── commands/balance-comprobacion/
│   │   ├── GenerarReporteBalanceComprobacionCommand.ts
│   │   └── ExportarBalanceComprobacionExcelCommand.ts
│   ├── queries/balance-comprobacion/
│   │   ├── ObtenerBalanceComprobacionQuery.ts
│   │   └── ExportarBalanceComprobacionExcelQuery.ts
│   ├── handlers/balance-comprobacion/
│   │   ├── GenerarReporteBalanceComprobacionHandler.ts
│   │   ├── ObtenerBalanceComprobacionHandler.ts
│   │   └── ExportarBalanceComprobacionExcelHandler.ts
│   └── services/
│       └── BalanceComprobacionService.ts             # Implementación del servicio
├── infrastructure/
│   ├── repositories/
│   │   └── BalanceComprobacionRepository.ts          # Implementación del repositorio
│   ├── controllers/
│   │   └── BalanceComprobacionController.ts          # Controlador REST
│   └── routes/
│       └── BalanceComprobacionRoutes.ts              # Configuración de rutas
```

## Endpoints Disponibles

### 1. Health Check

```http
GET /api/balance-comprobacion/health
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Servicio de Balance de Comprobación funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Generar Reporte

```http
POST /api/balance-comprobacion/generar
```

**Body:**

```json
{
  "conjunto": "001",
  "usuario": "ADMIN",
  "fechaInicio": "2024-01-01",
  "fechaFin": "2024-12-31",
  "contabilidad": "F",
  "tipoReporte": "Preliminar"
}
```

**Parámetros:**

- `conjunto` (requerido): Código del conjunto contable
- `usuario` (requerido): Usuario que genera el reporte
- `fechaInicio` (requerido): Fecha de inicio del período (YYYY-MM-DD)
- `fechaFin` (requerido): Fecha de fin del período (YYYY-MM-DD)
- `contabilidad` (opcional): Tipo de contabilidad ("F", "A", "F,A") - por defecto "F,A"
- `tipoReporte` (opcional): Tipo de reporte ("Preliminar", "Oficial") - por defecto "Preliminar"

**Respuesta:**

```json
{
  "success": true,
  "message": "Reporte de Balance de Comprobación generado exitosamente"
}
```

### 3. Obtener Datos del Reporte

```http
GET /api/balance-comprobacion/obtener?conjunto=001&usuario=ADMIN&fechaInicio=2024-01-01&fechaFin=2024-12-31&page=1&limit=25
```

**Parámetros de Query:**

- `conjunto` (requerido): Código del conjunto contable
- `usuario` (requerido): Usuario propietario del reporte
- `fechaInicio` (requerido): Fecha de inicio del período
- `fechaFin` (requerido): Fecha de fin del período
- `cuentaContable` (opcional): Filtro por cuenta contable (búsqueda parcial)
- `centroCosto` (opcional): Filtro por centro de costo (búsqueda parcial)
- `tipo` (opcional): Filtro por tipo de cuenta
- `tipoDetallado` (opcional): Filtro por tipo detallado
- `contabilidad` (opcional): Tipo de contabilidad
- `tipoReporte` (opcional): Tipo de reporte
- `page` (opcional): Número de página (por defecto 1)
- `limit` (opcional): Registros por página (por defecto 25, máximo 1000)

**Respuesta:**

```json
{
  "success": true,
  "message": "Balance de Comprobación obtenido exitosamente",
  "data": {
    "data": [
      {
        "CUENTA_CONTABLE": "1105.01.01.001.000",
        "DESCRIPCION": "Bancos Nacionales",
        "CUENTA1": "11",
        "DESC1": "ACTIVO",
        "CUENTA2": "1105",
        "DESC2": "BANCOS",
        "CUENTA3": "1105.01",
        "DESC3": "Bancos Nacionales",
        "CUENTA4": "1105.01.01",
        "DESC4": "Banco Principal",
        "CUENTA5": "1105.01.01.001",
        "DESC5": "Cuenta Corriente",
        "SALDO_LOCAL": 1500000.0,
        "SALDO_DOLAR": 50000.0,
        "DEBITO_LOCAL": 2000000.0,
        "DEBITO_DOLAR": 60000.0,
        "CREDITO_LOCAL": 500000.0,
        "CREDITO_DOLAR": 10000.0,
        "MONEDA": 0,
        "NIVEL": 1,
        "sTIPO": "ACTIVO",
        "sTIPO_DETALLADO": "ACTIVO_CORRIENTE",
        "TIPO_REPORTE": "Preliminar"
      }
    ],
    "total": 150,
    "pagina": 1,
    "porPagina": 25,
    "totalPaginas": 6
  },
  "paginacion": {
    "pagina": 1,
    "porPagina": 25,
    "total": 150,
    "totalPaginas": 6
  }
}
```

### 4. Exportar a Excel

```http
GET /api/balance-comprobacion/exportar-excel?conjunto=001&usuario=ADMIN&fechaInicio=2024-01-01&fechaFin=2024-12-31&limit=10000
```

**Parámetros de Query:**

- `conjunto` (requerido): Código del conjunto contable
- `usuario` (requerido): Usuario que exporta
- `fechaInicio` (requerido): Fecha de inicio del período
- `fechaFin` (requerido): Fecha de fin del período
- `contabilidad` (opcional): Tipo de contabilidad
- `tipoReporte` (opcional): Tipo de reporte
- `limit` (opcional): Límite de registros a exportar (por defecto 10000, máximo 50000)

**Respuesta:** Archivo Excel descargable

## Lógica de Negocio

### Query SQL Implementada

La API implementa la query SQL proporcionada que combina datos de múltiples tablas:

1. **SALDO**: Saldos fiscales por cuenta y centro de costo
2. **MAYOR**: Movimientos del libro mayor
3. **DIARIO**: Asientos de diario
4. **CUENTA_CONTABLE**: Estructura jerárquica de cuentas

### Validaciones Implementadas

- **Fechas**: Validación de formato y rango lógico
- **Parámetros obligatorios**: conjunto, usuario, fechas
- **Paginación**: Límites y rangos válidos
- **Exportación**: Límites de registros para evitar sobrecarga

### Manejo de Errores

- Validación de entrada con mensajes descriptivos
- Manejo de errores de base de datos
- Logging detallado para debugging
- Respuestas HTTP apropiadas (400, 500)

## Autenticación

Todas las rutas requieren autenticación mediante JWT token en el header:

```http
Authorization: Bearer <token>
```

## Ejemplos de Uso

### 1. Generar y Obtener Reporte Completo

```bash
# 1. Generar el reporte
curl -X POST http://localhost:3000/api/balance-comprobacion/generar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "conjunto": "001",
    "usuario": "ADMIN",
    "fechaInicio": "2024-01-01",
    "fechaFin": "2024-12-31",
    "contabilidad": "F",
    "tipoReporte": "Preliminar"
  }'

# 2. Obtener los datos
curl -X GET "http://localhost:3000/api/balance-comprobacion/obtener?conjunto=001&usuario=ADMIN&fechaInicio=2024-01-01&fechaFin=2024-12-31&page=1&limit=25" \
  -H "Authorization: Bearer <token>"
```

### 2. Exportar a Excel

```bash
curl -X GET "http://localhost:3000/api/balance-comprobacion/exportar-excel?conjunto=001&usuario=ADMIN&fechaInicio=2024-01-01&fechaFin=2024-12-31&limit=10000" \
  -H "Authorization: Bearer <token>" \
  --output balance-comprobacion.xlsx
```

## Consideraciones Técnicas

### Performance

- Paginación implementada para grandes volúmenes de datos
- Límites en exportación para evitar timeouts
- Optimización de queries SQL

### Seguridad

- Autenticación requerida en todas las rutas
- Validación de entrada para prevenir inyección SQL
- Logging de operaciones para auditoría

### Escalabilidad

- Arquitectura CQRS permite escalado independiente
- Separación de responsabilidades facilita mantenimiento
- Patrón Repository permite cambio de base de datos

## Dependencias

- **xlsx**: Para generación de archivos Excel
- **inversify**: Para inyección de dependencias
- **express**: Framework web
- **typescript**: Tipado estático

## Testing

Para probar la API, puedes usar:

1. **Swagger UI**: `http://localhost:3000/api-docs`
2. **Postman**: Importar la colección de endpoints
3. **curl**: Comandos de línea mostrados arriba

## Mantenimiento

### Agregar Nuevas Funcionalidades

1. Crear nuevos comandos/queries en `application/`
2. Implementar handlers correspondientes
3. Actualizar el container de dependencias
4. Agregar rutas si es necesario

### Modificar Lógica de Negocio

1. Actualizar el servicio en `application/services/`
2. Modificar validaciones según sea necesario
3. Actualizar tests unitarios

### Cambios en Base de Datos

1. Actualizar la query SQL en el repositorio
2. Modificar la entidad si cambian los campos
3. Actualizar la documentación de la API
