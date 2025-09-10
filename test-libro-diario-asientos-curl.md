# Comandos cURL para Libro Diario Asientos API

## 1. Health Check
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/health" \
  -H "Content-Type: application/json"
```

## 2. Obtener Filtros Disponibles
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/filtros" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## 3. Generar Reporte (sin filtros)
```bash
curl -X POST "http://localhost:3000/api/libro-diario-asientos/ASFSAC/generar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## 4. Generar Reporte (con filtros)
```bash
curl -X POST "http://localhost:3000/api/libro-diario-asientos/ASFSAC/generar?asiento=0700000483&tipoAsiento=04&paquete=001&fechaDesde=2020-01-01&fechaHasta=2024-12-31" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## 5. Obtener Asientos (sin filtros, paginado)
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/obtener?page=1&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## 6. Obtener Asientos (con filtros, paginado)
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/obtener?asiento=0700000483&tipoAsiento=04&paquete=001&fechaDesde=2020-01-01&fechaHasta=2024-12-31&page=1&limit=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## 7. Exportar a Excel (sin filtros)
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/exportar-excel" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]" \
  --output "libro-diario-asientos-ASFSAC.xlsx"
```

## 8. Exportar a Excel (con filtros)
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/exportar-excel?asiento=0700000483&tipoAsiento=04&paquete=001&fechaDesde=2020-01-01&fechaHasta=2024-12-31" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]" \
  --output "libro-diario-asientos-filtrado.xlsx"
```

## 9. Obtener Asientos (filtro por asiento específico)
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/obtener?asiento=0700000483&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## 10. Obtener Asientos (filtro por tipo de asiento)
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/obtener?tipoAsiento=04&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## 11. Obtener Asientos (filtro por paquete)
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/obtener?paquete=001&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## 12. Obtener Asientos (filtro por rango de fechas)
```bash
curl -X GET "http://localhost:3000/api/libro-diario-asientos/ASFSAC/obtener?fechaDesde=2020-01-01&fechaHasta=2020-12-31&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [tu-token]"
```

## Notas Importantes

1. **Reemplaza `[tu-token]`** con tu token de autenticación real
2. **Cambia `localhost:3000`** por la IP del servidor si es necesario (ej: `192.168.90.73:3000`)
3. **El conjunto `ASFSAC`** puede ser cambiado por el conjunto que necesites
4. **Los filtros son opcionales** - puedes usar cualquier combinación de ellos
5. **Para Excel**, usa `--output` para guardar el archivo descargado
6. **La paginación** usa `page` (1-based) y `limit` (número de registros por página)

## Estructura de Respuesta Esperada

### Para `/obtener`:
```json
{
  "success": true,
  "data": [
    {
      "asiento": "0700000483",
      "paquete": "001",
      "descripcion": "Descripción del paquete",
      "contabilidad": "A",
      "tipo_asiento": "04",
      "fecha": "2020-07-31T00:00:00.000Z",
      "origen": "CG",
      "documento_global": null,
      "total_debito_loc": 1000.00,
      "total_credito_loc": 1000.00,
      "total_control_loc": 0.00,
      "diferencia_loc": 0.00,
      "total_debito_dol": 279.88,
      "total_credito_dol": 279.88,
      "total_control_dol": 0.00,
      "diferencia_dol": 0.00
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Datos obtenidos exitosamente"
}
```
