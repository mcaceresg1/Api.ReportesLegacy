# Reporte Genérico de Saldos - API Documentation

## Descripción

El Reporte Genérico de Saldos es un reporte estándar del libro oficial que proporciona información detallada sobre los saldos de las cuentas contables, incluyendo información de NITs, razones sociales, tipos de documentos y movimientos contables.

## Características

- **Generación de reportes**: Crea reportes basados en fechas y filtros específicos
- **Paginación**: Soporte para paginación de resultados
- **Filtros avanzados**: Múltiples filtros para refinar los resultados
- **Exportación a Excel**: Exporta los resultados a archivos Excel
- **Estadísticas**: Proporciona estadísticas del reporte generado
- **Validación de esquemas**: Verifica automáticamente la existencia de esquemas de base de datos

## Endpoints Disponibles

### 1. Generar Reporte

**POST** `/api/reporte-generico-saldos/generar`

Genera un nuevo reporte genérico de saldos.

**Parámetros del cuerpo:**

```json
{
  "conjunto": "ASFSAC",
  "usuario": "ADMIN",
  "fechaInicio": "2020-01-01",
  "fechaFin": "2023-12-31",
  "contabilidad": "F,A",
  "tipoAsiento": "06",
  "claseAsiento": "C"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Reporte genérico de saldos generado exitosamente"
}
```

### 2. Obtener Datos del Reporte

**GET** `/api/reporte-generico-saldos/obtener`

Obtiene los datos del reporte con filtros y paginación.

**Parámetros de consulta:**

- `conjunto` (requerido): Código del conjunto contable
- `usuario`: Usuario que genera el reporte (default: "ADMIN")
- `fechaInicio`: Fecha de inicio del reporte
- `fechaFin`: Fecha fin del reporte
- `page`: Número de página (default: 1)
- `limit`: Registros por página (default: 25)
- `cuentaContable`: Filtro por cuenta contable
- `nit`: Filtro por NIT
- `razonSocial`: Filtro por razón social
- `codTipoDoc`: Filtro por código de tipo de documento
- `tipoDocSunat`: Filtro por tipo de documento SUNAT
- `asiento`: Filtro por asiento
- `consecutivo`: Filtro por consecutivo
- `saldoLocalMin`: Saldo local mínimo
- `saldoLocalMax`: Saldo local máximo
- `saldoDolarMin`: Saldo dólar mínimo
- `saldoDolarMax`: Saldo dólar máximo

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "sCuentaContable": "110501",
        "sDescCuentaContable": "Caja General",
        "sNit": "12345678",
        "sRazonSocial": "Empresa Ejemplo S.A.",
        "sReferencia": "Cuenta corriente 12345678",
        "sCodTipoDoc": "01",
        "sTipoDocSunat": "DNI",
        "sAsiento": "000001",
        "nConsecutivo": 1,
        "dtFechaAsiento": "2023-01-01T00:00:00.000Z",
        "nSaldoLocal": 1000.50,
        "nSaldoDolar": 250.25
      }
    ],
    "total": 100,
    "totalPaginas": 4,
    "paginaActual": 1,
    "limite": 25,
    "filtros": { ... }
  }
}
```

### 3. Exportar a Excel

**POST** `/api/reporte-generico-saldos/exportar-excel`

Exporta el reporte a un archivo Excel.

**Parámetros del cuerpo:**

```json
{
  "conjunto": "ASFSAC",
  "usuario": "ADMIN",
  "fechaInicio": "2020-01-01",
  "fechaFin": "2023-12-31",
  "limit": 10000
}
```

**Respuesta:** Archivo Excel descargable

### 4. Obtener Estadísticas

**GET** `/api/reporte-generico-saldos/estadisticas`

Obtiene estadísticas del reporte generado.

**Parámetros de consulta:**

- `conjunto` (requerido): Código del conjunto contable
- `usuario`: Usuario que genera el reporte
- `fechaInicio`: Fecha de inicio del reporte
- `fechaFin`: Fecha fin del reporte

**Ejemplo de respuesta:**

```json
{
  "success": true,
  "data": {
    "totalRegistros": 1000,
    "totalSaldoLocal": 50000.75,
    "totalSaldoDolar": 12500.25,
    "cuentasConSaldo": 150,
    "cuentasSinSaldo": 0,
    "nitsUnicos": 75,
    "tiposDocumento": {
      "01": 50,
      "06": 25
    },
    "fechaGeneracion": "2023-12-01T10:30:00.000Z"
  }
}
```

## Estructura de Datos

### ReporteGenericoSaldos

```typescript
interface ReporteGenericoSaldos {
  sCuentaContable: string; // Código de la cuenta contable
  sDescCuentaContable: string; // Descripción de la cuenta contable
  sNit: string; // NIT del cliente/proveedor
  sRazonSocial: string; // Razón social
  sReferencia: string; // Referencia del movimiento
  sCodTipoDoc: string; // Código del tipo de documento
  sTipoDocSunat: string; // Descripción del tipo de documento SUNAT
  sAsiento: string; // Número de asiento
  nConsecutivo: number; // Consecutivo del movimiento
  dtFechaAsiento: Date; // Fecha del asiento
  nSaldoLocal: number; // Saldo en moneda local
  nSaldoDolar: number; // Saldo en dólares
}
```

### FiltrosReporteGenericoSaldos

```typescript
interface FiltrosReporteGenericoSaldos {
  conjunto: string; // Código del conjunto contable
  usuario: string; // Usuario que genera el reporte
  fechaInicio: Date; // Fecha de inicio
  fechaFin: Date; // Fecha fin
  contabilidad?: string; // Tipo de contabilidad (F=Fiscal, A=Administrativa)
  tipoAsiento?: string; // Tipo de asiento a excluir
  claseAsiento?: string; // Clase de asiento a excluir
  cuentaContable?: string; // Filtro por cuenta contable
  nit?: string; // Filtro por NIT
  razonSocial?: string; // Filtro por razón social
  codTipoDoc?: string; // Filtro por código de tipo de documento
  tipoDocSunat?: string; // Filtro por tipo de documento SUNAT
  asiento?: string; // Filtro por asiento
  consecutivo?: number; // Filtro por consecutivo
  saldoLocalMin?: number; // Saldo local mínimo
  saldoLocalMax?: number; // Saldo local máximo
  saldoDolarMin?: number; // Saldo dólar mínimo
  saldoDolarMax?: number; // Saldo dólar máximo
  page?: number; // Número de página
  limit?: number; // Registros por página
}
```

## Arquitectura

El reporte sigue la arquitectura CQRS (Command Query Responsibility Segregation) con los siguientes componentes:

### Comandos

- `GenerarReporteGenericoSaldosCommand`: Genera un nuevo reporte

### Queries

- `ObtenerReporteGenericoSaldosQuery`: Obtiene datos del reporte
- `ExportarReporteGenericoSaldosExcelQuery`: Exporta a Excel
- `ObtenerEstadisticasReporteGenericoSaldosQuery`: Obtiene estadísticas

### Handlers

- `GenerarReporteGenericoSaldosHandler`: Maneja la generación del reporte
- `ObtenerReporteGenericoSaldosHandler`: Maneja la obtención de datos
- `ExportarReporteGenericoSaldosExcelHandler`: Maneja la exportación
- `ObtenerEstadisticasReporteGenericoSaldosHandler`: Maneja las estadísticas

### Servicios

- `ReporteGenericoSaldosService`: Lógica de negocio
- `ReporteGenericoSaldosRepository`: Acceso a datos

## Base de Datos

El reporte utiliza una tabla temporal `R_XML_8DDC555F668DCE4` que se crea automáticamente si no existe. La tabla contiene los siguientes campos:

- `sCuentaContable`: NVARCHAR(50)
- `sDescCuentaContable`: NVARCHAR(255)
- `sNit`: NVARCHAR(20)
- `sRazonSocial`: NVARCHAR(255)
- `sReferencia`: NVARCHAR(255)
- `sCodTipoDoc`: NVARCHAR(10)
- `sTipoDocSunat`: NVARCHAR(100)
- `sAsiento`: NVARCHAR(20)
- `nConsecutivo`: INT
- `dtFechaAsiento`: DATETIME
- `nSaldoLocal`: DECIMAL(18,2)
- `nSaldoDolar`: DECIMAL(18,2)

## Validaciones

- **Esquemas de base de datos**: Verifica automáticamente que el esquema especificado exista
- **Parámetros requeridos**: Valida que los parámetros obligatorios estén presentes
- **Fechas**: Valida que la fecha de inicio sea anterior a la fecha fin
- **Paginación**: Valida los límites de paginación

## Manejo de Errores

El sistema maneja los siguientes tipos de errores:

- **Esquema no encontrado**: Cuando el esquema especificado no existe
- **Parámetros inválidos**: Cuando faltan parámetros requeridos
- **Errores de base de datos**: Errores de conexión o consulta
- **Errores de validación**: Errores en los datos de entrada

## Seguridad

- **Autenticación**: Todos los endpoints requieren autenticación JWT
- **Validación de parámetros**: Validación estricta de parámetros de entrada
- **Optimización de consultas**: Middleware de optimización de consultas

## Ejemplos de Uso

### Generar un reporte básico

```bash
curl -X POST http://localhost:3000/api/reporte-generico-saldos/generar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "conjunto": "ASFSAC",
    "usuario": "ADMIN",
    "fechaInicio": "2023-01-01",
    "fechaFin": "2023-12-31"
  }'
```

### Obtener datos con filtros

```bash
curl -X GET "http://localhost:3000/api/reporte-generico-saldos/obtener?conjunto=ASFSAC&page=1&limit=10&cuentaContable=1105" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Exportar a Excel

```bash
curl -X POST http://localhost:3000/api/reporte-generico-saldos/exportar-excel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "conjunto": "ASFSAC",
    "usuario": "ADMIN",
    "fechaInicio": "2023-01-01",
    "fechaFin": "2023-12-31"
  }' \
  --output reporte.xlsx
```

## Notas Técnicas

- El reporte combina datos de las tablas `DIARIO` y `MAYOR`
- Se excluyen automáticamente los asientos de cierre
- Los saldos se calculan considerando el saldo normal de las cuentas
- Se agrupan los movimientos por cuenta contable, NIT y referencia
- Solo se incluyen registros con saldo diferente de cero
