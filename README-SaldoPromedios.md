# API de Saldo Promedios

## Descripción General

La API de Saldo Promedios permite generar reportes de saldos promedios de cuentas contables por centro de costo, incluyendo saldos iniciales, movimientos y saldos finales en diferentes monedas (local, dólar, unidades).

## Endpoints Disponibles

### 1. Obtener Cuentas Contables para Filtros

**GET** `/api/saldo-promedios/{conjunto}/cuentas-contables`

Obtiene la lista de todas las cuentas contables disponibles para el conjunto especificado.

#### Parámetros de Ruta
- `conjunto` (string, requerido): Código del conjunto contable (ej: "ASFSAC")

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": [
    {
      "cuenta_contable": "01.1.1.1.001",
      "descripcion": "Caja",
      "descripcion_ifrs": "Cash and cash equivalents",
      "uso_restringido": "N"
    }
  ]
}
```

### 2. Generar Reporte de Saldos Promedios

**POST** `/api/saldo-promedios/{conjunto}/generar`

Genera el reporte completo de saldos promedios según los filtros especificados.

#### Parámetros de Ruta
- `conjunto` (string, requerido): Código del conjunto contable

#### Cuerpo de la Petición
```json
{
  "cuenta_contable_desde": "00.0.0.0.000",
  "cuenta_contable_hasta": "ZZ.Z.Z.Z.ZZZ",
  "fecha_desde": "2019-01-01",
  "fecha_hasta": "2023-12-31",
  "saldosAntesCierre": true
}
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": [
    {
      "centro_costo": "01.01.01.00.00",
      "cuenta_contable": "01.1.1.1.001",
      "descripcion": "Caja",
      "saldo_inicial_local": 1000.00,
      "saldo_inicial_dolar": 250.00,
      "debito_fisc_local": 500.00,
      "credito_fisc_local": 300.00,
      "saldo_final_local": 1200.00,
      "saldo_final_dolar": 300.00,
      "saldo_promedio_local": 1100.00,
      "saldo_promedio_dolar": 275.00
    }
  ],
  "total": 1,
  "message": "Reporte generado exitosamente"
}
```

### 3. Obtener Reporte Paginado

**POST** `/api/saldo-promedios/{conjunto}/reporte`

Obtiene el reporte de saldos promedios con paginación opcional.

#### Parámetros de Ruta
- `conjunto` (string, requerido): Código del conjunto contable

#### Parámetros de Consulta
- `pagina` (number, opcional): Número de página (por defecto: 1)
- `limite` (number, opcional): Registros por página (por defecto: 50)

#### Cuerpo de la Petición
```json
{
  "cuenta_contable_desde": "00.0.0.0.000",
  "cuenta_contable_hasta": "ZZ.Z.Z.Z.ZZZ",
  "fecha_desde": "2019-01-01",
  "fecha_hasta": "2023-12-31",
  "saldosAntesCierre": true
}
```

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": [...],
  "total": 150,
  "pagina": 1,
  "limite": 50,
  "message": "Reporte obtenido exitosamente"
}
```

### 4. Limpiar Datos Temporales

**DELETE** `/api/saldo-promedios/limpiar`

Limpia cualquier dato temporal generado por el reporte.

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Datos limpiados exitosamente"
}
```

## Estructura de Datos

### FiltroSaldoPromedios
```typescript
interface FiltroSaldoPromedios {
  conjunto: string;                    // Código del conjunto contable
  cuenta_contable_desde?: string;      // Código de cuenta desde
  cuenta_contable_hasta?: string;      // Código de cuenta hasta
  fecha_desde: string;                 // Fecha desde (YYYY-MM-DD)
  fecha_hasta: string;                 // Fecha hasta (YYYY-MM-DD)
  saldosAntesCierre?: boolean;         // Incluir saldos antes del cierre
}
```

### SaldoPromediosItem
```typescript
interface SaldoPromediosItem {
  centro_costo: string;                // Código del centro de costo
  cuenta_contable: string;             // Código de la cuenta contable
  descripcion?: string;                // Descripción de la cuenta
  descripcion_ifrs?: string;           // Descripción IFRS
  uso_restringido?: string;            // Indicador de uso restringido
  
  // Saldos iniciales
  saldo_inicial_local: number;         // Saldo inicial en moneda local
  saldo_inicial_dolar: number;         // Saldo inicial en dólares
  saldo_inicial_corp_local: number;    // Saldo inicial corporativo local
  saldo_inicial_corp_dolar: number;    // Saldo inicial corporativo dólar
  saldo_inicial_fisc_und: number;      // Saldo inicial fiscal unidades
  saldo_inicial_corp_und: number;      // Saldo inicial corporativo unidades
  
  // Movimientos
  debito_fisc_local: number;           // Débito fiscal local
  credito_fisc_local: number;          // Crédito fiscal local
  debito_fisc_dolar: number;           // Débito fiscal dólar
  credito_fisc_dolar: number;          // Crédito fiscal dólar
  debito_corp_local: number;           // Débito corporativo local
  credito_corp_local: number;          // Crédito corporativo local
  debito_corp_dolar: number;           // Débito corporativo dólar
  credito_corp_dolar: number;          // Crédito corporativo dólar
  debito_fisc_und: number;             // Débito fiscal unidades
  credito_fisc_und: number;            // Crédito fiscal unidades
  debito_corp_und: number;             // Débito corporativo unidades
  credito_corp_und: number;            // Crédito corporativo unidades
  
  // Saldos finales
  saldo_final_local: number;           // Saldo final local
  saldo_final_dolar: number;           // Saldo final dólar
  saldo_final_corp_local: number;      // Saldo final corporativo local
  saldo_final_corp_dolar: number;      // Saldo final corporativo dólar
  saldo_final_fisc_und: number;        // Saldo final fiscal unidades
  saldo_final_corp_und: number;        // Saldo final corporativo unidades
  
  // Saldos promedios
  saldo_promedio_local: number;        // Saldo promedio local
  saldo_promedio_dolar: number;        // Saldo promedio dólar
  saldo_promedio_corp_local: number;   // Saldo promedio corporativo local
  saldo_promedio_corp_dolar: number;   // Saldo promedio corporativo dólar
  saldo_promedio_fisc_und: number;     // Saldo promedio fiscal unidades
  saldo_promedio_corp_und: number;     // Saldo promedio corporativo unidades
}
```

### CuentaContableOption
```typescript
interface CuentaContableOption {
  cuenta_contable: string;             // Código de la cuenta
  descripcion: string;                 // Descripción de la cuenta
  descripcion_ifrs?: string;           // Descripción IFRS
  uso_restringido?: string;            // Indicador de uso restringido
}
```

## Lógica de Negocio

### Cálculo de Saldos Promedios

El reporte combina tres fuentes de datos principales:

1. **Saldos Históricos**: De la tabla `SALDO` para el período especificado
2. **Saldos Antes del Cierre**: Saldos máximos por cuenta y centro de costo hasta la fecha de corte
3. **Movimientos de Cierre**: Movimientos de la tabla `MAYOR` para el período especificado

### Filtros Aplicados

- **Rango de Cuentas**: Desde `cuenta_contable_desde` hasta `cuenta_contable_hasta`
- **Período**: Desde `fecha_desde` hasta `fecha_hasta`
- **Contabilidad**: Solo registros con contabilidad 'F' (Fiscal) o 'A' (Administrativa)
- **Cuentas Activas**: Solo cuentas que aceptan datos (`acepta_datos = 'S'`)

## Ejemplos de Uso

### Ejemplo 1: Generar Reporte Completo
```bash
curl -X POST \
  'http://localhost:3000/api/saldo-promedios/ASFSAC/generar' \
  -H 'Content-Type: application/json' \
  -d '{
    "fecha_desde": "2019-01-01",
    "fecha_hasta": "2023-12-31",
    "saldosAntesCierre": true
  }'
```

### Ejemplo 2: Obtener Reporte Paginado
```bash
curl -X POST \
  'http://localhost:3000/api/saldo-promedios/ASFSAC/reporte?pagina=1&limite=25' \
  -H 'Content-Type: application/json' \
  -d '{
    "fecha_desde": "2019-01-01",
    "fecha_hasta": "2023-12-31"
  }'
```

### Ejemplo 3: Obtener Cuentas Contables
```bash
curl -X GET \
  'http://localhost:3000/api/saldo-promedios/ASFSAC/cuentas-contables'
```

## Códigos de Error

### 400 Bad Request
- Parámetro `conjunto` faltante
- Fechas `fecha_desde` o `fecha_hasta` faltantes
- Formato de fecha inválido

### 500 Internal Server Error
- Error en la base de datos
- Error en el procesamiento del reporte
- Error interno del servidor

## Notas de Implementación

- Las consultas SQL utilizan `WITH(NOLOCK)` para mejorar el rendimiento
- Los cálculos de saldos promedios se realizan en el backend
- La paginación se implementa a nivel de base de datos para mejor rendimiento
- Todos los campos numéricos se retornan como números, no como strings
- Las fechas se manejan en formato ISO (YYYY-MM-DD)

## Dependencias

- **Base de Datos**: SQL Server con tablas `SALDO`, `MAYOR`, `cuenta_contable`
- **Framework**: Express.js con TypeScript
- **ORM**: Sequelize para consultas SQL
- **Inyección de Dependencias**: InversifyJS
- **Documentación**: Swagger/OpenAPI
