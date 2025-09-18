# API Libro Mayor OFICON

## Descripción

Endpoint para generar reportes de Libro Mayor OFICON utilizando el stored procedure `SP_TXMVTO_CNTB_Q13`.

## Endpoints

### 1. Generar Reporte Libro Mayor OFICON (Query)

- **URL**: `POST /api/libro-mayor-oficon/generar-reporte`
- **Descripción**: Genera reporte usando query bus
- **Autenticación**: Requerida

### 2. Generar Reporte Libro Mayor OFICON (Command)

- **URL**: `POST /api/libro-mayor-oficon/generar-reporte-command`
- **Descripción**: Genera reporte usando command bus
- **Autenticación**: Requerida

### 3. Endpoint de Prueba

- **URL**: `GET /api/libro-mayor-oficon/test`
- **Descripción**: Verifica que el endpoint esté funcionando
- **Autenticación**: No requerida

## Parámetros de Request

```typescript
interface LibroMayorOficonRequest {
  ISCO_EMPR: string; // PARAMETRO empresa (REQUERIDO)
  INNU_ANNO: number; // PARAMETRO año (REQUERIDO)
  INNU_MESE_INIC: number; // PARAMETRO mes inicial (REQUERIDO)
  INNU_MESE_FINA: number; // PARAMETRO mes final (REQUERIDO)
  ISCO_MONE: string; // PARAMETRO MONEDA: 'SOL' o 'DOL' (REQUERIDO)
  ISTI_REPO: string; // PARAMETRO tipo reporte (REQUERIDO)
  // INFORMACION ANALITICA: 'CUD','COD', 'CVD','CFD'
  // INFORMACION RESUMEN: 'CUR','COR', 'CVR','CFR'
}
```

### Valores Fijos en el Stored Procedure

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

## Ejemplo de Request

### Request Mínimo

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

### Request para Información Analítica

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

## Respuesta

### Información Analítica (ISTI_REPO = 'CUD')

```typescript
interface LibroMayorOficonAnalitico {
  NU_MESE_QUIE: number;
  CO_CNTA_EMPR: string;
  DE_CNTA_EMPR: string;
  TO_CARG: number;
  TO_ABON: number;
  NU_MESE: number;
  FE_ASTO_CNTB: string;
  NU_SECU: number;
  CN_CNTB_EMP1: string;
  TI_AUXI_EMPR: string;
  CO_AUXI_EMPR: string;
  CO_UNID_CNTB: string;
  CO_OPRC_CNTB: string;
  NU_ASTO: number;
  TI_DOCU: string;
  NU_DOCU: string;
  FE_DOCU: string;
  IM_MVTO_ORIG: number;
  DE_GLOS: string;
  IM_DEBE: number;
  IM_HABE: number;
  CO_TABL_ORIG: string;
  CO_CLAV_TAOR: string;
  CAMPO: string;
  CO_ORDE_SERV: string;
}
```

### Información Resumen (ISTI_REPO = 'CUR')

```typescript
interface LibroMayorOficonResumen {
  NU_MESE_QUIE: number;
  CO_CNTA_EMPR: string;
  DE_CNTA_EMPR: string;
  TO_CARG: number;
  TO_ABON: number;
  IM_DEBE: number;
  IM_HABE: number;
}
```

### Response Structure

```typescript
interface LibroMayorOficonResponse {
  success: boolean;
  data: LibroMayorOficon[];
  message?: string;
  totalRecords?: number;
  tipoReporte: "ANALITICO" | "RESUMEN";
}
```

## Ejemplo de Response

```json
{
  "success": true,
  "data": [
    {
      "NU_MESE_QUIE": 1,
      "CO_CNTA_EMPR": "1010101",
      "DE_CNTA_EMPR": "CAJA GENERAL",
      "TO_CARG": 1000.0,
      "TO_ABON": 500.0,
      "IM_DEBE": 1000.0,
      "IM_HABE": 500.0
    }
  ],
  "totalRecords": 1,
  "tipoReporte": "RESUMEN",
  "message": "Reporte de libro mayor OFICON generado exitosamente. Total de registros: 1"
}
```

## Códigos de Error

- **400**: Faltan parámetros requeridos o valores inválidos
  - Faltan parámetros: `ISCO_EMPR`, `INNU_ANNO`, `INNU_MESE_INIC`, `INNU_MESE_FINA`, `ISCO_MONE`, `ISTI_REPO`
  - `ISTI_REPO` inválido: debe ser uno de `CUD`, `COD`, `CVD`, `CFD`, `CUR`, `COR`, `CVR`, `CFR`
  - `ISCO_MONE` inválido: debe ser `SOL` o `DOL`
- **500**: Error interno del servidor

## Notas Técnicas

1. **Stored Procedure**: Utiliza `SP_TXMVTO_CNTB_Q13` de la base de datos OFICON
2. **Conexión**: Utiliza la misma conexión que LibroDiarioOficon (`oficonSequelize`)
3. **Arquitectura**: Implementa patrón CQRS con Command y Query buses
4. **Validación**: Valida parámetros requeridos antes de ejecutar el stored procedure
5. **Valores por defecto**: Establece valores por defecto para parámetros opcionales

## Uso

### cURL Example

```bash
curl -X POST http://localhost:3000/api/libro-mayor-oficon/generar-reporte \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ISCO_EMPR": "12",
    "INNU_ANNO": 2003,
    "INNU_MESE_INIC": 1,
    "INNU_MESE_FINA": 10,
    "ISTI_REPO": "CUR"
  }'
```

### JavaScript Example

```javascript
const response = await fetch("/api/libro-mayor-oficon/generar-reporte", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  body: JSON.stringify({
    ISCO_EMPR: "12",
    INNU_ANNO: 2003,
    INNU_MESE_INIC: 1,
    INNU_MESE_FINA: 10,
    ISTI_REPO: "CUR",
  }),
});

const data = await response.json();
console.log(data);
```
