# API de Movimientos Contables Agrupados por NIT - Dimensión Contable

## Descripción
Este API proporciona endpoints para generar y consultar reportes de movimientos contables agrupados por NIT con dimensión contable, basado en datos de las tablas `diario` y `mayor`.

## Endpoints Disponibles

### 1. Health Check
**GET** `/api/movimiento-contable-agrupado/health`

Verifica el estado del servicio.

**Respuesta:**
```json
{
  "success": true,
  "message": "Servicio de movimientos contables agrupados funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "healthy": true
}
```

### 2. Generar Reporte Completo
**POST** `/api/movimiento-contable-agrupado/{conjunto}/generar`

Genera el reporte completo de movimientos contables agrupados por NIT.

**Parámetros:**
- `conjunto` (path): Código del conjunto contable (ej: "ASFSAC")

**Cuerpo de la petición:**
```json
{
  "fechaDesde": "2024-01-01",
  "fechaHasta": "2024-12-31",
  "contabilidad": ["F", "A"],
  "cuentaContable": "1105",
  "nit": "901234567",
  "dimension": "DIM001",
  "asiento": "AS-2024",
  "fuente": "DIARIO"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Reporte generado exitosamente",
  "data": [
    {
      "sNombreMonLocal": "PESO COLOMBIANO",
      "sNombreMonDolar": "DOLAR AMERICANO",
      "sTituloCuenta": "ACTIVOS",
      "sCuentaContableDesc": "Efectivo y equivalentes al efectivo",
      "sTituloNit": "PROVEEDOR",
      "sNitNombre": "EMPRESA EJEMPLO S.A.S.",
      "sReferencia": "REF-001",
      "nMontoLocal": 1500000.00,
      "nMontoDolar": 375.50,
      "sAsiento": "AS-2024-001",
      "sCuentaContable": "11050501",
      "sNit": "901234567-1",
      "dtFecha": "2024-01-15T00:00:00.000Z",
      "sFuente": "DIARIO",
      "sNotas": "Compra de materiales",
      "sDimension": "",
      "sDimensionDesc": "",
      "sQuiebre1": "",
      "sQuiebre2": "",
      "sQuiebre3": "",
      "sQuiebreDesc1": "",
      "sQuiebreDesc2": "",
      "sQuiebreDesc3": "",
      "ORDEN": 2
    }
  ],
  "total": 1,
  "filtros": {
    "conjunto": "ASFSAC",
    "fechaDesde": "2024-01-01",
    "fechaHasta": "2024-12-31"
  }
}
```

### 3. Obtener Movimientos con Paginación
**POST** `/api/movimiento-contable-agrupado/{conjunto}/obtener`

Obtiene movimientos contables agrupados con paginación.

**Parámetros:**
- `conjunto` (path): Código del conjunto contable
- `page` (query): Número de página (default: 1)
- `limit` (query): Registros por página (default: 100, max: 1000)

**Cuerpo de la petición:**
```json
{
  "fechaDesde": "2024-01-01",
  "fechaHasta": "2024-12-31",
  "cuentaContable": "1105"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Datos obtenidos exitosamente",
  "data": {
    "data": [/* array de movimientos */],
    "total": 500,
    "pagina": 1,
    "porPagina": 100,
    "totalPaginas": 5
  },
  "filtros": {
    "conjunto": "ASFSAC",
    "fechaDesde": "2024-01-01",
    "fechaHasta": "2024-12-31"
  }
}
```

### 4. Obtener Cuentas Contables
**GET** `/api/movimiento-contable-agrupado/{conjunto}/cuentas-contables`

Obtiene la lista de cuentas contables disponibles para filtros.

**Respuesta:**
```json
{
  "success": true,
  "message": "Cuentas contables obtenidas exitosamente",
  "data": [
    {
      "cuenta_contable": "11050501",
      "descripcion": "Efectivo y equivalentes al efectivo"
    }
  ]
}
```

### 5. Obtener NITs
**GET** `/api/movimiento-contable-agrupado/{conjunto}/nits`

Obtiene la lista de NITs disponibles para filtros.

**Respuesta:**
```json
{
  "success": true,
  "message": "NITs obtenidos exitosamente",
  "data": [
    {
      "nit": "901234567-1",
      "razon_social": "EMPRESA EJEMPLO S.A.S."
    }
  ]
}
```

### 6. Obtener Dimensiones Contables
**GET** `/api/movimiento-contable-agrupado/{conjunto}/dimensiones`

Obtiene la lista de dimensiones contables disponibles.

**Respuesta:**
```json
{
  "success": true,
  "message": "Dimensiones obtenidas exitosamente",
  "data": [
    {
      "dimension": "DIM001",
      "dimension_desc": "Centro de Costo Principal"
    }
  ]
}
```

### 7. Obtener Fuentes
**GET** `/api/movimiento-contable-agrupado/{conjunto}/fuentes`

Obtiene la lista de fuentes disponibles.

**Respuesta:**
```json
{
  "success": true,
  "message": "Fuentes obtenidas exitosamente",
  "data": [
    {
      "fuente": "DIARIO"
    },
    {
      "fuente": "MAYOR"
    }
  ]
}
```

### 8. Limpiar Datos Temporales
**DELETE** `/api/movimiento-contable-agrupado/{conjunto}/limpiar`

Limpia los datos temporales de la tabla de resultados.

**Respuesta:**
```json
{
  "success": true,
  "message": "Datos temporales limpiados exitosamente"
}
```

## Estructura de Datos

### MovimientoContableAgrupadoItem
```typescript
interface MovimientoContableAgrupadoItem {
  sNombreMonLocal: string;      // Nombre de la moneda local
  sNombreMonDolar: string;      // Nombre de la moneda dólar
  sTituloCuenta: string;        // Título de la cuenta
  sCuentaContableDesc: string;  // Descripción de la cuenta contable
  sTituloNit: string;           // Título del NIT
  sNitNombre: string;           // Nombre o razón social del NIT
  sReferencia: string;          // Referencia del movimiento
  nMontoLocal: number;          // Monto en moneda local
  nMontoDolar: number;          // Monto en dólares
  sAsiento: string;             // Número de asiento contable
  sCuentaContable: string;      // Código de la cuenta contable
  sNit: string;                 // Número de identificación tributaria
  dtFecha: Date;                // Fecha del movimiento
  sFuente: string;              // Fuente del movimiento
  sNotas: string;               // Notas del asiento
  sDimension: string;           // Código de dimensión contable
  sDimensionDesc: string;       // Descripción de la dimensión contable
  sQuiebre1: string;            // Primer nivel de quiebre
  sQuiebre2: string;            // Segundo nivel de quiebre
  sQuiebre3: string;            // Tercer nivel de quiebre
  sQuiebreDesc1: string;        // Descripción del primer quiebre
  sQuiebreDesc2: string;        // Descripción del segundo quiebre
  sQuiebreDesc3: string;        // Descripción del tercer quiebre
  ORDEN: number;                // Orden de presentación
}
```

### FiltroMovimientoContableAgrupado
```typescript
interface FiltroMovimientoContableAgrupado {
  conjunto: string;             // Código del conjunto contable (requerido)
  fechaDesde: string;           // Fecha de inicio (requerido)
  fechaHasta: string;           // Fecha de fin (requerido)
  contabilidad?: string[];      // Tipos de contabilidad (default: ["F", "A"])
  cuentaContable?: string;      // Filtro por cuenta contable
  nit?: string;                 // Filtro por NIT
  dimension?: string;           // Filtro por dimensión contable
  asiento?: string;             // Filtro por número de asiento
  fuente?: string;              // Filtro por fuente del movimiento
}
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400    | Parámetros inválidos o faltantes |
| 500    | Error interno del servidor |

## Notas Técnicas

1. **Tabla Temporal**: El API utiliza la tabla temporal `R_XML_8DDC5F23E38311C` para almacenar los resultados.

2. **Fuentes de Datos**: 
   - Tabla `diario` con sus asientos de `asiento_de_diario`
   - Tabla `mayor` con sus asientos de `asiento_mayorizado`

3. **Filtros de Contabilidad**: Por defecto se incluyen solo registros con contabilidad 'F' (Fiscal) y 'A' (Ambas).

4. **Ordenamiento**: Los resultados se ordenan por `sCuentaContable`, `sNit`, `orden`, `sFuente`.

5. **Paginación**: El endpoint `/obtener` soporta paginación para manejar grandes volúmenes de datos.

6. **Montos**: Los montos se calculan como:
   - Si hay débito: se toma el débito
   - Si no hay débito: se toma el crédito multiplicado por -1

## Ejemplo de Uso

```bash
# Generar reporte completo
curl -X POST "http://localhost:3000/api/movimiento-contable-agrupado/ASFSAC/generar" \
  -H "Content-Type: application/json" \
  -d '{
    "fechaDesde": "2024-01-01",
    "fechaHasta": "2024-12-31",
    "cuentaContable": "1105"
  }'

# Obtener con paginación
curl -X POST "http://localhost:3000/api/movimiento-contable-agrupado/ASFSAC/obtener?page=1&limit=50" \
  -H "Content-Type: application/json" \
  -d '{
    "fechaDesde": "2024-01-01",
    "fechaHasta": "2024-12-31"
  }'

# Obtener cuentas contables
curl -X GET "http://localhost:3000/api/movimiento-contable-agrupado/ASFSAC/cuentas-contables"
```
