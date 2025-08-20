# API Plan Contable - REPORTE ESTANDAR-LIBRO OFICIAL-DIARIO DE CONTABILIDAD-PLAN CONTABLE

## Descripción
Esta API proporciona funcionalidades para generar y consultar el reporte de Plan Contable basado en los queries SQL proporcionados. Permite la gestión de cuentas contables, configuraciones globales y exportación de datos.

## Endpoints Disponibles

### 1. Health Check
**GET** `/api/plan-contable/health`

Verifica el estado del servicio de Plan Contable.

**Respuesta:**
```json
{
  "success": true,
  "message": "Servicio de Plan Contable funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Generar Reporte
**POST** `/api/plan-contable/generar`

Genera el reporte del Plan Contable creando la tabla temporal y ejecutando el procedimiento almacenado.

**Cuerpo de la petición:**
```json
{
  "conjunto": "ASFSAC",
  "usuario": "ADMIN"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Reporte del Plan Contable generado exitosamente",
  "data": {
    "conjunto": "ASFSAC",
    "usuario": "ADMIN",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Obtener Datos del Plan Contable
**GET** `/api/plan-contable/obtener`

Obtiene los datos del Plan Contable con filtros opcionales y paginación.

**Parámetros de consulta:**
- `conjunto` (requerido): Código del conjunto contable
- `usuario` (opcional): Usuario que solicita los datos
- `cuentaContable` (opcional): Filtro por cuenta contable (búsqueda parcial)
- `descripcion` (opcional): Filtro por descripción (búsqueda parcial)
- `estado` (opcional): Filtro por estado
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 100, max: 1000): Registros por página

**Ejemplo:**
```
GET /api/plan-contable/obtener?conjunto=ASFSAC&usuario=ADMIN&cuentaContable=01&page=1&limit=25
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Datos del Plan Contable obtenidos exitosamente",
  "data": {
    "data": [
      {
        "CuentaContable": "01.0.0.0.000",
        "CuentaContableDesc": "Clientes",
        "Estado": "1",
        "CuentaContableCons": "01.0.0.0.000",
        "CuentaContableConsDesc": "Clientes Consolidados"
      }
    ],
    "total": 1,
    "pagina": 1,
    "porPagina": 25,
    "totalPaginas": 1
  }
}
```

### 4. Obtener Cuentas Contables Básicas
**GET** `/api/plan-contable/cuentas`

Obtiene todas las cuentas contables básicas del conjunto (query original: `select cuenta_contable, descripcion from ASFSAC.cuenta_contable order by 1`).

**Parámetros de consulta:**
- `conjunto` (requerido): Código del conjunto contable

**Ejemplo:**
```
GET /api/plan-contable/cuentas?conjunto=ASFSAC
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cuentas contables obtenidas exitosamente",
  "data": [
    {
      "cuenta_contable": "1105001",
      "descripcion": "CAJA GENERAL"
    },
    {
      "cuenta_contable": "1105002", 
      "descripcion": "CAJA MENOR"
    }
  ]
}
```

### 5. Obtener Configuración Global
**GET** `/api/plan-contable/configuracion`

Obtiene la configuración global del Plan Contable (query original: `SELECT modulo, nombre, tipo, valor FROM ASFSAC.globales WHERE modulo = 'CG' AND nombre = 'PLE-PlanContable'`).

**Parámetros de consulta:**
- `conjunto` (requerido): Código del conjunto contable

**Ejemplo:**
```
GET /api/plan-contable/configuracion?conjunto=ASFSAC
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Configuración global obtenida exitosamente",
  "data": {
    "modulo": "CG",
    "nombre": "PLE-PlanContable",
    "tipo": "STRING",
    "valor": "ACTIVO"
  }
}
```

### 6. Crear Cuenta Contable
**POST** `/api/plan-contable/crear`

Crea una nueva cuenta contable en la tabla temporal.

**Cuerpo de la petición:**
```json
{
  "conjunto": "ASFSAC",
  "CuentaContable": "01.0.0.0.001",
  "CuentaContableDesc": "Proveedores",
  "Estado": "1",
  "CuentaContableCons": "01.0.0.0.000",
  "CuentaContableConsDesc": "Clientes y Proveedores"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cuenta contable creada exitosamente",
  "data": {
    "CuentaContable": "01.0.0.0.001",
    "CuentaContableDesc": "Proveedores",
    "Estado": "1",
    "CuentaContableCons": "01.0.0.0.000",
    "CuentaContableConsDesc": "Clientes y Proveedores"
  }
}
```

### 7. Exportar a Excel
**GET** `/api/plan-contable/exportar-excel`

Exporta los datos del Plan Contable a un archivo Excel.

**Parámetros de consulta:**
- `conjunto` (requerido): Código del conjunto contable
- `usuario` (requerido): Usuario que solicita la exportación
- `cuentaContable` (opcional): Filtro por cuenta contable
- `descripcion` (opcional): Filtro por descripción
- `estado` (opcional): Filtro por estado
- `limit` (opcional, default: 10000, max: 50000): Límite de registros a exportar

**Ejemplo:**
```
GET /api/plan-contable/exportar-excel?conjunto=ASFSAC&usuario=ADMIN&limit=5000
```

**Respuesta:** Archivo Excel binario con nombre `plan-contable-{conjunto}-{fecha}.xlsx`

### 8. Limpiar Datos Temporales
**DELETE** `/api/plan-contable/limpiar`

Elimina la tabla temporal del Plan Contable.

**Parámetros de consulta:**
- `conjunto` (requerido): Código del conjunto contable

**Ejemplo:**
```
DELETE /api/plan-contable/limpiar?conjunto=ASFSAC
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Datos temporales del Plan Contable limpiados exitosamente"
}
```

## Arquitectura Implementada

### Entidades
- **PlanContableItem**: Estructura de datos principal
- **PlanContableFiltros**: Filtros para consultas
- **PlanContableResponse**: Respuesta paginada
- **GlobalConfig**: Configuración global
- **PlanContableCreate**: Datos para crear nuevas cuentas

### Repositorio
- **IPlanContableRepository**: Interfaz del repositorio
- **PlanContableRepository**: Implementación con Sequelize

### Controller
- **PlanContableController**: Maneja todas las peticiones HTTP

### Rutas
- **planContable.routes.ts**: Define todos los endpoints

## Queries SQL Implementados

### 1. Obtener Cuentas Contables
```sql
select cuenta_contable, descripcion                                                                                       
from ASFSAC.cuenta_contable order by 1 
```

### 2. Obtener Configuración Global
```sql
SELECT modulo, nombre, tipo, valor FROM ASFSAC.globales                                              
WHERE modulo = 'CG' AND nombre = 'PLE-PlanContable'   
```

### 3. Crear Tabla Temporal
```sql
CREATE TABLE ASFSAC.R_XML_8DDC55004B87DB3 (
  CuentaContable VARCHAR(254), 
  CuentaContableDesc VARCHAR(254), 
  Estado VARCHAR(254), 
  CuentaContableCons VARCHAR(254), 
  CuentaContableConsDesc VARCHAR(254),
  ROW_ORDER_BY INT NOT NULL IDENTITY PRIMARY KEY
)
```

### 4. Insertar Datos Iniciales
```sql
INSERT INTO ASFSAC.R_XML_8DDC55004B87DB3 (CuentaContable, CuentaContableDesc, Estado)  
VALUES ('01.0.0.0.000', 'Clientes','1')
```

### 5. Procedimiento Almacenado
El repositorio implementa la lógica del procedimiento `RP_XML_8DDC55004B87DB3` que incluye:
- Limpieza de caracteres especiales
- Selección ordenada por `ROW_ORDER_BY`
- Aplicación de filtros opcionales

## Características Técnicas

### Seguridad
- Validación de parámetros de entrada
- Sanitización de datos SQL
- Manejo de errores robusto

### Performance
- Paginación eficiente
- Índices en tabla temporal
- Límites configurables para exportación

### Escalabilidad
- Esquemas dinámicos por conjunto
- Arquitectura limpia separada por capas
- Inyección de dependencias

### Exportación
- Generación de archivos Excel con XLSX
- Configuración automática de headers
- Límites personalizables

## Uso Recomendado

1. **Generar Reporte**: Llamar `/generar` para crear la tabla temporal
2. **Consultar Datos**: Usar `/obtener` con filtros y paginación
3. **Exportar**: Usar `/exportar-excel` para descargar datos
4. **Limpiar**: Usar `/limpiar` para eliminar datos temporales

## Swagger Documentation

La documentación completa de la API está disponible en:
- **Desarrollo**: `http://localhost:3000/api-docs`
- **Producción**: `{servidor}/api-docs`

Buscar la sección "Plan Contable" en la documentación de Swagger para probar los endpoints interactivamente.

## Notas de Implementación

- Los esquemas son dinámicos basados en el parámetro `conjunto`
- La tabla temporal se crea automáticamente si no existe
- Los caracteres especiales se limpian según el procedimiento almacenado original
- Todos los endpoints siguen el patrón de respuesta estándar del proyecto
- La arquitectura sigue los principios SOLID y Clean Architecture
