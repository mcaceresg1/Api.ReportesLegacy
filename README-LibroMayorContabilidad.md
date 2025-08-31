# API Libro Mayor de Contabilidad

## Descripción

Esta API proporciona endpoints para gestionar y generar reportes del Libro Mayor de Contabilidad, basándose en las queries SQL proporcionadas para el sistema PRLTRA.

## Estructura de la API

### Base URL
```
/api/libro-mayor-contabilidad
```

## Endpoints

### 1. Operaciones CRUD Básicas

#### GET / - Obtener todos los registros
```http
GET /api/libro-mayor-contabilidad
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Libros Mayor de Contabilidad obtenidos exitosamente",
  "data": [...],
  "total": 100
}
```

#### GET /:id - Obtener registro por ID
```http
GET /api/libro-mayor-contabilidad/123
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Libro Mayor de Contabilidad obtenido exitosamente",
  "data": {
    "id": 123,
    "saldoAcreedorDolar": 1000.00,
    "creditoDolarMayor": 500.00,
    "saldoDeudorDolar": 0.00,
    "debitoDolarMayor": 0.00,
    "saldoAcreedor": 1000.00,
    "creditoDolar": 500.00,
    "creditoLocal": 500.00,
    "saldoDeudor": 0.00,
    "debitoDolar": 0.00,
    "debitoLocal": 0.00,
    "cuentaContable": "11.0.0.0.000",
    "centroCosto": "001",
    "tipoAsiento": "DIARIO",
    "descripcion": "Cuenta Corriente",
    "consecutivo": 1,
    "referencia": "REF001",
    "nitNombre": "Empresa ABC",
    "documento": "DOC001",
    "credito": 500.00,
    "asiento": "AS001",
    "debito": 0.00,
    "fecha": "2024-01-15T00:00:00.000Z",
    "tipo": "CP",
    "nit": "12345678",
    "fuente": "BANCO",
    "periodoContable": "2024-01-31T00:00:00.000Z",
    "correlativoAsiento": "CORR001",
    "tipoLinea": 2
  }
}
```

#### POST / - Crear nuevo registro
```http
POST /api/libro-mayor-contabilidad
Content-Type: application/json

{
  "saldoAcreedorDolar": 1000.00,
  "creditoDolarMayor": 500.00,
  "saldoDeudorDolar": 0.00,
  "debitoDolarMayor": 0.00,
  "saldoAcreedor": 1000.00,
  "creditoDolar": 500.00,
  "creditoLocal": 500.00,
  "saldoDeudor": 0.00,
  "debitoDolar": 0.00,
  "debitoLocal": 0.00,
  "cuentaContable": "11.0.0.0.000",
  "centroCosto": "001",
  "tipoAsiento": "DIARIO",
  "descripcion": "Cuenta Corriente",
  "consecutivo": 1,
  "referencia": "REF001",
  "nitNombre": "Empresa ABC",
  "documento": "DOC001",
  "credito": 500.00,
  "asiento": "AS001",
  "debito": 0.00,
  "fecha": "2024-01-15T00:00:00.000Z",
  "tipo": "CP",
  "nit": "12345678",
  "fuente": "BANCO"
}
```

#### PUT /:id - Actualizar registro
```http
PUT /api/libro-mayor-contabilidad/123
Content-Type: application/json

{
  "saldoAcreedor": 1500.00,
  "creditoLocal": 750.00
}
```

#### DELETE /:id - Eliminar registro
```http
DELETE /api/libro-mayor-contabilidad/123
```

### 2. Operaciones Específicas del Negocio

#### POST /generar-reporte - Generar reporte del Libro Mayor
```http
POST /api/libro-mayor-contabilidad/generar-reporte
Content-Type: application/json

{
  "usuario": "ADMPQUES",
  "filtros": {
    "fechaInicial": "2023-01-01",
    "fechaFinal": "2024-12-31",
    "moneda": "PEN",
    "clase": "PRELIMINAR",
    "contabilidad": "F",
    "tipoReporte": "DETALLADO",
    "claseReporte": "ESTANDAR",
    "origen": "AMBOS",
    "nivelAnalisis": "5",
    "ordenadoPor": "FECHA",
    "cuentaContableDesde": "",
    "cuentaContableHasta": "",
    "centroCostoDesde": "",
    "centroCostoHasta": "",
    "tipoCentroCosto": "T",
    "libroElectronico": false,
    "versionLibroElectronico": "5",
    "excluirCierreAnual": false,
    "considerarApertura": false,
    "detalleMovimientoEfectivo": false,
    "conexionDirecta": false,
    "noMostrarSinSaldo": false,
    "respetarNIT": false,
    "incluirAuditoria": false
  },
  "fechaInicial": "2023-01-01",
  "fechaFinal": "2024-12-31"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Reporte generado exitosamente",
  "data": {
    "registrosGenerados": 1500,
    "fechaGeneracion": "2024-01-15T10:30:00.000Z",
    "usuario": "ADMPQUES",
    "filtros": {...}
  }
}
```

#### POST /limpiar-reporte - Limpiar reporte del usuario
```http
POST /api/libro-mayor-contabilidad/limpiar-reporte
Content-Type: application/json

{
  "usuario": "ADMPQUES"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Reporte limpiado exitosamente",
  "data": {
    "registrosEliminados": 1500,
    "fechaLimpieza": "2024-01-15T10:35:00.000Z",
    "usuario": "ADMPQUES"
  }
}
```

#### GET /reporte-generado - Obtener reporte generado
```http
GET /api/libro-mayor-contabilidad/reporte-generado?usuario=ADMPQUES
```

### 3. Consultas con Filtros

#### POST /filtros - Consultar con filtros y paginación
```http
POST /api/libro-mayor-contabilidad/filtros?page=1&limit=50
Content-Type: application/json

{
  "filtros": {
    "fechaInicial": "2023-01-01",
    "fechaFinal": "2024-12-31",
    "moneda": "PEN",
    "clase": "PRELIMINAR",
    "contabilidad": "F"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Libros Mayor de Contabilidad obtenidos exitosamente",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1500
  }
}
```

### 4. Consultas Específicas

#### GET /cuenta-contable/:cuentaContable - Por cuenta contable
```http
GET /api/libro-mayor-contabilidad/cuenta-contable/11.0.0.0.000
```

#### GET /centro-costo/:centroCosto - Por centro de costo
```http
GET /api/libro-mayor-contabilidad/centro-costo/001
```

#### GET /fecha-range - Por rango de fechas
```http
GET /api/libro-mayor-contabilidad/fecha-range?fechaInicial=2023-01-01&fechaFinal=2023-12-31
```

#### GET /asiento/:asiento - Por asiento
```http
GET /api/libro-mayor-contabilidad/asiento/AS001
```

#### GET /nit/:nit - Por NIT
```http
GET /api/libro-mayor-contabilidad/nit/12345678
```

### 5. Consultas de Agregación

#### GET /saldos/cuenta - Saldos por cuenta
```http
GET /api/libro-mayor-contabilidad/saldos/cuenta?fechaInicial=2023-01-01&fechaFinal=2023-12-31
```

#### GET /saldos/centro-costo - Saldos por centro de costo
```http
GET /api/libro-mayor-contabilidad/saldos/centro-costo?fechaInicial=2023-01-01&fechaFinal=2023-12-31
```

#### GET /resumen/periodo - Resumen por periodo
```http
GET /api/libro-mayor-contabilidad/resumen/periodo?fechaInicial=2023-01-01&fechaFinal=2023-12-31
```

### 6. Exportación

#### POST /exportar - Exportar reporte
```http
POST /api/libro-mayor-contabilidad/exportar?formato=csv
Content-Type: application/json

{
  "filtros": {
    "fechaInicial": "2023-01-01",
    "fechaFinal": "2024-12-31",
    "moneda": "PEN"
  }
}
```

**Formatos soportados:**
- `csv` - Archivo CSV
- `json` - Archivo JSON

## Estructura de Datos

### FiltrosLibroMayorContabilidad
```typescript
interface FiltrosLibroMayorContabilidad {
  fechaInicial: string;
  fechaFinal: string;
  moneda: 'PEN' | 'USD' | 'AMBOS';
  clase: 'PRELIMINAR' | 'OFICIAL';
  contabilidad: 'F' | 'C' | 'A';
  tipoReporte: 'DETALLADO' | 'RESUMIDO';
  claseReporte: 'ESTANDAR' | 'PERSONALIZADO';
  origen: 'AMBOS' | 'DIARIO' | 'MAYOR';
  nivelAnalisis: '1' | '2' | '3' | '4' | '5';
  ordenadoPor: 'FECHA' | 'CUENTA' | 'ASIENTO';
  cuentaContableDesde: string;
  cuentaContableHasta: string;
  centroCostoDesde: string;
  centroCostoHasta: string;
  tipoCentroCosto: 'T' | 'A' | 'I';
  libroElectronico: boolean;
  versionLibroElectronico: '3' | '4' | '5';
  excluirCierreAnual: boolean;
  considerarApertura: boolean;
  detalleMovimientoEfectivo: boolean;
  conexionDirecta: boolean;
  noMostrarSinSaldo: boolean;
  respetarNIT: boolean;
  incluirAuditoria: boolean;
}
```

### LibroMayorContabilidad
```typescript
interface LibroMayorContabilidad {
  id?: number;
  saldoAcreedorDolar: number;
  creditoDolarMayor: number;
  saldoDeudorDolar: number;
  debitoDolarMayor: number;
  saldoAcreedor: number;
  creditoDolar: number;
  creditoLocal: number;
  saldoDeudor: number;
  debitoDolar: number;
  debitoLocal: number;
  cuentaContable: string;
  centroCosto: string;
  tipoAsiento: string;
  descripcion: string;
  consecutivo: number;
  referencia: string;
  nitNombre: string;
  documento: string;
  credito: number;
  asiento: string;
  debito: number;
  fecha: Date;
  tipo: string;
  nit: string;
  fuente: string;
  periodoContable?: Date;
  correlativoAsiento?: string;
  tipoLinea?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Códigos de Estado HTTP

- `200` - OK - Operación exitosa
- `201` - Created - Recurso creado exitosamente
- `400` - Bad Request - Datos de entrada inválidos
- `404` - Not Found - Recurso no encontrado
- `500` - Internal Server Error - Error interno del servidor

## Autenticación

Todos los endpoints requieren autenticación mediante token JWT en el header:
```http
Authorization: Bearer <token>
```

## Middleware

La API incluye middleware para:
- Validación de parámetros de consulta
- Optimización de consultas
- Rate limiting básico
- Headers de caché

## Ejemplos de Uso

### Generar reporte completo
```bash
curl -X POST http://localhost:3000/api/libro-mayor-contabilidad/generar-reporte \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "usuario": "ADMPQUES",
    "filtros": {
      "fechaInicial": "2023-01-01",
      "fechaFinal": "2024-12-31",
      "moneda": "PEN",
      "clase": "PRELIMINAR",
      "contabilidad": "F"
    },
    "fechaInicial": "2023-01-01",
    "fechaFinal": "2024-12-31"
  }'
```

### Consultar con filtros
```bash
curl -X POST http://localhost:3000/api/libro-mayor-contabilidad/filtros?page=1&limit=50 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "filtros": {
      "fechaInicial": "2023-01-01",
      "fechaFinal": "2023-12-31",
      "moneda": "PEN"
    }
  }'
```

### Exportar a CSV
```bash
curl -X POST http://localhost:3000/api/libro-mayor-contabilidad/exportar?formato=csv \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "filtros": {
      "fechaInicial": "2023-01-01",
      "fechaFinal": "2023-12-31"
    }
  }' \
  --output reporte.csv
```

## Notas de Implementación

- La API implementa el patrón CQRS para separar operaciones de lectura y escritura
- Utiliza inyección de dependencias con Inversify
- Implementa validación de datos en múltiples capas
- Maneja errores de manera consistente con códigos de estado HTTP apropiados
- Incluye logging detallado para debugging y monitoreo
- Soporta paginación para consultas de grandes volúmenes de datos
- Implementa exportación en múltiples formatos (CSV, JSON)

## Dependencias

- Express.js - Framework web
- Inversify - Inyección de dependencias
- TypeScript - Tipado estático
- PostgreSQL - Base de datos (a través de pg)
- Swagger - Documentación de API
