# API de Diario de Contabilidad

## Descripción General

La API de **Diario de Contabilidad** proporciona funcionalidades completas para generar y consultar reportes del diario contable, combinando información de las tablas `MAYOR` y `DIARIO` del sistema contable. Esta API sigue los principios de Clean Architecture y utiliza el patrón CQRS (Command Query Responsibility Segregation).

## Características Principales

- ✅ **Generación automática de reportes** combinando datos de MAYOR y DIARIO
- ✅ **Consultas paginadas** con filtros avanzados
- ✅ **Exportación a Excel** con formato profesional
- ✅ **Arquitectura CQRS** para separación de comandos y consultas
- ✅ **Documentación Swagger** completa
- ✅ **Validación robusta** de parámetros
- ✅ **Manejo de errores** consistente
- ✅ **Logging detallado** para auditoría

## Estructura del Proyecto

```
src/
├── domain/
│   ├── entities/
│   │   └── DiarioContabilidad.ts          # Entidades y DTOs
│   └── repositories/
│       └── IDiarioContabilidadRepository.ts # Contratos del repositorio
├── application/
│   ├── commands/
│   │   └── diario-contabilidad/
│   │       └── GenerarReporteDiarioContabilidadCommand.ts
│   ├── queries/
│   │   └── diario-contabilidad/
│   │       ├── ObtenerDiarioContabilidadQuery.ts
│   │       └── ExportarDiarioContabilidadExcelQuery.ts
│   └── handlers/
│       └── diario-contabilidad/
│           ├── GenerarReporteDiarioContabilidadHandler.ts
│           ├── ObtenerDiarioContabilidadHandler.ts
│           └── ExportarDiarioContabilidadExcelHandler.ts
└── infrastructure/
    ├── controllers/
    │   └── DiarioContabilidadController.ts  # Controlador REST
    ├── repositories/
    │   └── DiarioContabilidadRepository.ts  # Implementación del repositorio
    └── routes/
        └── diarioContabilidad.routes.ts    # Definición de rutas
```

## Endpoints Disponibles

### Base URL: `/api/diario-contabilidad`

#### 1. Health Check
```http
GET /health
```
Verifica el estado del servicio.

**Respuesta:**
```json
{
  "success": true,
  "message": "Servicio de Diario de Contabilidad funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### 2. Generar Reporte
```http
POST /generar
```

Genera el reporte de Diario de Contabilidad combinando datos de las tablas MAYOR y DIARIO.

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

**Respuesta:**
```json
{
  "success": true,
  "message": "Reporte de Diario de Contabilidad generado exitosamente"
}
```

#### 3. Obtener Datos
```http
GET /obtener?conjunto=001&usuario=ADMIN&fechaInicio=2024-01-01&fechaFin=2024-12-31&page=1&limit=25
```

Obtiene los datos del reporte con paginación y filtros opcionales.

**Parámetros de consulta:**
- `conjunto` (requerido): Código del conjunto contable
- `usuario` (requerido): Usuario propietario del reporte
- `fechaInicio` (requerido): Fecha de inicio (YYYY-MM-DD)
- `fechaFin` (requerido): Fecha de fin (YYYY-MM-DD)
- `cuentaContable` (opcional): Filtro por cuenta contable
- `centroCosto` (opcional): Filtro por centro de costo
- `nit` (opcional): Filtro por NIT
- `tipoAsiento` (opcional): Filtro por tipo de asiento
- `asiento` (opcional): Filtro por número de asiento
- `origen` (opcional): Filtro por módulo de origen (CP, CB, CC, FEE, IC, CJ)
- `contabilidad` (opcional): Tipo de contabilidad (F, A, F,A)
- `tipoReporte` (opcional): Tipo de reporte (Preliminar, Oficial)
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 25, max: 1000)

**Respuesta:**
```json
{
  "success": true,
  "message": "Diario de Contabilidad obtenido exitosamente",
  "data": {
    "data": [
      {
        "CUENTA_CONTABLE_DESC": "CAJA GENERAL",
        "CORRELATIVO_ASIENTO": "001",
        "SDESC_TIPO_ASIENTO": "ASIENTO DE APERTURA",
        "CUENTA_CONTABLE": "1105001",
        "CREDITO_LOCAL": 0.00,
        "CREDITO_DOLAR": 0.00,
        "CENTRO_COSTO": "001",
        "DEBITO_LOCAL": 1000.00,
        "DEBITO_DOLAR": 250.00,
        "TIPO_ASIENTO": "01",
        "TIPO_REPORTE": "Preliminar",
        "CONSECUTIVO": "000001",
        "REFERENCIA": "APERTURA 2024",
        "TIPO_CAMBIO": 3.75,
        "NOM_USUARIO": "ADMIN",
        "NIT_NOMBRE": "EMPRESA DEMO S.A.S.",
        "DOCUMENTO": "DOC001",
        "ASIENTO": "000001",
        "TIPO_DOC": "FAC",
        "FINICIO": "2024-01-01T00:00:00.000Z",
        "MODULO": "CP",
        "FFINAL": "2024-12-31T23:59:59.000Z",
        "FUENTE": "CPDOC001",
        "FECHA": "2024-01-15T00:00:00.000Z",
        "NOTAS": "Asiento de apertura del ejercicio contable 2024",
        "NIT": "900123456",
        "ROW_ORDER_BY": 1
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

#### 4. Exportar a Excel
```http
GET /exportar-excel?conjunto=001&usuario=ADMIN&fechaInicio=2024-01-01&fechaFin=2024-12-31&limit=10000
```

Exporta los datos del Diario de Contabilidad a un archivo Excel.

**Parámetros de consulta:**
- `conjunto` (requerido): Código del conjunto contable
- `usuario` (requerido): Usuario que exporta
- `fechaInicio` (requerido): Fecha de inicio (YYYY-MM-DD)
- `fechaFin` (requerido): Fecha de fin (YYYY-MM-DD)
- `contabilidad` (opcional): Tipo de contabilidad (default: "F,A")
- `tipoReporte` (opcional): Tipo de reporte (default: "Preliminar")
- `limit` (opcional): Límite de registros a exportar (default: 10000, max: 50000)

**Respuesta:** Archivo Excel binario con nombre `diario-contabilidad-{conjunto}-{fechaInicio}-{fechaFin}.xlsx`

## Estructura de Datos

### DiarioContabilidad
```typescript
interface DiarioContabilidad {
  CUENTA_CONTABLE_DESC: string;      // Descripción de la cuenta contable
  CORRELATIVO_ASIENTO: string;       // Correlativo del asiento
  SDESC_TIPO_ASIENTO: string;        // Descripción del tipo de asiento
  CUENTA_CONTABLE: string;           // Código de la cuenta contable
  CREDITO_LOCAL: number;             // Crédito en moneda local
  CREDITO_DOLAR: number;             // Crédito en dólares
  CENTRO_COSTO: string;              // Código del centro de costo
  DEBITO_LOCAL: number;              // Débito en moneda local
  DEBITO_DOLAR: number;              // Débito en dólares
  TIPO_ASIENTO: string;              // Código del tipo de asiento
  TIPO_REPORTE: string;              // Tipo de reporte
  CONSECUTIVO: string;               // Número consecutivo
  REFERENCIA: string;                // Referencia del movimiento
  TIPO_CAMBIO: number;               // Tipo de cambio
  NOM_USUARIO: string;               // Nombre del usuario
  NIT_NOMBRE: string;                // Razón social del NIT
  DOCUMENTO: string;                 // Número de documento
  ASIENTO: string;                   // Número de asiento
  TIPO_DOC: string;                  // Tipo de documento
  FINICIO: Date;                     // Fecha de inicio del período
  MODULO: string;                    // Módulo de origen
  FFINAL: Date;                      // Fecha final del período
  FUENTE: string;                    // Fuente del movimiento
  FECHA: Date;                       // Fecha del movimiento
  NOTAS: string;                     // Notas del asiento
  NIT: string;                       // Número de identificación tributaria
  ROW_ORDER_BY?: number;             // Orden de la fila
}
```

## Flujo de Generación del Reporte

1. **Creación de tabla temporal**: Se crea la tabla `ASFSAC.R_XML_8DDC54CDCEBAD6C` si no existe
2. **Limpieza de datos**: Se eliminan datos anteriores del usuario
3. **Insert desde MAYOR**: Se insertan registros de la tabla `MAYOR` con sus relaciones
4. **Insert desde DIARIO**: Se insertan registros de la tabla `DIARIO` con sus relaciones
5. **Disponibilidad**: Los datos quedan disponibles para consulta y exportación

## Tablas Utilizadas

### Tablas Principales
- **ASFSAC.MAYOR**: Movimientos del libro mayor
- **ASFSAC.DIARIO**: Movimientos del libro diario
- **ASFSAC.ASIENTO_DE_DIARIO**: Asientos de diario
- **ASFSAC.ASIENTO_MAYORIZADO**: Asientos mayorizados

### Tablas de Referencia
- **ASFSAC.NIT**: Información de terceros
- **ASFSAC.CUENTA_CONTABLE**: Catálogo de cuentas contables
- **ASFSAC.TIPO_ASIENTO**: Tipos de asientos contables

### Tabla Temporal
- **ASFSAC.R_XML_8DDC54CDCEBAD6C**: Tabla temporal para almacenar resultados del reporte

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Parámetros requeridos faltantes o inválidos |
| 500 | Error interno del servidor |

### Ejemplos de Errores Comunes

```json
{
  "success": false,
  "message": "Los campos conjunto, usuario, fechaInicio y fechaFin son obligatorios"
}
```

```json
{
  "success": false,
  "message": "Las fechas deben tener un formato válido (YYYY-MM-DD)"
}
```

```json
{
  "success": false,
  "message": "La fecha de inicio no puede ser mayor que la fecha de fin"
}
```

## Ejemplos de Uso

### Ejemplo con cURL

#### Generar reporte:
```bash
curl -X POST "http://localhost:3000/api/diario-contabilidad/generar" \
  -H "Content-Type: application/json" \
  -d '{
    "conjunto": "001",
    "usuario": "ADMIN",
    "fechaInicio": "2024-01-01",
    "fechaFin": "2024-12-31",
    "contabilidad": "F",
    "tipoReporte": "Preliminar"
  }'
```

#### Obtener datos:
```bash
curl "http://localhost:3000/api/diario-contabilidad/obtener?conjunto=001&usuario=ADMIN&fechaInicio=2024-01-01&fechaFin=2024-12-31&page=1&limit=25"
```

#### Exportar a Excel:
```bash
curl -o "diario-contabilidad.xlsx" \
  "http://localhost:3000/api/diario-contabilidad/exportar-excel?conjunto=001&usuario=ADMIN&fechaInicio=2024-01-01&fechaFin=2024-12-31&limit=10000"
```

### Ejemplo con JavaScript/TypeScript

```typescript
// Generar reporte
const generarReporte = async () => {
  const response = await fetch('/api/diario-contabilidad/generar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conjunto: '001',
      usuario: 'ADMIN',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      contabilidad: 'F',
      tipoReporte: 'Preliminar'
    })
  });
  
  const result = await response.json();
  console.log(result);
};

// Obtener datos con filtros
const obtenerDatos = async () => {
  const params = new URLSearchParams({
    conjunto: '001',
    usuario: 'ADMIN',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    cuentaContable: '1105',
    page: '1',
    limit: '25'
  });
  
  const response = await fetch(`/api/diario-contabilidad/obtener?${params}`);
  const result = await response.json();
  console.log(result);
};

// Exportar a Excel
const exportarExcel = async () => {
  const params = new URLSearchParams({
    conjunto: '001',
    usuario: 'ADMIN',
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    limit: '10000'
  });
  
  const response = await fetch(`/api/diario-contabilidad/exportar-excel?${params}`);
  const blob = await response.blob();
  
  // Crear enlace de descarga
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'diario-contabilidad.xlsx';
  link.click();
  window.URL.revokeObjectURL(url);
};
```

## Consideraciones de Rendimiento

- **Paginación**: Utilice siempre paginación para conjuntos de datos grandes
- **Filtros**: Aplique filtros específicos para reducir el volumen de datos
- **Límites de exportación**: El límite máximo de exportación es 50,000 registros
- **Índices**: Las consultas están optimizadas con índices en las columnas principales
- **Cache**: Los datos se almacenan temporalmente para consultas repetidas

## Seguridad

- **Validación**: Todos los parámetros son validados antes del procesamiento
- **SQL Injection**: Uso de consultas parametrizadas para prevenir inyección SQL
- **Límites**: Límites estrictos en paginación y exportación
- **Logging**: Registro detallado de todas las operaciones para auditoría

## Monitoreo y Logging

La API registra automáticamente:
- Inicio y fin de operaciones
- Parámetros utilizados
- Tiempo de ejecución
- Errores y excepciones
- Información de auditoría

## Dependencias

- **Express.js**: Framework web
- **Sequelize**: ORM para SQL Server
- **Inversify**: Inyección de dependencias
- **XLSX**: Generación de archivos Excel
- **UUID**: Generación de identificadores únicos

## Instalación y Configuración

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=ASFSAC
DB_USER=sa
DB_PASSWORD=password
```

3. **Ejecutar en desarrollo:**
```bash
npm run dev
```

4. **Ejecutar en producción:**
```bash
npm run build
npm start
```

## Desarrollo y Contribución

### Agregar nuevos filtros

1. Actualizar la interfaz `DiarioContabilidadFiltros`
2. Modificar el método `obtenerDiarioContabilidad` en el repositorio
3. Actualizar la documentación Swagger
4. Agregar validaciones en el controlador

### Agregar nuevos campos

1. Actualizar la interfaz `DiarioContabilidad`
2. Modificar las consultas SQL en el repositorio
3. Actualizar la exportación a Excel
4. Actualizar los esquemas de Swagger

## Soporte

Para soporte técnico o preguntas sobre la implementación, consulte:
- Documentación de Swagger: `/api-docs`
- Logs de la aplicación en `/logs`
- Health check: `/api/diario-contabilidad/health`
