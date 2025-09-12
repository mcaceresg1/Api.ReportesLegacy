# Libro Diario Asientos - API Tests con cURL

## Configuración Base
```bash
# Variables de entorno
BASE_URL="http://localhost:3000"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW5pc3RyYWRvciIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sSWQiOjEsImlhdCI6MTc1NzU0Njc3MiwiZXhwIjoxNzU3NTUwMzcyfQ.lNycUnjVZbzRL4MRJXqxibqHecW8KES63aa7HJKhH5E"
CONJUNTO="ASFSAC"
```

## 1. Health Check
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/health" \
  -H "Content-Type: application/json"
```

## 2. Obtener Filtros Disponibles
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/filtros" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 3. Generar Reporte (POST) - Sin Filtros
```bash
curl -X POST "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/generar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 4. Generar Reporte (POST) - Con Filtros
```bash
curl -X POST "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/generar?asientoDesde=0700000480&asientoHasta=0700000490&fechaDesde=2024-01-01&fechaHasta=2024-12-31&claseAsiento=N&origen=01&contabilidad=F" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 5. Obtener Asientos (GET) - Paginado
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?page=1&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 6. Obtener Asientos (GET) - Con Filtros
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?page=1&limit=10&asientoDesde=0700000480&asientoHasta=0700000490&fechaDesde=2024-01-01&fechaHasta=2024-12-31&claseAsiento=N&origen=01&contabilidad=F" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 7. Test con Asiento Específico (basado en el query original)
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?asientoDesde=0700000483&asientoHasta=0700000483&page=1&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 8. Test de Filtros Múltiples
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?page=1&limit=5&tipoAsientoDesde=N&tipoAsientoHasta=N&paqueteDesde=001&paqueteHasta=999&contabilidad=F&contabilidad=C" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 9. Exportar a Excel
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/exportar/excel?asientoDesde=0700000480&asientoHasta=0700000490&fechaDesde=2024-01-01&fechaHasta=2024-12-31&claseAsiento=N&origen=01&contabilidad=F&limit=1000" \
  -H "Authorization: Bearer ${TOKEN}" \
  --output "libro-diario-asientos.xlsx"
```

## 10. Exportar a PDF
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/exportar/pdf?asientoDesde=0700000480&asientoHasta=0700000490&fechaDesde=2024-01-01&fechaHasta=2024-12-31&claseAsiento=N&origen=01&contabilidad=F&limit=1000" \
  -H "Authorization: Bearer ${TOKEN}" \
  --output "libro-diario-asientos.pdf"
```

## 11. Test de Paginación
```bash
# Primera página
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?page=1&limit=5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"

# Segunda página
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?page=2&limit=5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 12. Test de Filtros por Fecha
```bash
# Último mes
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?fechaDesde=2024-12-01&fechaHasta=2024-12-31&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"

# Último trimestre
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?fechaDesde=2024-10-01&fechaHasta=2024-12-31&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 13. Test de Filtros por Tipo de Asiento
```bash
# Solo asientos normales
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?claseAsiento=N&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"

# Solo asientos de ajuste
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?claseAsiento=A&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"

# Múltiples tipos
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?claseAsiento=N&claseAsiento=A&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 14. Test de Filtros por Origen
```bash
# Solo origen manual
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?origen=01&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"

# Solo origen importado
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?origen=02&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"

# Múltiples orígenes
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?origen=01&origen=02&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 15. Test de Filtros por Contabilidad
```bash
# Solo fiscal
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?contabilidad=F&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"

# Solo corporativa
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?contabilidad=C&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"

# Ambas contabilidades
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?contabilidad=F&contabilidad=C&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 16. Test de Filtros por Paquete
```bash
# Rango de paquetes
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?paqueteDesde=001&paqueteHasta=010&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 17. Test de Filtros por Documento Global
```bash
# Rango de documentos globales
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?documentoGlobalDesde=DOC001&documentoGlobalHasta=DOC999&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## 18. Test de Combinación Completa de Filtros
```bash
curl -X GET "${BASE_URL}/api/libro-diario-asientos/${CONJUNTO}/obtener?asientoDesde=0700000480&asientoHasta=0700000490&fechaDesde=2024-01-01&fechaHasta=2024-12-31&claseAsiento=N&origen=01&paqueteDesde=001&paqueteHasta=999&contabilidad=F&documentoGlobalDesde=DOC001&documentoGlobalHasta=DOC999&page=1&limit=5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}"
```

## Respuestas Esperadas

### Health Check
```json
{
  "success": true,
  "message": "Libro Diario Asientos Controller is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Filtros Disponibles
```json
{
  "success": true,
  "data": {
    "asientos": [{"asiento": "0700000483"}],
    "tiposAsiento": [{"tipoAsiento": "N", "descripcion": "Normal"}],
    "clasesAsiento": [{"clase": "N", "descripcion": "Normal"}],
    "origenes": [{"origen": "01", "descripcion": "Manual"}],
    "paquetes": [{"paquete": "001", "descripcion": "Paquete Principal"}],
    "contabilidades": [{"codigo": "F", "descripcion": "Fiscal"}],
    "documentosGlobales": [{"documento": "DOC001"}]
  },
  "message": "Filtros obtenidos exitosamente"
}
```

### Datos del Reporte
```json
{
  "success": true,
  "data": [
    {
      "asiento": "0700000483",
      "paquete": "001",
      "descripcion": "Paquete Principal",
      "contabilidad": "F",
      "tipo_asiento": "N",
      "fecha": "2024-01-15T00:00:00.000Z",
      "origen": "01",
      "documento_global": "DOC001",
      "total_debito_loc": 1000.00,
      "total_credito_loc": 1000.00,
      "total_control_loc": 1000.00,
      "diferencia_local": 0.00,
      "total_debito_dol": 1000.00,
      "total_credito_dol": 1000.00,
      "total_control_dol": 1000.00,
      "diferencia_dolar": 0.00
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "Se encontraron 1 registros"
}
```

## Notas Importantes

1. **Token de Autorización**: Reemplaza `${TOKEN}` con un token válido de tu sistema de autenticación.

2. **Conjunto**: Reemplaza `${CONJUNTO}` con el código del conjunto contable (ej: "ASFSAC").

3. **Filtros Múltiples**: Para filtros que aceptan múltiples valores (como `claseAsiento`, `origen`, `contabilidad`), repite el parámetro en la URL.

4. **Paginación**: Los parámetros `page` y `limit` controlan la paginación. `page` empieza en 1.

5. **Fechas**: Usa el formato ISO 8601 (YYYY-MM-DD) para las fechas.

6. **Exportación**: Los endpoints de exportación devuelven archivos binarios, por lo que se debe usar `--output` para guardar el archivo.

7. **Límites**: El parámetro `limit` en las exportaciones controla el número máximo de registros a exportar (máximo 10,000).
