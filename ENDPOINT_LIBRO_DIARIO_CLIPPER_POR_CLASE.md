# Endpoint: Libro Diario Clipper por Clase

## Descripción

Este endpoint permite obtener comprobantes contables del libro diario filtrados por una clase específica (ej: COMPRAS, VENTAS, GASTOS, etc.).

## URL

```
GET /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes/clase/{clase}
```

## Parámetros de Ruta

| Parámetro      | Tipo   | Requerido | Descripción                        | Ejemplo        |
| -------------- | ------ | --------- | ---------------------------------- | -------------- |
| `bdClipperGPC` | string | Sí        | Nombre de la base de datos Clipper | `bdclipperGPC` |
| `libro`        | string | Sí        | Código del libro contable          | `D`            |
| `mes`          | string | Sí        | Mes contable (formato MM)          | `08`           |
| `clase`        | string | Sí        | Clase de comprobante a filtrar     | `COMPRAS`      |

## Ejemplos de Uso

### 1. Obtener comprobantes de COMPRAS

```http
GET /api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes/clase/COMPRAS
```

### 2. Obtener comprobantes de VENTAS

```http
GET /api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes/clase/VENTAS
```

### 3. Obtener comprobantes de GASTOS

```http
GET /api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes/clase/GASTOS
```

## Respuesta Exitosa (200)

```json
{
  "success": true,
  "message": "Comprobantes de clase \"COMPRAS\" obtenidos exitosamente",
  "data": [
    {
      "clase": "COMPRAS",
      "numeroComprobante": "D06/00066",
      "cuenta": "40111101",
      "nombre": "I.G.V.",
      "documento": "TK/40614",
      "glosa": "GASTOS VARIOS",
      "montod": 0,
      "montoh": 79.48
    },
    {
      "clase": "COMPRAS",
      "numeroComprobante": "D06/00067",
      "cuenta": "40111102",
      "nombre": "IMPUESTOS",
      "documento": "TK/40615",
      "glosa": "SERVICIOS",
      "montod": 150.0,
      "montoh": 0
    }
  ]
}
```

## Respuesta de Error (400)

```json
{
  "success": false,
  "message": "Parámetros bdClipperGPC, libro, mes y clase son requeridos",
  "data": null
}
```

## Respuesta de Error (500)

```json
{
  "success": false,
  "message": "Error interno",
  "error": "Mensaje de error específico",
  "data": null
}
```

## Clases de Comprobantes Comunes

| Clase         | Descripción                 |
| ------------- | --------------------------- |
| `COMPRAS`     | Comprobantes de compras     |
| `VENTAS`      | Comprobantes de ventas      |
| `GASTOS`      | Comprobantes de gastos      |
| `INGRESOS`    | Comprobantes de ingresos    |
| `PAGOS`       | Comprobantes de pagos       |
| `COBROS`      | Comprobantes de cobros      |
| `AJUSTES`     | Comprobantes de ajustes     |
| `CIERRE`      | Comprobantes de cierre      |
| `APERTURA`    | Comprobantes de apertura    |
| `DIFERENCIAS` | Comprobantes de diferencias |

## Códigos de Estado HTTP

| Código | Descripción                        |
| ------ | ---------------------------------- |
| 200    | Éxito - Comprobantes obtenidos     |
| 400    | Error - Parámetros inválidos       |
| 500    | Error - Error interno del servidor |

## Notas Técnicas

1. **Filtrado en Base de Datos**: El filtrado se realiza directamente en la consulta SQL, no en el frontend, lo que mejora el rendimiento.

2. **Query SQL**:

   ```sql
   WHERE T0.MES = :mes
     AND T1.LIBRO = :libro
     AND T1.NOMBRE = :clase
   ```

3. **Ordenamiento**: Los resultados se ordenan por número de comprobante descendente (`ORDER BY T0.NUMERO DESC`).

4. **Optimización**: Utiliza `WITH (NOLOCK)` para mejor rendimiento en consultas de solo lectura.

5. **Mapeo de Datos**: Los nombres de columnas de SQL Server se mapean a la entidad TypeScript:
   - `T1.NOMBRE` → `clase`
   - `T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO` → `numeroComprobante`
   - `T2.CUENTA` → `cuenta`
   - `T2.NOMBRE` → `nombre`
   - `T0.TDOC + '/' + T0.NDOC` → `documento`
   - `T0.GLOSA` → `glosa`
   - `T0.MONTOD` → `montod`
   - `T0.MONTOH` → `montoh`

## Archivos de Prueba

- **HTTP Tests**: `test-swagger-libro-diario-clipper-por-clase.http`
- **Swagger UI**: Disponible en `/api-docs` cuando el servidor esté ejecutándose

## Integración Frontend

El frontend utiliza este endpoint cuando:

1. El usuario selecciona "Por Clase" en el modal de filtros
2. El usuario ingresa una clase específica (ej: "COMPRAS")
3. Se ejecuta automáticamente la consulta al backend

## Comparación con Endpoint General

| Aspecto     | Endpoint General       | Endpoint por Clase                         |
| ----------- | ---------------------- | ------------------------------------------ |
| URL         | `/comprobantes`        | `/comprobantes/clase/{clase}`              |
| Datos       | Todos los comprobantes | Solo comprobantes de la clase especificada |
| Rendimiento | Menor (más datos)      | Mayor (menos datos)                        |
| Uso         | Vista general          | Filtrado específico                        |
