# 📚 Documentación Swagger - Libro Mayor OFICON

## 🚀 Acceso a Swagger UI

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://192.168.90.73:3000/api-docs
```

## 📋 Endpoints Disponibles

### 1. Generar Reporte (Query Bus)

- **URL**: `POST /api/libro-mayor-oficon/generar-reporte`
- **Descripción**: Genera un reporte de libro mayor OFICON utilizando Query Bus
- **Autenticación**: Bearer Token requerido

### 2. Generar Reporte (Command Bus)

- **URL**: `POST /api/libro-mayor-oficon/generar-reporte-command`
- **Descripción**: Genera un reporte de libro mayor OFICON utilizando Command Bus
- **Autenticación**: Bearer Token requerido

## 🔧 Parámetros de Request

### LibroMayorOficonRequest

```json
{
  "ISCO_EMPR": "string", // Código de empresa (REQUERIDO)
  "INNU_ANNO": "integer", // Año (REQUERIDO)
  "INNU_MESE_INIC": "integer", // Mes inicial (REQUERIDO)
  "INNU_MESE_FINA": "integer", // Mes final (REQUERIDO)
  "ISCO_MONE": "string", // Moneda: "SOL" o "DOL" (REQUERIDO)
  "ISTI_REPO": "string" // Tipo reporte (REQUERIDO)
}
```

### Valores Válidos

#### ISCO_MONE (Moneda)

- `"SOL"` - Soles
- `"DOL"` - Dólares

#### ISTI_REPO (Tipo de Reporte)

**Información Analítica:**

- `"CUD"` - Cuentas con detalle
- `"COD"` - Cuentas ordenadas
- `"CVD"` - Cuentas con valores
- `"CFD"` - Cuentas con filtros

**Información Resumen:**

- `"CUR"` - Cuentas resumen
- `"COR"` - Cuentas ordenadas resumen
- `"CVR"` - Cuentas con valores resumen
- `"CFR"` - Cuentas con filtros resumen

## 📊 Estructura de Respuesta

### LibroMayorOficonResponse

```json
{
  "success": "boolean", // Indica si la operación fue exitosa
  "data": "array", // Array de datos del reporte
  "totalRecords": "integer", // Total de registros devueltos
  "tipoReporte": "string", // "ANALITICO" o "RESUMEN"
  "message": "string" // Mensaje descriptivo
}
```

### Tipos de Datos

#### LibroMayorOficonAnalitico (Información Analítica)

Contiene todos los campos detallados del movimiento contable:

- `NU_MESE_QUIE`, `CO_CNTA_EMPR`, `DE_CNTA_EMPR`
- `TO_CARG`, `TO_ABON`, `NU_MESE`, `FE_ASTO_CNTB`
- `NU_SECU`, `CN_CNTB_EMP1`, `TI_AUXI_EMPR`, `CO_AUXI_EMPR`
- `CO_UNID_CNTB`, `CO_OPRC_CNTB`, `NU_ASTO`
- `TI_DOCU`, `NU_DOCU`, `FE_DOCU`, `IM_MVTO_ORIG`
- `DE_GLOS`, `IM_DEBE`, `IM_HABE`
- `CO_TABL_ORIG`, `CO_CLAV_TAOR`, `CAMPO`, `CO_ORDE_SERV`

#### LibroMayorOficonResumen (Información Resumen)

Contiene solo los campos resumidos:

- `NU_MESE_QUIE`, `CO_CNTA_EMPR`, `DE_CNTA_EMPR`
- `TO_CARG`, `TO_ABON`, `IM_DEBE`, `IM_HABE`

## 🧪 Ejemplos de Uso

### Ejemplo 1: Reporte Resumen en Soles

```json
{
  "ISCO_EMPR": "12",
  "INNU_ANNO": 2003,
  "INNU_MESE_INIC": 1,
  "INNU_MESE_FINA": 10,
  "ISCO_MONE": "SOL",
  "ISTI_REPO": "CUR"
}
```

### Ejemplo 2: Reporte Analítico en Dólares

```json
{
  "ISCO_EMPR": "12",
  "INNU_ANNO": 2003,
  "INNU_MESE_INIC": 1,
  "INNU_MESE_FINA": 10,
  "ISCO_MONE": "DOL",
  "ISTI_REPO": "CUD"
}
```

## ⚠️ Valores Fijos en el Stored Procedure

Los siguientes parámetros se establecen automáticamente con valores fijos:

- `INNU_CNTB_EMPR = 1`
- `ISCO_UNID_CNTB = ''`
- `ISCO_OPRC_CNTB = ''`
- `ISCO_CNTA_EMP1 = ''`
- `ISCO_CNTA_EMP2 = ''`
- `ISTI_AUXI_EMPR = ''`
- `ISCO_AUXI_EMP1 = ''`
- `ISCO_AUXI_EMP2 = ''`
- `INNV_INFO_CNTA = 7`
- `ISNO_USUA = 'EDGAR RAMIREZ'`
- `ISCA_WHER = ' And TXMVTO_CNTB.CO_AUXI_EMPR in ( ''00000000041'',''00011332749'',''00067907'',''00068627'',''0010007'' )'`

## 🔐 Autenticación

Todos los endpoints requieren autenticación Bearer Token. Incluye el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 📝 Códigos de Respuesta

- **200**: Reporte generado exitosamente
- **400**: Error de validación (parámetros faltantes o inválidos)
- **401**: No autorizado (token inválido o faltante)
- **500**: Error interno del servidor

## 🚀 Cómo Probar

1. **Inicia el servidor**:

   ```bash
   npm run dev
   ```

2. **Accede a Swagger UI**:

   ```
   http://192.168.90.73:3000/api-docs
   ```

3. **Autentícate**:

   - Usa el endpoint de login para obtener un token
   - Haz clic en "Authorize" en Swagger UI
   - Ingresa: `Bearer <tu_token>`

4. **Prueba los endpoints**:
   - Selecciona el endpoint deseado
   - Haz clic en "Try it out"
   - Completa el request body con los parámetros
   - Haz clic en "Execute"

## 📋 Notas Importantes

- Los valores fijos están hardcodeados en el stored procedure
- Solo 6 parámetros son dinámicos en el request
- El tipo de reporte determina la estructura de la respuesta
- Todos los endpoints requieren autenticación
- La respuesta incluye metadatos como total de registros y tipo de reporte

## 🔗 Enlaces Útiles

- **Swagger UI**: `http://192.168.90.73:3000/api-docs`
- **API Base URL**: `http://192.168.90.73:3000`
- **Documentación Markdown**: `LIBRO_MAYOR_OFICON_API.md`
- **Archivo de Pruebas HTTP**: `test-libro-mayor-oficon.http`
