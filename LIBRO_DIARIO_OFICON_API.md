# API Libro Diario OFICON

## Descripción

API para generar reportes de libro diario desde la base de datos OFICON. Esta API permite consultar movimientos contables filtrados por empresa y rango de fechas.

## Base de Datos

- **Nombre**: OFICON
- **Tipo**: SQL Server
- **Configuración**: Solo lectura
- **Variables de entorno requeridas**:
  - `OFICON_DB_NAME`: Nombre de la base de datos
  - `OFICON_DB_USER`: Usuario de la base de datos
  - `OFICON_DB_PASSWORD`: Contraseña de la base de datos
  - `OFICON_DB_HOST`: Host de la base de datos
  - `OFICON_DB_DIALECT`: Dialecto de la base de datos (mssql)

## Endpoints

### GET /api/libro-diario-oficon/generar-reporte

Genera un reporte de libro diario OFICON con parámetros de query.

**Parámetros de Query:**

- `IDEMPRESA` (number, requerido): ID de la empresa
- `FECHAINI` (string, requerido): Fecha inicial en formato YYYY-MM-DD
- `FECHAFINAL` (string, requerido): Fecha final en formato YYYY-MM-DD

**Ejemplo de uso:**

```
GET /api/libro-diario-oficon/generar-reporte?IDEMPRESA=1&FECHAINI=2024-01-01&FECHAFINAL=2024-01-31
```

### POST /api/libro-diario-oficon/generar-reporte

Genera un reporte de libro diario OFICON con parámetros en el body.

**Body:**

```json
{
  "IDEMPRESA": 1,
  "FECHAINI": "2024-01-01",
  "FECHAFINAL": "2024-01-31"
}
```

## Respuesta

**Formato de respuesta exitosa:**

```json
{
  "success": true,
  "data": [
    {
      "AÑO": 2024,
      "MES": 1,
      "CODIGO_UNIDAD_CONTABLE": "001",
      "NOMBRE_UNIDAD_CONTABLE": "Unidad Principal",
      "CODIGO_OPERACION_CONTABLE": "007",
      "NUMERO_ASIENTO": 1,
      "NUMERO_SECUENCIAL": 1,
      "FECHA_ASIENTO_CONTABLE": "01/01/2024",
      "CUENTA_EMPRESA": "110101",
      "TIPO_AUXILIAR": "CLI",
      "CODIGO_AUXILIAR": "001",
      "TIPO_DOCUMENTO": "FAC",
      "NUMERO_DOCUMENTO": "001-001",
      "FECHA_DOCUMENTO": "01/01/2024",
      "ORDEN_SERVICIO": "OS001",
      "GLOSA": "Venta de productos",
      "IMPORTE_DEBE": 1000.0,
      "IMPORTE_HABER": 0.0,
      "IMPORTE_MOVIMIENTO_ORIGINAL": 1000.0,
      "DESC_OPERACION_CONTABLE": "Operación de Venta"
    }
  ],
  "totalRecords": 1,
  "message": "Reporte generado exitosamente. Se encontraron 1 registros."
}
```

**Formato de respuesta de error:**

```json
{
  "success": false,
  "data": [],
  "message": "Los parámetros IDEMPRESA, FECHAINI y FECHAFINAL son requeridos"
}
```

## Códigos de Estado HTTP

- `200`: Operación exitosa
- `400`: Error en los parámetros de entrada
- `500`: Error interno del servidor

## Validaciones

1. **Parámetros requeridos**: IDEMPRESA, FECHAINI y FECHAFINAL son obligatorios
2. **Formato de fechas**: Las fechas deben estar en formato YYYY-MM-DD
3. **Rango de fechas**: La fecha inicial no puede ser mayor que la fecha final
4. **IDEMPRESA**: Debe ser un número válido

## Consulta SQL

La API ejecuta la siguiente consulta SQL en la base de datos OFICON:

```sql
Select TXMVTO_CNTB.NU_ANNO 'AÑO',
   TXMVTO_CNTB.NU_MESE 'MES',
   TXMVTO_CNTB.CO_UNID_CNTB 'CODIGO_UNIDAD_CONTABLE',
   TMUNID_CNTB.NO_UNID_CNTB 'NOMBRE_UNIDAD_CONTABLE',
   TXMVTO_CNTB.CO_OPRC_CNTB 'CODIGO_OPERACION_CONTABLE',
   TXMVTO_CNTB.NU_ASTO 'NUMERO_ASIENTO',
   TXMVTO_CNTB.NU_SECU 'NUMERO_SECUENCIAL',
   Convert(Varchar(10),TXMVTO_CNTB.FE_ASTO_CNTB,103)  'FECHA_ASIENTO_CONTABLE',
   TXMVTO_CNTB.CO_CNTA_EMPR 'CUENTA_EMPRESA',
   TXMVTO_CNTB.TI_AUXI_EMPR 'TIPO_AUXILIAR',
   TXMVTO_CNTB.CO_AUXI_EMPR 'CODIGO_AUXILIAR',
   TXMVTO_CNTB.TI_DOCU 'TIPO_DOCUMENTO',
    TXMVTO_CNTB.NU_DOCU 'NUMERO_DOCUMENTO',
    Convert(Varchar(10),TXMVTO_CNTB.FE_DOCU, 103)  'FECHA_DOCUMENTO',
    TXMVTO_CNTB.CO_ORDE_SERV  'ORDEN_SERVICIO',
    TXMVTO_CNTB.DE_GLOS 'GLOSA',
    PATINDEX(TXMVTO_CNTB.TI_OPER, 'CAR') * ROUND(TXMVTO_CNTB.IM_MVTO_CNTB,2) 'IMPORTE_DEBE',
     PATINDEX(TXMVTO_CNTB.TI_OPER, 'ABO') * ROUND(TXMVTO_CNTB.IM_MVTO_CNTB,2) 'IMPORTE_HABER',
       ROUND(TXMVTO_CNTB.IM_MVTO_ORIG,2) 'IMPORTE_MOVIMIENTO_ORIGINAL',
        TMOPRC_CNTB.DE_OPRC 'DESC_OPERACION_CONTABLE'
        From   TXMVTO_CNTB, TMUNID_CNTB, TMOPRC_CNTB
 Where TXMVTO_CNTB.CO_EMPR = :IDEMPRESA
   AND  TXMVTO_CNTB.NU_CNTB_EMPR = 1
      And TXMVTO_CNTB.CO_OPRC_CNTB in ( '007')
	  And TXMVTO_CNTB.SI_MVTO_CNTB In ( 'APR', 'ANU')
	      And TXMVTO_CNTB.FE_ASTO_CNTB between :FECHAINICIAL and :FECHAFINAL
     And      TMUNID_CNTB.CO_EMPR =  TXMVTO_CNTB.CO_EMPR
     And      TMUNID_CNTB.CO_UNID_CNTB = TXMVTO_CNTB.CO_UNID_CNTB
      And      TMOPRC_CNTB.CO_EMPR = TXMVTO_CNTB.CO_EMPR
       And      TMOPRC_CNTB.CO_OPRC_CNTB = TXMVTO_CNTB.CO_OPRC_CNTB
        Order by TXMVTO_CNTB.NU_ANNO, TXMVTO_CNTB.NU_MESE, TXMVTO_CNTB.CO_UNID_CNTB,
         TXMVTO_CNTB.CO_OPRC_CNTB, TXMVTO_CNTB.NU_ASTO, TXMVTO_CNTB.NU_SECU
```

## Filtros Aplicados

- **Empresa**: Filtra por el ID de empresa especificado
- **Rango de fechas**: Filtra por el rango de fechas especificado
- **Operación contable**: Solo incluye operaciones con código '007'
- **Estado de movimiento**: Solo incluye movimientos aprobados ('APR') y anulados ('ANU')
- **Contabilidad empresarial**: Solo incluye registros de contabilidad empresarial (NU_CNTB_EMPR = 1)

## Arquitectura

La API sigue el patrón de Clean Architecture con:

- **Domain Layer**: Entidades, interfaces de repositorio y servicios
- **Application Layer**: Servicios de aplicación, comandos, queries y handlers
- **Infrastructure Layer**: Repositorios, controladores y rutas
- **CQRS Pattern**: Separación de comandos y queries
- **Dependency Injection**: Uso de Inversify para inyección de dependencias

## Archivos Creados

### Domain Layer

- `src/domain/entities/LibroDiarioOficon.ts`
- `src/domain/repositories/ILibroDiarioOficonRepository.ts`
- `src/domain/services/ILibroDiarioOficonService.ts`

### Application Layer

- `src/application/commands/libro-diario-oficon/GenerarReporteLibroDiarioOficonCommand.ts`
- `src/application/queries/libro-diario-oficon/GetLibroDiarioOficonQuery.ts`
- `src/application/handlers/libro-diario-oficon/GenerarReporteLibroDiarioOficonHandler.ts`
- `src/application/handlers/libro-diario-oficon/GetLibroDiarioOficonHandler.ts`
- `src/application/services/LibroDiarioOficonService.ts`

### Infrastructure Layer

- `src/infrastructure/database/config/oficon-database.ts`
- `src/infrastructure/repositories/LibroDiarioOficonRepository.ts`
- `src/infrastructure/controllers/LibroDiarioOficonController.ts`
- `src/infrastructure/routes/LibroDiarioOficonRoutes.ts`

### Configuración

- Registrado en `src/infrastructure/container/container.ts`
- Rutas registradas en `src/app.ts`

## Documentación Swagger

La API está completamente documentada en Swagger y disponible en:

- **Desarrollo**: `http://localhost:3000/api-docs`
- **Producción**: `http://192.168.90.73:3000/api-docs`

### Características de la Documentación

- **Schemas completos**: Definición detallada de todos los tipos de datos
- **Ejemplos de request/response**: Casos de uso reales con datos de ejemplo
- **Validaciones documentadas**: Descripción de todas las validaciones aplicadas
- **Códigos de error**: Documentación completa de todos los posibles errores
- **Try it out**: Funcionalidad para probar la API directamente desde Swagger

### Tags en Swagger

La API aparece bajo el tag **"Libro Diario OFICON"** en la documentación de Swagger.

## Archivos de Prueba

Se incluye un archivo de pruebas HTTP para facilitar las pruebas:

- `test-libro-diario-oficon.http`: Contiene ejemplos de todas las llamadas a la API
