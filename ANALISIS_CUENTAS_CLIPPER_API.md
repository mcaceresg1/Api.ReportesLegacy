# API de Análisis de Cuentas Clipper

## Descripción

Este endpoint permite generar reportes de análisis de cuentas clipper basados en la tabla PCGR, con filtros por mes, nivel y base de datos.

## Endpoints Disponibles

### 1. Generar Reporte

**POST** `/api/analisis-cuentas-clipper/generar`

Genera el reporte de análisis de cuentas clipper.

#### Parámetros de Entrada

```json
{
  "baseDatos": "bdclipperGPC",
  "mes": 12,
  "nivel": 2,
  "cuentaDesde": "10%",
  "cuentaHasta": "10%"
}
```

#### Parámetros Requeridos

- `baseDatos`: Base de datos a consultar (bdclipperGPC, bdclipperGPC1)
- `mes`: Mes del reporte (1-12)
- `nivel`: Nivel de la cuenta (1-3)

#### Parámetros Opcionales

- `cuentaDesde`: Filtro de cuenta desde (por defecto "10%")
- `cuentaHasta`: Filtro de cuenta hasta (por defecto "10%")

#### Respuesta

```json
{
  "success": true,
  "data": [
    {
      "cuenta": "1010101",
      "nombre": "Caja General",
      "saldo_anterior": "1,000.00",
      "debe_mes": "500.00",
      "haber_mes": "200.00",
      "saldo_final": "1,300.00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "Reporte generado exitosamente"
}
```

### 2. Obtener Reporte con Paginación

**GET** `/api/analisis-cuentas-clipper`

Obtiene el reporte con filtros y paginación.

#### Parámetros de Query

- `baseDatos`: Base de datos a consultar
- `mes`: Mes del reporte (1-12)
- `nivel`: Nivel de la cuenta (1-3)
- `cuentaDesde`: Filtro de cuenta desde
- `cuentaHasta`: Filtro de cuenta hasta
- `page`: Página (por defecto 1)
- `limit`: Límite por página (por defecto 10)

### 3. Exportar a Excel

**POST** `/api/analisis-cuentas-clipper/exportar-excel`

Exporta el reporte a formato Excel.

#### Parámetros de Entrada

```json
{
  "baseDatos": "bdclipperGPC",
  "mes": 12,
  "nivel": 2,
  "cuentaDesde": "10%",
  "cuentaHasta": "10%",
  "limit": 10000
}
```

#### Respuesta

Archivo Excel descargable con el nombre: `analisis-cuentas-clipper-{mes}-{nivel}.xlsx`

### 4. Obtener Filtros Disponibles

**GET** `/api/analisis-cuentas-clipper/filtros-disponibles?baseDatos=bdclipperGPC`

Obtiene los filtros disponibles para el reporte.

#### Respuesta

```json
{
  "success": true,
  "data": {
    "cuentas": [
      {
        "cuenta": "1010101",
        "nombre": "Caja General"
      }
    ],
    "niveles": [
      {
        "nivel": 1,
        "descripcion": "Nivel 1 - Mayor"
      },
      {
        "nivel": 2,
        "descripcion": "Nivel 2 - Subcuenta"
      },
      {
        "nivel": 3,
        "descripcion": "Nivel 3 - Auxiliar"
      }
    ],
    "meses": [
      {
        "mes": 1,
        "nombre": "Enero"
      },
      {
        "mes": 2,
        "nombre": "Febrero"
      }
    ]
  },
  "message": "Filtros obtenidos exitosamente"
}
```

### 5. Obtener Cuentas Disponibles

**GET** `/api/analisis-cuentas-clipper/cuentas-disponibles?baseDatos=bdclipperGPC&nivel=2`

Obtiene las cuentas disponibles para un nivel específico.

#### Respuesta

```json
{
  "success": true,
  "data": [
    {
      "cuenta": "1010101",
      "nombre": "Caja General"
    }
  ],
  "message": "Cuentas obtenidas exitosamente"
}
```

## Códigos de Error

### 400 Bad Request

- Parámetros requeridos faltantes
- Valores de parámetros inválidos

### 401 Unauthorized

- Token de autenticación faltante o inválido

### 500 Internal Server Error

- Error interno del servidor
- Error de conexión a la base de datos

## Ejemplos de Uso

### Ejemplo 1: Generar reporte para diciembre, nivel 2

```bash
curl -X POST "http://localhost:3000/api/analisis-cuentas-clipper/generar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "baseDatos": "bdclipperGPC",
    "mes": 12,
    "nivel": 2
  }'
```

### Ejemplo 2: Obtener reporte con paginación

```bash
curl -X GET "http://localhost:3000/api/analisis-cuentas-clipper?baseDatos=bdclipperGPC&mes=12&nivel=2&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Ejemplo 3: Exportar a Excel

```bash
curl -X POST "http://localhost:3000/api/analisis-cuentas-clipper/exportar-excel" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "baseDatos": "bdclipperGPC",
    "mes": 12,
    "nivel": 2
  }' \
  --output "analisis-cuentas-clipper.xlsx"
```

## Notas Técnicas

- El endpoint utiliza la base de datos Clipper GPC configurada en `clipper-gpc-database.ts`
- Los datos se obtienen de la tabla `PCGR`
- El filtro por defecto es para cuentas que empiecen con "10%" (Caja y Bancos)
- Los saldos se formatean con separadores de miles y 2 decimales
- El reporte incluye cálculo de saldo anterior, movimientos del mes y saldo final
- Se requiere autenticación para todos los endpoints
