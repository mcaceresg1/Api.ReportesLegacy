# API Análisis de Cuentas por Rango Clipper

## Descripción

Este endpoint permite obtener un reporte de análisis de cuentas por rango desde la base de datos Clipper GPC, utilizando la tabla VOUCHER para obtener los movimientos contables.

## Endpoint

```
GET /api/analisis-cuentas-clipper/rango
```

## Parámetros de Consulta

| Parámetro     | Tipo   | Requerido | Descripción                            | Ejemplo        |
| ------------- | ------ | --------- | -------------------------------------- | -------------- |
| `baseDatos`   | string | Sí        | Nombre de la base de datos Clipper GPC | `bdclipperGPC` |
| `cuentaDesde` | string | Sí        | Código de cuenta de inicio del rango   | `101010001`    |
| `cuentaHasta` | string | Sí        | Código de cuenta final del rango       | `980600001`    |

## Ejemplo de Solicitud

```http
GET /api/analisis-cuentas-clipper/rango?baseDatos=bdclipperGPC&cuentaDesde=101010001&cuentaHasta=980600001
Authorization: Bearer <token>
```

## Respuesta Exitosa (200)

```json
{
  "success": true,
  "message": "Reporte de análisis por rango generado exitosamente",
  "data": [
    {
      "CUENTA": "101010001",
      "NOMBRE": "Caja General",
      "DEBE": "1,234.56",
      "HABER": "789.12"
    },
    {
      "CUENTA": "101010002",
      "NOMBRE": "Banco Principal",
      "DEBE": "5,678.90",
      "HABER": "2,345.67"
    }
  ]
}
```

## Respuesta de Error (400)

```json
{
  "success": false,
  "message": "El parámetro 'baseDatos' es requerido"
}
```

## Respuesta de Error (500)

```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "Error al obtener el reporte por rango: Base de datos no encontrada"
}
```

## Validaciones

1. **Parámetros requeridos**: Todos los parámetros son obligatorios
2. **Rango válido**: `cuentaDesde` debe ser menor o igual a `cuentaHasta`
3. **Base de datos**: Debe existir en la configuración del sistema

## Consulta SQL Ejecutada

```sql
SELECT
  V.CUENTA,
  P.NOMBRE,
  FORMAT(SUM(TRY_CONVERT(FLOAT, ISNULL(V.MONTOD, '0'))), 'N2') AS DEBE,
  FORMAT(SUM(TRY_CONVERT(FLOAT, ISNULL(V.MONTOH, '0'))), 'N2') AS HABER
FROM VOUCHER V
LEFT JOIN PCGR P ON V.CUENTA = P.CUENTA
WHERE V.CUENTA BETWEEN '101010001' AND '980600001'
GROUP BY V.CUENTA, P.NOMBRE
ORDER BY V.CUENTA
```

## Notas Técnicas

- Los montos se formatean con separadores de miles y 2 decimales
- Se utiliza LEFT JOIN para incluir cuentas que puedan no tener nombre en PCGR
- Los valores nulos se convierten a 0 antes de la suma
- Los resultados se ordenan por código de cuenta

## Autenticación

Este endpoint requiere autenticación mediante JWT token en el header Authorization.

## Códigos de Estado HTTP

- `200`: Solicitud exitosa
- `400`: Error de validación de parámetros
- `401`: No autorizado (token inválido o faltante)
- `500`: Error interno del servidor
