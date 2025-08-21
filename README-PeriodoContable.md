# API - De Periodos Contables

## Descripción
API para generar reportes de periodos contables del sistema ERP, incluyendo saldos iniciales, débitos, créditos y saldos finales en diferentes monedas (Local, Dólar, Unidades), así como la gestión de periodos contables.

## Endpoints

### 1. Obtener Centros de Costo
**GET** `/api/reporte-periodo-contable/:conjunto/centros-costo`

Obtiene la lista de centros de costo disponibles para un conjunto específico.

#### Parámetros de URL
- `conjunto` (string, requerido): Código del conjunto contable (ej: ASFSAC)

#### Respuesta Exitosa
```json
{
  "success": true,
  "data": [
    {
      "centro_costo": "01.01.01.01.00",
      "descripcion": "Centro de Costo 1"
    }
  ],
  "message": "Centros de costo obtenidos exitosamente"
}
```

### 2. Obtener Periodos Contables
**GET** `/api/reporte-periodo-contable/:conjunto/periodos`

Obtiene la lista de periodos contables disponibles para un conjunto específico.

#### Parámetros de URL
- `conjunto` (string, requerido): Código del conjunto contable (ej: ASFSAC)

#### Respuesta Exitosa
```json
{
  "success": true,
  "data": [
    {
      "FECHA_FINAL": "2024-12-31",
      "DESCRIPCION": "Periodo Diciembre 2024",
      "CONTABILIDAD": "F",
      "FIN_PERIODO_ANUAL": "2024-12-31",
      "ESTADO": "A",
      "NoteExistsFlag": false,
      "RecordDate": "2024-01-01T00:00:00.000Z",
      "RowPointer": "ABC123",
      "CreatedBy": "ADMIN",
      "UpdatedBy": "ADMIN",
      "CreateDate": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Periodos contables obtenidos exitosamente",
  "total": 1
}
```

### 3. Generar Reporte
**POST** `/api/reporte-periodo-contable/:conjunto/generar`

Genera el reporte de periodos contables basado en los filtros proporcionados.

#### Parámetros de URL
- `conjunto` (string, requerido): Código del conjunto contable (ej: ASFSAC)

#### Cuerpo de la Petición
```json
{
  "centro_costo": "01.01.01.01.00",
  "periodo": "2021-08-31",
  "soloCuentasMovimiento": true,
  "saldosAntesCierre": false
}
```

#### Parámetros del Cuerpo
- `centro_costo` (string, opcional): Código del centro de costo específico
- `periodo` (string, requerido): Fecha del período específico en formato YYYY-MM-DD
- `soloCuentasMovimiento` (boolean, opcional): Si es true, solo incluye cuentas con movimientos
- `saldosAntesCierre` (boolean, opcional): Si es true, incluye saldos antes del cierre

#### Respuesta Exitosa
```json
{
  "success": true,
  "data": [
    {
      "centro_costo": "01.01.01.01.00",
      "cuenta_contable": "11000000",
      "fecha": "20240101",
      "saldo_normal": "D",
      "descripcion": "Caja",
      "saldo_inicial_local": 1000000.00,
      "debito_fisc_local": 500000.00,
      "credito_fisc_local": 200000.00,
      "saldo_fisc_local": 1300000.00,
      "saldo_inicial_dolar": 250000.00,
      "debito_fisc_dolar": 125000.00,
      "credito_fisc_dolar": 50000.00,
      "saldo_fisc_dolar": 325000.00,
      "saldo_inicial_und": 1000.00,
      "debito_fisc_und": 500.00,
      "credito_fisc_und": 200.00,
      "saldo_fisc_und": 1300.00
    }
  ],
  "message": "Reporte generado exitosamente",
  "total": 1
}
```

## Estructura de Datos

### PeriodoContable
```typescript
interface PeriodoContable {
  centro_costo: string;           // Código del centro de costo
  cuenta_contable: string;        // Código de la cuenta contable
  fecha: string;                  // Fecha del periodo (YYYYMMDD)
  saldo_normal: string;           // Tipo de saldo (D=Débito, C=Crédito)
  descripcion: string;            // Descripción de la cuenta
  saldo_inicial_local: number;    // Saldo inicial en moneda local
  debito_fisc_local: number;      // Débitos en moneda local
  credito_fisc_local: number;     // Créditos en moneda local
  saldo_fisc_local: number;       // Saldo final en moneda local
  saldo_inicial_dolar: number;    // Saldo inicial en dólares
  debito_fisc_dolar: number;      // Débitos en dólares
  credito_fisc_dolar: number;     // Créditos en dólares
  saldo_fisc_dolar: number;       // Saldo final en dólares
  saldo_inicial_und: number;      // Saldo inicial en unidades
  debito_fisc_und: number;        // Débitos en unidades
  credito_fisc_und: number;       // Créditos en unidades
  saldo_fisc_und: number;         // Saldo final en unidades
}
```

### PeriodoContableInfo
```typescript
interface PeriodoContableInfo {
  FECHA_FINAL: string;            // Fecha final del periodo
  DESCRIPCION: string;            // Descripción del periodo
  CONTABILIDAD: string;           // Tipo de contabilidad (F, A, etc.)
  FIN_PERIODO_ANUAL: string;      // Fecha de fin del periodo anual
  ESTADO: string;                 // Estado del periodo (A=Activo, etc.)
  NoteExistsFlag: boolean;        // Bandera de existencia de notas
  RecordDate: string;             // Fecha de registro
  RowPointer: string;             // Puntero único del registro
  CreatedBy: string;              // Usuario que creó el registro
  UpdatedBy: string;              // Usuario que actualizó el registro
  CreateDate: string;             // Fecha de creación
}
```

### FiltroPeriodoContable
```typescript
interface FiltroPeriodoContable {
  conjunto: string;               // Código del conjunto contable
  centro_costo?: string;          // Código del centro de costo (opcional)
  periodo: string;                // Fecha del período específico (YYYY-MM-DD)
  soloCuentasMovimiento: boolean; // Solo cuentas con movimientos
  saldosAntesCierre: boolean;     // Incluir saldos antes del cierre
}
```

### CentroCosto
```typescript
interface CentroCosto {
  centro_costo: string;           // Código del centro de costo
  descripcion: string;            // Descripción del centro de costo
}
```

## Lógica de Negocio

### Query Periodos Contables
- Obtiene datos directamente de la tabla `PERIODO_CONTABLE`
- Incluye información de fechas, estados y metadatos del periodo
- Ordenado por fecha final descendente
- Limitado a 1000 registros para performance

### Query Estándar (Cuentas con Movimiento)
- Obtiene saldos de las tablas `cuenta_contable` y `saldo`
- Calcula saldos iniciales restando débitos y sumando créditos
- Agrupa por centro de costo, cuenta contable, fecha y descripción
- Filtra por fecha específica del período y centro de costo específico

### Query Saldos Antes del Cierre
- Incluye lógica adicional para saldos antes del cierre contable
- Considera el estado de las cuentas (`acepta_datos = 'S'`)
- Excluye cuentas inactivas (`estado <> 'I'`)
- Maneja casos especiales de cierre contable

## Tablas de Base de Datos

### Tablas Principales
- `EXACTUS.{schema}.PERIODO_CONTABLE`: Períodos contables del sistema
- `{schema}.cuenta_contable`: Catálogo de cuentas contables
- `{schema}.saldo`: Saldos de las cuentas por periodo
- `{schema}.centro_costo`: Centros de costo del sistema
- `{schema}.centro_cuenta`: Relación entre centros de costo y cuentas
- `{schema}.hist_cierre_cg`: Historial de cierres contables

### Schema Dinámico
El schema se determina dinámicamente basado en el parámetro `conjunto`:
- Ejemplo: `ASFSAC.cuenta_contable`
- Se valida la existencia de las tablas antes de ejecutar queries

## Manejo de Errores

### Errores Comunes
- **400 Bad Request**: Parámetros faltantes o inválidos
- **404 Not Found**: Conjunto no encontrado o tablas inexistentes
- **500 Internal Server Error**: Errores de base de datos o del servidor

### Validaciones
- Verificación de existencia de tablas en el schema
- Validación de formato de fechas
- Verificación de parámetros requeridos
- Control de errores de conexión a base de datos

## Ejemplos de Uso

### Frontend Angular
```typescript
// Obtener centros de costo
const centrosCosto = await this.http.get<CentroCosto[]>(
  `${environment.apiUrl}/api/reporte-periodo-contable/${conjunto}/centros-costo`
).toPromise();

// Obtener periodos contables
const periodosContables = await this.http.get<PeriodoContableInfo[]>(
  `${environment.apiUrl}/api/reporte-periodo-contable/${conjunto}/periodos`
).toPromise();

// Generar reporte
const reporte = await this.http.post<PeriodoContable[]>(
  `${environment.apiUrl}/api/reporte-periodo-contable/${conjunto}/generar`,
  {
    periodo: '2021-08-31',
    soloCuentasMovimiento: true,
    saldosAntesCierre: false
  }
).toPromise();
```

### cURL
```bash
# Obtener centros de costo
curl -X GET "http://localhost:3000/api/reporte-periodo-contable/ASFSAC/centros-costo"

# Obtener periodos contables
curl -X GET "http://localhost:3000/api/reporte-periodo-contable/ASFSAC/periodos"

# Generar reporte
curl -X POST "http://localhost:3000/api/reporte-periodo-contable/ASFSAC/generar" \
  -H "Content-Type: application/json" \
  -d '{
    "periodo": "2021-08-31",
    "soloCuentasMovimiento": true,
    "saldosAntesCierre": false
  }'
```

## Notas de Implementación

- **Performance**: Los queries incluyen `(NOLOCK)` para mejorar performance en lecturas
- **Seguridad**: Validación de parámetros y sanitización de inputs
- **Escalabilidad**: Manejo de schemas dinámicos para multi-tenancy
- **Mantenibilidad**: Código estructurado siguiendo Clean Architecture
- **Logging**: Logs detallados para debugging y monitoreo
- **Límites**: Query de periodos limitado a 1000 registros para prevenir sobrecarga

## Dependencias

- **Backend**: Node.js, Express, Sequelize, InversifyJS
- **Base de Datos**: SQL Server
- **Arquitectura**: Clean Architecture con CQRS
- **Validación**: Middleware de validación de parámetros
- **Documentación**: Swagger/OpenAPI
