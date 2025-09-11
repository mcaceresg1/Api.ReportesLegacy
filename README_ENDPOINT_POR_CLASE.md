# Endpoint: Libro Diario Clipper por Clase - Documentación y Pruebas

## 📋 Descripción

Este documento contiene toda la información necesaria para probar y verificar el funcionamiento del endpoint de Libro Diario Clipper filtrado por clase.

## 🚀 Endpoint

```
GET /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes/clase/{clase}
```

## 📁 Archivos de Prueba

### 1. Archivos HTTP para Testing

- **`test-swagger-libro-diario-clipper-por-clase.http`** - Pruebas completas con 20 casos de test
- **`test-endpoint-por-clase.http`** - Pruebas básicas con variables de entorno

### 2. Script de Verificación

- **`verify-endpoint-por-clase.js`** - Script Node.js para verificación automática

### 3. Documentación

- **`ENDPOINT_LIBRO_DIARIO_CLIPPER_POR_CLASE.md`** - Documentación técnica completa
- **`README_ENDPOINT_POR_CLASE.md`** - Este archivo

## 🧪 Cómo Ejecutar las Pruebas

### Opción 1: Usando VS Code con REST Client

1. Abrir `test-endpoint-por-clase.http` en VS Code
2. Instalar extensión "REST Client" si no está instalada
3. Hacer clic en "Send Request" sobre cada request

### Opción 2: Usando Postman

1. Importar los requests desde los archivos HTTP
2. Configurar variables de entorno:
   - `baseUrl`: `http://192.168.90.73:3000`
   - `bdClipperGPC`: `bdclipperGPC`
   - `libro`: `D`
   - `mes`: `08`

### Opción 3: Usando cURL

```bash
# Ejemplo básico
curl -X GET "http://192.168.90.73:3000/api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes/clase/COMPRAS" \
  -H "Accept: application/json"

# Ejemplo con verbose
curl -v -X GET "http://192.168.90.73:3000/api/libro-diario-clipper/bdclipperGPC/D/08/comprobantes/clase/COMPRAS" \
  -H "Accept: application/json"
```

### Opción 4: Script de Verificación Automática

```bash
# Ejecutar desde la carpeta del proyecto
node verify-endpoint-por-clase.js
```

## 📊 Casos de Prueba

### 1. Pruebas Básicas (Casos Exitosos)

- ✅ COMPRAS
- ✅ VENTAS
- ✅ GASTOS
- ✅ INGRESOS
- ✅ PAGOS
- ✅ COBROS
- ✅ AJUSTES
- ✅ CIERRE
- ✅ APERTURA
- ✅ DIFERENCIAS

### 2. Pruebas de Error

- ❌ Clase vacía (400)
- ❌ Parámetros faltantes (400)
- ❌ Base de datos inexistente (500)
- ❌ Mes inválido (array vacío)
- ❌ Libro inválido (array vacío)
- ❌ Clase inexistente (array vacío)

### 3. Pruebas de Rendimiento

- 🔄 Múltiples clases en paralelo
- 🔄 Diferentes meses
- 🔄 Comparación con endpoint general

## 📈 Resultados Esperados

### Respuesta Exitosa (200)

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
    }
  ]
}
```

### Respuesta de Error (400)

```json
{
  "success": false,
  "message": "Parámetros bdClipperGPC, libro, mes y clase son requeridos",
  "data": null
}
```

### Respuesta de Error (500)

```json
{
  "success": false,
  "message": "Error interno",
  "error": "Mensaje de error específico",
  "data": null
}
```

## 🔧 Configuración del Servidor

### Variables de Entorno

```bash
# Puerto del servidor
PORT=3000

# URL del servidor para Swagger
SWAGGER_SERVER_URL=http://192.168.90.73:3000

# Descripción del servidor
SWAGGER_SERVER_DESCRIPTION=Servidor de desarrollo
```

### Iniciar Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 Swagger UI

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva en:

```
http://192.168.90.73:3000/api-docs
```

## 🐛 Troubleshooting

### Error: "Cannot GET /api/libro-diario-clipper/..."

- Verificar que el servidor esté ejecutándose
- Verificar que la ruta esté correctamente configurada
- Revisar logs del servidor

### Error: "Base de datos no configurada"

- Verificar configuración de base de datos
- Revisar archivo de configuración de conexiones

### Error: "Parámetros inválidos"

- Verificar que todos los parámetros de ruta estén presentes
- Verificar formato de los parámetros

### Error: "Timeout"

- Verificar que la base de datos esté accesible
- Revisar configuración de timeout en el servidor

## 📝 Notas de Desarrollo

### Arquitectura

- **Controller**: `ClipperLibroDiarioController.listarComprobantesPorClase()`
- **Service**: `ClipperLibroDiarioService.listarComprobantesPorClase()`
- **Repository**: `ReporteClipperLibroDiarioRepository.getComprobantesPorClase()`
- **Route**: `/api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes/clase/{clase}`

### Query SQL

```sql
SELECT
  T1.NOMBRE AS CLASE,
  T1.LIBRO + '' + T1.CODIGO + '/' + T0.NUMERO AS NUMERO_COMPROBANTE,
  T2.CUENTA,
  T2.NOMBRE,
  CASE
    WHEN T0.TDOC <> '' THEN T0.TDOC + '/' + T0.NDOC
    ELSE ''
  END AS DOCUMENTO,
  T0.GLOSA,
  T0.MONTOD AS montoDebe,
  T0.MONTOH AS montoHaber
FROM VOUCHER T0 WITH (NOLOCK)
INNER JOIN LIBROS T1 WITH (NOLOCK) ON T0.TIPOVOU = T1.CODIGO
INNER JOIN PCGR T2 WITH (NOLOCK) ON T0.CUENTA = T2.CUENTA
WHERE T0.MES = :mes
  AND T1.LIBRO = :libro
  AND T1.NOMBRE = :clase
ORDER BY T0.NUMERO DESC
```

### Logs del Servidor

El servidor genera logs detallados para debugging:

- `🔍 [CONTROLLER] Iniciando listarComprobantesPorClase...`
- `🔍 [SERVICE] Obteniendo comprobantes por clase...`
- `🔍 [REPOSITORY] Iniciando getComprobantesPorClase...`

## 🎯 Próximos Pasos

1. **Ejecutar pruebas** usando los archivos proporcionados
2. **Verificar Swagger UI** en `/api-docs`
3. **Probar integración** con el frontend
4. **Monitorear rendimiento** con grandes volúmenes de datos
5. **Documentar casos de uso** específicos del negocio
