# Endpoint: Comprobantes Resumen - Libro Diario Clipper

## Descripción

Este endpoint permite obtener la lista de comprobantes únicos agrupados por número y clase para la vista de resumen del Libro Diario Clipper.

## URL

```
GET /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes-resumen
```

## Parámetros de Ruta

| Parámetro      | Tipo   | Requerido | Descripción                        | Ejemplo        |
| -------------- | ------ | --------- | ---------------------------------- | -------------- |
| `bdClipperGPC` | string | Sí        | Nombre de la base de datos Clipper | `bdclipperGPC` |
| `libro`        | string | Sí        | Código del libro contable          | `D`            |
| `mes`          | string | Sí        | Mes contable (formato MM)          | `08`           |

## Ejemplos de Uso

### 1. Obtener comprobantes de resumen para Agosto 2024

```http
GET /api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes-resumen
```

### 2. Obtener comprobantes de resumen para Septiembre 2024

```http
GET /api/libro-diario-clipper/bdclipperGPC/D/09/comprobantes-resumen
```

## Respuesta Exitosa (200)

```json
{
  "success": true,
  "message": "Comprobantes de resumen obtenidos exitosamente (150 registros)",
  "data": [
    {
      "comprobante": "COMPROBANTE>>D06/00066",
      "clase": "CLASE: COMPRAS"
    },
    {
      "comprobante": "COMPROBANTE>>D06/00067",
      "clase": "CLASE: VENTAS"
    },
    {
      "comprobante": "COMPROBANTE>>D06/00068",
      "clase": "CLASE: GASTOS"
    }
  ]
}
```

## Respuesta de Error (400)

```json
{
  "success": false,
  "message": "Parámetros bdClipperGPC, libro y mes son requeridos",
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

## Códigos de Estado HTTP

| Código | Descripción                        |
| ------ | ---------------------------------- |
| 200    | Éxito - Comprobantes obtenidos     |
| 400    | Error - Parámetros inválidos       |
| 500    | Error - Error interno del servidor |

## Notas Técnicas

1. **Optimización**: Utiliza `DISTINCT` en la consulta SQL para obtener comprobantes únicos directamente desde la base de datos.

2. **Query SQL**:

   ```sql
   SELECT DISTINCT
     T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS COMPROBANTE,
     T1.NOMBRE AS CLASE
   FROM VOUCHER T0 WITH (NOLOCK)
   INNER JOIN LIBROS T1 WITH (NOLOCK) ON T0.TIPOVOU = T1.CODIGO
   WHERE T0.MES = :mes
     AND T1.LIBRO = :libro
   ORDER BY T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO
   ```

3. **Formato de Datos**: Los datos se formatean automáticamente con prefijos:

   - `COMPROBANTE>>` para el número de comprobante
   - `CLASE: ` para la clase del comprobante

4. **Ordenamiento**: Los resultados se ordenan alfabéticamente por número de comprobante.

5. **Rendimiento**: Utiliza `WITH (NOLOCK)` para mejor rendimiento en consultas de solo lectura.

## Archivos de Prueba

- **HTTP Tests**: `test-comprobantes-resumen.http`
- **Swagger UI**: Disponible en `/api-docs` cuando el servidor esté ejecutándose

## Integración Frontend

El frontend utiliza este endpoint cuando:

1. El usuario selecciona "Resumen" en el modal de filtros
2. Se ejecuta automáticamente la consulta al backend
3. Los datos se muestran en una tabla simplificada con solo 2 columnas

## Comparación con Otros Endpoints

| Aspecto     | Endpoint General      | Endpoint por Clase            | Endpoint Resumen                |
| ----------- | --------------------- | ----------------------------- | ------------------------------- |
| URL         | `/comprobantes`       | `/comprobantes/clase/{clase}` | `/comprobantes-resumen`         |
| Datos       | Todos los asientos    | Asientos de clase específica  | Comprobantes únicos agrupados   |
| Columnas    | 7 columnas detalladas | 7 columnas detalladas         | 2 columnas (comprobante, clase) |
| Uso         | Vista detallada       | Filtrado específico           | Vista de resumen                |
| Rendimiento | Menor (más datos)     | Medio (datos filtrados)       | Mayor (datos agrupados)         |

## Casos de Uso

1. **Vista de Resumen**: Mostrar solo la lista de comprobantes únicos
2. **Análisis Rápido**: Identificar qué comprobantes existen en un período
3. **Validación**: Verificar que todos los comprobantes estén correctamente registrados
4. **Navegación**: Permitir al usuario seleccionar un comprobante específico para ver detalles
