# API del Libro Mayor de Contabilidad

## Descripción General

El API del Libro Mayor de Contabilidad permite generar, consultar y exportar reportes del libro mayor contable basados en los queries SQL proporcionados. Este sistema implementa el patrón CQRS (Command Query Responsibility Segregation) y sigue los principios de Clean Architecture.

## Características Principales

- **Generación de Reportes**: Crea reportes completos del libro mayor incluyendo saldos iniciales y movimientos
- **Filtros Avanzados**: Permite filtrar por cuenta contable, centro de costo, NIT, tipo de asiento
- **Paginación**: Soporte completo para paginación de resultados
- **Exportación a Excel**: Genera archivos Excel con formato profesional
- **Validaciones**: Validación completa de parámetros de entrada
- **Logging**: Sistema de logging detallado para auditoría
- **Documentación Swagger**: API completamente documentada

## Estructura del Proyecto

```
src/
├── domain/
│   ├── entities/
│   │   └── LibroMayor.ts              # Entidad principal
│   └── repositories/
│       └── ILibroMayorRepository.ts    # Interfaz del repository
├── application/
│   ├── commands/
│   │   └── libro-mayor/
│   │       └── GenerarReporteLibroMayorCommand.ts
│   ├── queries/
│   │   └── libro-mayor/
│   │       ├── ObtenerLibroMayorQuery.ts
│   │       └── ExportarLibroMayorExcelQuery.ts
│   └── handlers/
│       └── libro-mayor/
│           ├── GenerarReporteLibroMayorHandler.ts
│           ├── ObtenerLibroMayorHandler.ts
│           └── ExportarLibroMayorExcelHandler.ts
├── infrastructure/
│   ├── repositories/
│   │   └── LibroMayorRepository.ts     # Implementación del repository
│   ├── controllers/
│   │   └── LibroMayorController.ts     # Controlador REST
│   └── routes/
│       └── libroMayor.routes.ts        # Definición de rutas
└── config/
    └── swagger-libro-mayor.ts          # Documentación Swagger
```

## Endpoints Disponibles

### 1. Generar Reporte del Libro Mayor

**POST** `/api/libro-mayor/generar`

Genera el reporte completo del libro mayor para un período específico.

#### Request Body
```json
{
  "conjunto": "PRLTRA",
  "usuario": "ADMPQUES",
  "fechaInicio": "2023-01-01",
  "fechaFin": "2025-07-15"
}
```

#### Response
```json
{
  "success": true,
  "message": "Reporte del libro mayor generado exitosamente",
  "data": {
    "conjunto": "PRLTRA",
    "usuario": "ADMPQUES",
    "fechaInicio": "2023-01-01T00:00:00.000Z",
    "fechaFin": "2025-07-15T00:00:00.000Z",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Obtener Libro Mayor

**GET** `/api/libro-mayor/obtener`

Obtiene los datos del libro mayor con filtros y paginación.

#### Query Parameters
- `conjunto` (required): Código del conjunto contable
- `usuario` (required): Usuario que solicita los datos
- `fechaInicio` (required): Fecha de inicio del período
- `fechaFin` (required): Fecha de fin del período
- `cuentaContable` (optional): Filtro por cuenta contable
- `centroCosto` (optional): Filtro por centro de costo
- `nit` (optional): Filtro por NIT
- `tipoAsiento` (optional): Filtro por tipo de asiento
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Registros por página (default: 100, max: 1000)

#### Ejemplo de Request
```
GET /api/libro-mayor/obtener?conjunto=PRLTRA&usuario=ADMPQUES&fechaInicio=2023-01-01&fechaFin=2025-07-15&page=1&limit=100
```

#### Response
```json
{
  "success": true,
  "message": "Libro mayor obtenido exitosamente",
  "data": {
    "data": [
      {
        "CUENTA_CONTABLE": "11",
        "DESCRIPCION": "Caja y Bancos",
        "ASIENTO": "2023-001",
        "TIPO": "FA",
        "DOCUMENTO": "001-001-000000001",
        "REFERENCIA": "Factura de venta",
        "SALDO_DEUDOR": 1000.00,
        "SALDO_ACREEDOR": 0.00,
        "DEBITO_LOCAL": 1000.00,
        "CREDITO_LOCAL": 0.00,
        "SALDO_DEUDOR_DOLAR": 250.00,
        "SALDO_ACREEDOR_DOLAR": 0.00,
        "DEBITO_DOLAR": 250.00,
        "CREDITO_DOLAR": 0.00,
        "DEBITO_DOLAR_MAYOR": 250.00,
        "CREDITO_DOLAR_MAYOR": 0.00,
        "CENTRO_COSTO": "ADMIN",
        "TIPO_ASIENTO": "FA",
        "FECHA": "2023-01-15T00:00:00.000Z",
        "CONSECUTIVO": 1,
        "CORRELATIVO_ASIENTO": "2023-001",
        "TIPO_LINEA": 2,
        "NIT": "12345678",
        "NIT_NOMBRE": "EMPRESA EJEMPLO S.A.S",
        "FUENTE": "FA001-001-000000001"
      }
    ],
    "total": 1500,
    "pagina": 1,
    "porPagina": 100,
    "totalPaginas": 15
  },
  "paginacion": {
    "pagina": 1,
    "porPagina": 100,
    "total": 1500,
    "totalPaginas": 15
  }
}
```

### 3. Exportar a Excel

**GET** `/api/libro-mayor/exportar-excel`

Exporta el libro mayor a un archivo Excel.

#### Query Parameters
- `conjunto` (required): Código del conjunto contable
- `usuario` (required): Usuario que solicita la exportación
- `fechaInicio` (required): Fecha de inicio del período
- `fechaFin` (required): Fecha de fin del período
- `limit` (optional): Límite de registros a exportar (default: 1000, max: 10000)

#### Ejemplo de Request
```
GET /api/libro-mayor/exportar-excel?conjunto=PRLTRA&usuario=ADMPQUES&fechaInicio=2023-01-01&fechaFin=2025-07-15&limit=1000
```

#### Response
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition**: `attachment; filename="LibroMayor_PRLTRA_ADMPQUES_2023-01-01_2025-07-15.xlsx"`
- **Body**: Archivo Excel binario

### 4. Health Check

**GET** `/api/libro-mayor/health`

Verifica el estado del servicio.

#### Response
```json
{
  "success": true,
  "message": "Libro Mayor Controller funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## Estructura de Datos

### Entidad LibroMayor

```typescript
interface LibroMayor {
  // Campos principales
  CUENTA_CONTABLE: string;           // Código de la cuenta contable
  DESCRIPCION: string;               // Descripción de la cuenta
  ASIENTO: string;                   // Número del asiento
  TIPO: string;                      // Tipo de documento
  DOCUMENTO: string;                 // Número del documento
  REFERENCIA: string;                // Referencia del asiento
  
  // Saldos y movimientos en moneda local
  SALDO_DEUDOR: number;              // Saldo deudor local
  SALDO_ACREEDOR: number;            // Saldo acreedor local
  DEBITO_LOCAL: number;              // Débito local
  CREDITO_LOCAL: number;             // Crédito local
  
  // Saldos y movimientos en dólares
  SALDO_DEUDOR_DOLAR: number;        // Saldo deudor en dólares
  SALDO_ACREEDOR_DOLAR: number;      // Saldo acreedor en dólares
  DEBITO_DOLAR: number;              // Débito en dólares
  CREDITO_DOLAR: number;             // Crédito en dólares
  DEBITO_DOLAR_MAYOR: number;        // Débito en dólares del mayor
  CREDITO_DOLAR_MAYOR: number;       // Crédito en dólares del mayor
  
  // Información adicional
  CENTRO_COSTO: string;              // Centro de costo
  TIPO_ASIENTO: string;              // Tipo de asiento
  FECHA: Date;                       // Fecha del asiento
  CONSECUTIVO: number;               // Consecutivo
  CORRELATIVO_ASIENTO: string;       // Correlativo del asiento
  TIPO_LINEA: number;                // Tipo de línea (1=Saldos, 2=Movimientos)
  NIT: string;                       // NIT del tercero
  NIT_NOMBRE: string;                // Razón social
  FUENTE: string;                    // Fuente del asiento
  PERIODO_CONTABLE?: Date;           // Período contable
  USUARIO?: string;                  // Usuario que generó el reporte
  ROW_ORDER_BY?: number;             // Orden de la fila
}
```

### Filtros Disponibles

```typescript
interface LibroMayorFiltros {
  conjunto: string;                  // Código del conjunto contable
  usuario: string;                   // Usuario que solicita el reporte
  fechaInicio: Date;                 // Fecha de inicio del período
  fechaFin: Date;                    // Fecha de fin del período
  cuentaContable?: string;           // Filtro por cuenta contable
  centroCosto?: string;              // Filtro por centro de costo
  nit?: string;                      // Filtro por NIT
  tipoAsiento?: string;              // Filtro por tipo de asiento
  limit?: number;                    // Límite de registros por página
  offset?: number;                   // Desplazamiento para paginación
}
```

## Flujo de Generación del Reporte

1. **Limpieza de Datos Temporales**: Se eliminan reportes anteriores del usuario
2. **Obtención del Período Contable**: Se determina el período contable anterior
3. **Inserción de Saldos Iniciales**: Se insertan los saldos al inicio del período (TIPO_LINEA = 1)
4. **Inserción de Movimientos del Mayor**: Se insertan los movimientos del libro mayor (TIPO_LINEA = 2)
5. **Inserción de Movimientos del Diario**: Se insertan los movimientos del diario (TIPO_LINEA = 2)
6. **Actualización de Períodos Contables**: Se asignan los períodos contables a cada registro
7. **Inserción en Tabla Final**: Se insertan los datos en la tabla de resultados

## Tablas Utilizadas

- **`REPCG_MAYOR`**: Tabla temporal para almacenar datos del reporte
- **`R_XML_8DDC3925E54E9CF`**: Tabla final de resultados
- **`SALDO`**: Tabla de saldos contables
- **`MAYOR`**: Tabla del libro mayor
- **`DIARIO`**: Tabla del diario contable
- **`ASIENTO_DE_DIARIO`**: Tabla de asientos del diario
- **`ASIENTO_MAYORIZADO`**: Tabla de asientos mayorizados
- **`CUENTA_CONTABLE`**: Tabla de cuentas contables
- **`CENTRO_COSTO`**: Tabla de centros de costo
- **`NIT`**: Tabla de terceros
- **`PERIODO_CONTABLE`**: Tabla de períodos contables

## Códigos de Error

### HTTP Status Codes

- **200**: Operación exitosa
- **400**: Parámetros inválidos o faltantes
- **401**: No autorizado (token inválido)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

### Mensajes de Error Comunes

- **"Faltan parámetros requeridos"**: Campos obligatorios no proporcionados
- **"Formato de fecha inválido"**: Fechas en formato incorrecto
- **"La fecha de inicio debe ser menor que la fecha de fin"**: Rango de fechas inválido
- **"Parámetros de paginación inválidos"**: Valores de página o límite incorrectos
- **"No se pudo determinar el período contable anterior"**: Error en la consulta de períodos
- **"Error al generar reporte libro mayor"**: Error interno en la generación

## Ejemplos de Uso

### Generar Reporte Completo

```bash
curl -X POST http://localhost:3000/api/libro-mayor/generar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "conjunto": "PRLTRA",
    "usuario": "ADMPQUES",
    "fechaInicio": "2023-01-01",
    "fechaFin": "2025-07-15"
  }'
```

### Consultar con Filtros

```bash
curl -X GET "http://localhost:3000/api/libro-mayor/obtener?conjunto=PRLTRA&usuario=ADMPQUES&fechaInicio=2023-01-01&fechaFin=2025-07-15&cuentaContable=11&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exportar a Excel

```bash
curl -X GET "http://localhost:3000/api/libro-mayor/exportar-excel?conjunto=PRLTRA&usuario=ADMPQUES&fechaInicio=2023-01-01&fechaFin=2025-07-15&limit=1000" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output libro_mayor.xlsx
```

## Consideraciones de Rendimiento

- **Paginación**: Se recomienda usar límites de 100-500 registros por página
- **Filtros**: Aplicar filtros específicos para reducir el volumen de datos
- **Exportación**: Para archivos grandes, considerar procesamiento asíncrono
- **Caché**: Los reportes generados se almacenan temporalmente por usuario

## Seguridad

- **Autenticación**: Todos los endpoints requieren token JWT válido
- **Validación de Parámetros**: Validación completa de entrada para prevenir inyección SQL
- **Logging**: Registro de todas las operaciones para auditoría
- **Límites**: Restricciones en el número de registros y tamaño de archivos

## Monitoreo y Logging

El sistema registra todas las operaciones importantes:

- Generación de reportes
- Consultas realizadas
- Exportaciones a Excel
- Errores y excepciones
- Tiempos de respuesta

## Dependencias

- **Express.js**: Framework web
- **Sequelize**: ORM para base de datos
- **Inversify**: Container de dependencias
- **XLSX**: Generación de archivos Excel
- **Swagger**: Documentación de API

## Instalación y Configuración

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar base de datos**:
   - Verificar conexión a la base de datos EXACTUS
   - Configurar variables de entorno

3. **Ejecutar migraciones** (si es necesario):
   ```bash
   npm run migrate
   ```

4. **Iniciar el servidor**:
   ```bash
   npm start
   ```

## Desarrollo

### Estructura de Commands y Queries

El sistema implementa el patrón CQRS:

- **Commands**: Para operaciones de escritura (generar reporte)
- **Queries**: Para operaciones de lectura (obtener datos, exportar)

### Agregar Nuevos Filtros

Para agregar nuevos filtros:

1. Actualizar la interfaz `LibroMayorFiltros`
2. Modificar el repository para aplicar los filtros
3. Actualizar la documentación Swagger
4. Agregar validaciones en el controller

### Personalizar Exportación Excel

Para personalizar el formato Excel:

1. Modificar el método `exportarExcel` en el repository
2. Ajustar columnas y formato
3. Agregar estilos y fórmulas según necesidad

## Soporte y Contacto

Para soporte técnico o consultas sobre el API del Libro Mayor:

- **Documentación**: Swagger UI disponible en `/api-docs`
- **Logs**: Revisar logs del servidor para debugging
- **Health Check**: Endpoint `/api/libro-mayor/health` para verificar estado

## Changelog

### Versión 1.0.0
- Implementación inicial del API del Libro Mayor
- Soporte para generación de reportes
- Filtros y paginación
- Exportación a Excel
- Documentación Swagger completa
