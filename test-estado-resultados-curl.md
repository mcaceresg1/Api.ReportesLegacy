# Comandos cURL para Pruebas - Estado de Resultados

## 1. Obtener Tipos de EGP

```bash
curl -X GET "http://localhost:3000/api/estado-resultados/EMP001/tipos-egp?usuario=ADMPQUES" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 2. Obtener Períodos Contables

```bash
curl -X GET "http://localhost:3000/api/estado-resultados/EMP001/periodos-contables?fecha=2024-12-31" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Obtener Reporte de Estado de Resultados (GET)

### 3.1. Reporte Básico

```bash
curl -X GET "http://localhost:3000/api/estado-resultados/EMP001/reporte?usuario=ADMPQUES&page=1&pageSize=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.2. Reporte con Filtros Básicos

```bash
curl -X GET "http://localhost:3000/api/estado-resultados/EMP001/reporte?usuario=ADMPQUES&fecha=2024-12-31&tipoEgp=GYPPQ&moneda=NUEVO_SOL&origen=DIARIO&contabilidad=FISCAL&comparativo=ANUAL&resultado=ANUAL&page=1&pageSize=25" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3.3. Reporte con Filtros Avanzados

```bash
curl -X GET "http://localhost:3000/api/estado-resultados/EMP001/reporte?usuario=ADMPQUES&fecha=2024-12-31&tipoEgp=GYPPQ&moneda=NUEVO_SOL&origen=DIARIO&contabilidad=FISCAL&comparativo=ANUAL&resultado=ANUAL&excluirAsientoCierreAnual=false&incluirAsientoCierreAnual=true&incluirDoceUltimosPeriodos=true&mostrarInformacionAnual=true&libroElectronico=false&centroCostoTipo=RANGO&centroCostoDesde=001&centroCostoHasta=999&incluirInformacionPresupuestos=false&page=1&pageSize=50" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Generar Reporte de Estado de Resultados (POST)

### 4.1. Reporte Básico (Diciembre 2023 vs Noviembre 2023)

```bash
curl -X POST "http://localhost:3000/api/estado-resultados/reporte" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "conjunto": "EMP001",
    "usuario": "ADMPQUES",
    "filtros": {
      "fecha": "2023-12-31",
      "tipoEgp": "GYPPQ",
      "page": 1,
      "pageSize": 50
    }
  }'
```

### 4.2. Reporte con Filtros Específicos

```bash
curl -X POST "http://localhost:3000/api/estado-resultados/reporte" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "conjunto": "EMP001",
    "usuario": "ADMPQUES",
    "filtros": {
      "fecha": "2024-01-31",
      "tipoEgp": "GYPPQ",
      "page": 1,
      "pageSize": 100
    }
  }'
```

### 4.3. Reporte con Paginación

```bash
curl -X POST "http://localhost:3000/api/estado-resultados/reporte" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "conjunto": "EMP001",
    "usuario": "ADMPQUES",
    "filtros": {
      "fecha": "2023-12-31",
      "tipoEgp": "GYPPQ",
      "page": 2,
      "pageSize": 25
    }
  }'
```

## 5. Validar Balance

```bash
curl -X POST "http://localhost:3000/api/estado-resultados/validar-balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "conjunto": "001",
    "usuario": "ADMPQUES",
    "filtros": {
      "fecha": "2023-12-31",
      "tipoEgp": "GYPPQ"
    }
  }'
```

## 5. Obtener Total de Registros

```bash
curl -X POST "http://localhost:3000/api/estado-resultados/total-records" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "conjunto": "001",
    "usuario": "ADMPQUES",
    "filtros": {
      "fecha": "2023-12-31",
      "tipoEgp": "GYPPQ"
    }
  }'
```

## 6. Exportar a Excel

```bash
curl -X POST "http://localhost:3000/api/estado-resultados/EMP001/exportar-excel" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "conjunto": "EMP001",
    "usuario": "ADMPQUES",
    "fecha": "2024-12-31",
    "tipoEgp": "GYPPQ",
    "moneda": "NUEVO_SOL",
    "origen": "DIARIO",
    "contabilidad": "FISCAL",
    "comparativo": "ANUAL",
    "resultado": "ANUAL",
    "excluirAsientoCierreAnual": false,
    "incluirAsientoCierreAnual": true,
    "incluirDoceUltimosPeriodos": true,
    "mostrarInformacionAnual": true,
    "libroElectronico": false,
    "centroCostoTipo": "RANGO",
    "centroCostoDesde": "001",
    "centroCostoHasta": "999",
    "incluirInformacionPresupuestos": false,
    "tiposAsiento": [],
    "dimensionAdicional": "",
    "tituloPrincipal": "Estado de Resultados",
    "titulo2": "Período 2024",
    "titulo3": "",
    "titulo4": "",
    "page": 1,
    "pageSize": 10000
  }' \
  --output "estado_resultados.xlsx"
```

## 7. Exportar a PDF

```bash
curl -X POST "http://localhost:3000/api/estado-resultados/EMP001/exportar-pdf" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "conjunto": "EMP001",
    "usuario": "ADMPQUES",
    "fecha": "2024-12-31",
    "tipoEgp": "GYPPQ",
    "moneda": "NUEVO_SOL",
    "origen": "DIARIO",
    "contabilidad": "FISCAL",
    "comparativo": "ANUAL",
    "resultado": "ANUAL"
  }' \
  --output "estado_resultados.pdf"
```

## Parámetros de Configuración

### Conjunto
- `"EMP001"` - Conjunto principal de la empresa

### Usuario
- `"ADMPQUES"` - Usuario administrador con permisos completos

### Filtros GET (Query Parameters)
- `usuario`: Usuario ejecutor (requerido)
- `fecha`: Fecha en formato YYYY-MM-DD (período actual)
- `tipoEgp`: Tipo de estructura de reporte (GYPPQ)
- `moneda`: Moneda de presentación (NUEVO_SOL)
- `origen`: Origen de datos (DIARIO)
- `contabilidad`: Tipo de contabilidad (FISCAL)
- `comparativo`: Tipo de comparativo (ANUAL)
- `resultado`: Tipo de resultado (ANUAL)
- `page`: Número de página (opcional, default: 1)
- `pageSize`: Tamaño de página (opcional, default: 50)

### Filtros POST (Body JSON)
- `conjunto`: Código del conjunto
- `usuario`: Usuario ejecutor
- `filtros.fecha`: Fecha en formato YYYY-MM-DD
- `filtros.tipoEgp`: Tipo de estructura de reporte
- `filtros.page`: Número de página
- `filtros.pageSize`: Tamaño de página

## Respuesta Esperada

### Estructura de Respuesta del Reporte
```json
{
  "success": true,
  "data": [
    {
      "padre_nombre": "INGRESOS",
      "concepto": "Ventas de Servicios",
      "posicion": 1,
      "moneda": "Nuevo Sol",
      "saldo_anterior": 150000.00,
      "saldo_actual": 175000.00,
      "variacion": 25000.00,
      "nivel": 2,
      "esTotal": false,
      "esSubtotal": false,
      "esEncabezado": false,
      "saldo_inicial_formateado": "150,000.00",
      "saldo_final_formateado": "175,000.00",
      "variacion_formateada": "+25,000.00"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalRecords": 150,
    "totalPages": 3
  },
  "validacionBalance": {
    "valido": true,
    "mensaje": "Balance correcto: Total Ingresos - Total Egresos = Utilidad",
    "totalIngresos": 175000.00,
    "totalEgresos": 120000.00,
    "utilidad": 55000.00
  }
}
```

## Notas Importantes

1. **Autenticación**: Reemplaza `YOUR_TOKEN_HERE` con un token válido
2. **Puerto**: Ajusta el puerto si tu aplicación corre en otro puerto
3. **Fechas**: Usa fechas válidas en formato YYYY-MM-DD
4. **Conjunto**: Verifica que el conjunto "EMP001" exista en tu base de datos
5. **Usuario**: Asegúrate de que el usuario tenga permisos para ejecutar reportes
6. **Datos de Prueba**: Si obtienes arrays vacíos, ejecuta el script de generación de datos
7. **Formato de Fecha**: Para períodos contables, usa formato YYYY-MM-DD (ej: 2011-03-12)
8. **Esquema de Base de Datos**: Las tablas están en el esquema JBRTRA, no en el conjunto

## Configuración de Datos de Prueba

### Opción 1: Ejecutar Script SQL Directamente
```sql
-- Ejecuta el archivo setup-estado-resultados-data.sql en tu base de datos
-- Este script genera los datos necesarios para el Estado de Resultados
```

### Opción 2: Usar el Script de Node.js
```bash
# Instalar dependencias si no están instaladas
npm install

# Ejecutar el script de generación de datos
node test-data-generation.js
```

### Opción 3: Verificar Datos Existentes
```sql
-- Verificar si existen datos en la tabla EGP
SELECT COUNT(*) as TotalRegistros, TIPO, USUARIO
FROM JBRTRA.EGP 
WHERE USUARIO = 'ADMPQUES'
GROUP BY TIPO, USUARIO;

-- Ver algunos registros de ejemplo de EGP
SELECT TOP 10 * FROM JBRTRA.EGP 
WHERE USUARIO = 'ADMPQUES' 
ORDER BY PERIODO, TIPO, FAMILIA;

-- Verificar datos en periodo_contable
SELECT COUNT(*) as TotalPeriodos, contabilidad, estado
FROM JBRTRA.periodo_contable 
GROUP BY contabilidad, estado;

-- Verificar períodos para una fecha específica
SELECT * FROM JBRTRA.periodo_contable 
WHERE fecha_final = '2011-03-12' 
  AND contabilidad = 'F';

-- Ver algunos períodos contables de ejemplo
SELECT TOP 10 * FROM JBRTRA.periodo_contable 
WHERE contabilidad = 'F' 
ORDER BY fecha_final DESC;
```

## Troubleshooting

### Problema: Arrays Vacíos en Respuestas

**Síntomas:**
- `GET /tipos-egp` devuelve `{"success": true, "data": []}`
- `GET /periodos-contables` devuelve `{"success": true, "data": []}`

**Causas Posibles:**
1. **Datos faltantes**: Las tablas `JBRTRA.EGP` o `JBRTRA.periodo_contable` están vacías
2. **Esquema incorrecto**: Las consultas buscan en el esquema correcto
3. **Formato de fecha**: La fecha no coincide con el formato esperado
4. **Usuario incorrecto**: El usuario no tiene datos asociados

**Soluciones:**
1. **Ejecutar script de generación de datos**:
   ```bash
   node test-data-generation.js
   ```

2. **Verificar datos en base de datos**:
   ```sql
   -- Verificar EGP
   SELECT COUNT(*) FROM JBRTRA.EGP WHERE USUARIO = 'ADMPQUES';
   
   -- Verificar períodos contables
   SELECT COUNT(*) FROM JBRTRA.periodo_contable WHERE contabilidad = 'F';
   ```

3. **Usar formato de fecha correcto**:
   - ✅ Correcto: `2011-03-12`
   - ❌ Incorrecto: `2011/03/12`

## Pruebas Recomendadas

1. **Prueba Básica**: Ejecuta el comando #3.1 para verificar funcionalidad básica
2. **Prueba de Paginación**: Ejecuta comandos #3.2 y #3.3 para verificar paginación
3. **Prueba de Validación**: Ejecuta comando #4 para verificar validación de balance
4. **Prueba de Exportación**: Ejecuta comandos #6 y #7 para verificar exportación
5. **Prueba de Errores**: Intenta con fechas inválidas o conjuntos inexistentes