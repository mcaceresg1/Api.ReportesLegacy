# Propuesta de Mejora - Estado de Resultados

## Resumen de Cambios Requeridos

Para cumplir completamente con el requerimiento CO003320-BASIC, se necesitan implementar las siguientes mejoras en el `EstadoResultadosRepository.ts`:

## 1. Mejoras Críticas (Prioridad Alta)

### 1.1 Implementar Cálculo de Variación

**Problema**: La consulta final no calcula la variación entre períodos.

**Solución**: Modificar la consulta final para incluir el cálculo de variación:

```sql
-- En la consulta final, agregar:
ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_actual THEN EG.SALDO ELSE 0 END), 0) - 
ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_anterior THEN EG.SALDO ELSE 0 END), 0) AS VARIACION
```

### 1.2 Agregar Estructura de Reporte Profesional

**Problema**: Falta encabezado y formato de reporte.

**Solución**: Crear método para generar estructura de reporte:

```typescript
private generarEstructuraReporte(
  conjunto: string, 
  fechaActual: string, 
  fechaAnterior: string
): EstadoResultados[] {
  const encabezado: EstadoResultados[] = [
    {
      cuenta_contable: '',
      fecha_balance: new Date(),
      saldo_inicial: 0,
      nombre_cuenta: 'EMPRESA XYZ S.A.',
      fecha_inicio: new Date(),
      fecha_cuenta: new Date(),
      saldo_final: 0,
      tiporeporte: 'HEADER',
      posicion: 'HEADER',
      caracter: '',
      moneda: '',
      padre: '',
      orden: 0,
      mes: ''
    },
    {
      cuenta_contable: '',
      fecha_balance: new Date(),
      saldo_inicial: 0,
      nombre_cuenta: 'ESTADO DE RESULTADOS COMPARATIVO',
      fecha_inicio: new Date(),
      fecha_cuenta: new Date(),
      saldo_final: 0,
      tiporeporte: 'TITLE',
      posicion: 'TITLE',
      caracter: '',
      moneda: '',
      padre: '',
      orden: 0,
      mes: ''
    },
    {
      cuenta_contable: '',
      fecha_balance: new Date(),
      saldo_inicial: 0,
      nombre_cuenta: `Período: ${fechaAnterior} vs ${fechaActual}`,
      fecha_inicio: new Date(),
      fecha_cuenta: new Date(),
      saldo_final: 0,
      tiporeporte: 'PERIOD',
      posicion: 'PERIOD',
      caracter: '',
      moneda: 'Nuevos Soles',
      padre: '',
      orden: 0,
      mes: ''
    }
  ];
  
  return encabezado;
}
```

### 1.3 Implementar Cálculo de Totales y Subtotales

**Problema**: No se calculan totales por familia ni totales generales.

**Solución**: Agregar consultas para calcular totales:

```typescript
private async calcularTotales(
  conjunto: string,
  usuario: string,
  tipoEgp: string,
  fechaActual: string,
  fechaAnterior: string
): Promise<EstadoResultados[]> {
  const totalesQuery = `
    SELECT 
      'TOTAL' as PADRE_NOMBRE,
      'TOTAL' as FAMILIA,
      'TOTAL INGRESOS' as CONCEPTO,
      'TOTAL_INGRESOS' as POSICION,
      'Nuevo Sol' as MONEDA,
      999 as ORDEN,
      ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_actual THEN EG.SALDO ELSE 0 END), 0) AS SALDO_ACTUAL,
      ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_anterior THEN EG.SALDO ELSE 0 END), 0) AS SALDO_ANTERIOR,
      ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_actual THEN EG.SALDO ELSE 0 END), 0) - 
      ISNULL(SUM(CASE EG.PERIODO WHEN :fecha_periodo_anterior THEN EG.SALDO ELSE 0 END), 0) AS VARIACION
    FROM ${conjunto}.EGP EG (NOLOCK)
    INNER JOIN ${conjunto}.POSICION_EGP P (NOLOCK) ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA
    WHERE EG.USUARIO = :usuario 
      AND EG.TIPO = :tipo_egp
      AND P.POSICION = 'INGRESOS'
  `;
  
  // Implementar lógica similar para EGRESOS y RESULTADO
}
```

## 2. Mejoras de Calidad (Prioridad Media)

### 2.1 Implementar Validaciones de Balance

**Problema**: No se valida el balance matemático del reporte.

**Solución**: Agregar método de validación:

```typescript
private async validarBalance(
  conjunto: string,
  usuario: string,
  tipoEgp: string,
  fechaActual: string,
  fechaAnterior: string
): Promise<{ valido: boolean; mensaje: string }> {
  try {
    const balanceQuery = `
      SELECT 
        SUM(CASE WHEN P.POSICION = 'INGRESOS' THEN 
          CASE EG.PERIODO WHEN :fecha_periodo_actual THEN EG.SALDO ELSE 0 END 
        ELSE 0 END) as TOTAL_INGRESOS_ACTUAL,
        SUM(CASE WHEN P.POSICION = 'EGRESOS' THEN 
          CASE EG.PERIODO WHEN :fecha_periodo_actual THEN EG.SALDO ELSE 0 END 
        ELSE 0 END) as TOTAL_EGRESOS_ACTUAL
      FROM ${conjunto}.EGP EG (NOLOCK)
      INNER JOIN ${conjunto}.POSICION_EGP P (NOLOCK) ON EG.TIPO = P.TIPO AND EG.FAMILIA = P.FAMILIA
      WHERE EG.USUARIO = :usuario AND EG.TIPO = :tipo_egp
    `;
    
    const [results] = await exactusSequelize.query(balanceQuery, {
      replacements: { usuario, tipo_egp, fecha_periodo_actual: fechaActual, fecha_periodo_anterior: fechaAnterior }
    });
    
    const totalIngresos = (results as any[])[0]?.TOTAL_INGRESOS_ACTUAL || 0;
    const totalEgresos = (results as any[])[0]?.TOTAL_EGRESOS_ACTUAL || 0;
    const utilidad = totalIngresos - totalEgresos;
    
    return {
      valido: Math.abs(utilidad) < 0.01, // Tolerancia de 1 centavo
      mensaje: `Balance: Ingresos ${totalIngresos} - Egresos ${totalEgresos} = Utilidad ${utilidad}`
    };
  } catch (error) {
    return { valido: false, mensaje: `Error en validación: ${error}` };
  }
}
```

### 2.2 Mejorar Formato de Números

**Problema**: Los números no tienen formato profesional.

**Solución**: Agregar método de formateo:

```typescript
private formatearNumero(valor: number): string {
  if (valor === 0) return '0.00';
  if (valor < 0) return `(${Math.abs(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  return valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

private formatearVariacion(valor: number): string {
  if (valor === 0) return '0.00';
  if (valor < 0) return `(${Math.abs(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  return `+${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
```

### 2.3 Implementar Logging de Auditoría

**Problema**: No se registra la ejecución del reporte.

**Solución**: Agregar logging:

```typescript
private async registrarEjecucion(
  conjunto: string,
  usuario: string,
  fechaActual: string,
  fechaAnterior: string,
  registrosProcesados: number,
  tiempoEjecucion: number
): Promise<void> {
  try {
    const logQuery = `
      INSERT INTO ${conjunto}.LOG_REPORTES (
        USUARIO, REPORTE, FECHA_EJECUCION, PERIODO_ACTUAL, PERIODO_ANTERIOR, 
        REGISTROS_PROCESADOS, TIEMPO_EJECUCION, ESTADO
      ) VALUES (
        :usuario, 'CO003320-BASIC', GETDATE(), :fechaActual, :fechaAnterior,
        :registrosProcesados, :tiempoEjecucion, 'EXITOSO'
      )
    `;
    
    await exactusSequelize.query(logQuery, {
      replacements: { usuario, fechaActual, fechaAnterior, registrosProcesados, tiempoEjecucion }
    });
  } catch (error) {
    console.error('Error al registrar ejecución:', error);
  }
}
```

## 3. Mejoras de Presentación (Prioridad Baja)

### 3.1 Implementar Indentación Jerárquica

**Problema**: No se muestra la jerarquía visual del reporte.

**Solución**: Modificar el mapeo de resultados:

```typescript
private mapearResultadosConJerarquia(results: any[], fechaActual: string, fechaAnterior: string): EstadoResultados[] {
  return results.map((row: any, index: number) => {
    const nivel = this.calcularNivelJerarquia(row.FAMILIA_PADRE);
    const indentacion = '  '.repeat(nivel);
    
    return {
      cuenta_contable: row.nombre_cuenta || '',
      fecha_balance: new Date(fechaActual),
      saldo_inicial: row.SALDO1 || 0,
      nombre_cuenta: `${indentacion}${row.nombre_cuenta || ''}`,
      fecha_inicio: new Date(fechaAnterior),
      fecha_cuenta: new Date(fechaActual),
      saldo_final: row.SALDO2 || 0,
      tiporeporte: 'GYPPQ',
      posicion: row.POSICION || '',
      caracter: nivel > 0 ? 'SUBCUENTA' : 'CUENTA',
      moneda: 'Nuevo Sol',
      padre: row.NOMBRE || '',
      orden: row.ORDEN || 0,
      mes: fechaActual ? fechaActual.split('-')[1] || '' : '',
      variacion: (row.SALDO2 || 0) - (row.SALDO1 || 0),
      nivel: nivel
    };
  });
}

private calcularNivelJerarquia(familiaPadre: string): number {
  if (!familiaPadre) return 0;
  return familiaPadre.split('.').length - 1;
}
```

## 4. Implementación del Método Principal Mejorado

```typescript
async getEstadoResultados(
  conjunto: string, 
  usuario: string, 
  filtros: FiltrosEstadoResultados,
  page: number = 1,
  pageSize: number = 20
): Promise<EstadoResultados[]> {
  const inicioEjecucion = Date.now();
  
  try {
    // 1. Validar parámetros
    await this.validarParametros(conjunto, usuario, filtros);
    
    // 2. Generar estructura de reporte
    const estructuraReporte = this.generarEstructuraReporte(conjunto, filtros.fecha!, this.calcularFechaAnterior(filtros.fecha!));
    
    // 3. Procesar datos (lógica existente)
    await this.procesarDatosPeriodos(conjunto, usuario, filtros);
    
    // 4. Obtener datos del reporte
    const datosReporte = await this.obtenerDatosReporte(conjunto, usuario, filtros, page, pageSize);
    
    // 5. Calcular totales
    const totales = await this.calcularTotales(conjunto, usuario, filtros.tipoEgp!, filtros.fecha!, this.calcularFechaAnterior(filtros.fecha!));
    
    // 6. Validar balance
    const validacionBalance = await this.validarBalance(conjunto, usuario, filtros.tipoEgp!, filtros.fecha!, this.calcularFechaAnterior(filtros.fecha!));
    
    // 7. Formatear resultados
    const resultadosFormateados = this.formatearResultados([...estructuraReporte, ...datosReporte, ...totales]);
    
    // 8. Registrar ejecución
    const tiempoEjecucion = Date.now() - inicioEjecucion;
    await this.registrarEjecucion(conjunto, usuario, filtros.fecha!, this.calcularFechaAnterior(filtros.fecha!), resultadosFormateados.length, tiempoEjecucion);
    
    return resultadosFormateados;
    
  } catch (error) {
    console.error('Error al obtener estado de resultados:', error);
    throw new Error(`Error al obtener estado de resultados: ${error}`);
  }
}
```

## 5. Nuevas Interfaces Requeridas

```typescript
export interface EstadoResultadosMejorado extends EstadoResultados {
  variacion?: number;
  nivel?: number;
  esTotal?: boolean;
  esSubtotal?: boolean;
  esEncabezado?: boolean;
}

export interface ValidacionBalance {
  valido: boolean;
  mensaje: string;
  totalIngresos: number;
  totalEgresos: number;
  utilidad: number;
}

export interface LogEjecucion {
  usuario: string;
  reporte: string;
  fechaEjecucion: Date;
  periodoActual: string;
  periodoAnterior: string;
  registrosProcesados: number;
  tiempoEjecucion: number;
  estado: 'EXITOSO' | 'ERROR';
}
```

## 6. Cronograma de Implementación

### Fase 1 (Semana 1): Crítico
- [ ] Implementar cálculo de variación
- [ ] Agregar estructura de reporte
- [ ] Implementar cálculo de totales básicos

### Fase 2 (Semana 2): Calidad
- [ ] Implementar validaciones de balance
- [ ] Mejorar formato de números
- [ ] Implementar logging de auditoría

### Fase 3 (Semana 3): Presentación
- [ ] Implementar indentación jerárquica
- [ ] Mejorar formato de presentación
- [ ] Optimizar consultas

### Fase 4 (Semana 4): Testing
- [ ] Pruebas unitarias
- [ ] Pruebas de integración
- [ ] Pruebas de performance

## 7. Estimación de Esfuerzo

- **Desarrollo**: 3-4 semanas
- **Testing**: 1 semana
- **Total**: 4-5 semanas

## 8. Riesgos y Mitigaciones

### Riesgos:
1. **Performance**: Las consultas adicionales pueden afectar el rendimiento
2. **Complejidad**: El código se volverá más complejo
3. **Testing**: Más funcionalidades requieren más pruebas

### Mitigaciones:
1. **Optimización**: Usar índices y consultas optimizadas
2. **Modularización**: Separar en métodos más pequeños
3. **Cobertura**: Implementar pruebas automatizadas

## Conclusión

Esta propuesta de mejora permitirá que el `EstadoResultadosRepository.ts` cumpla completamente con el requerimiento CO003320-BASIC, proporcionando un reporte profesional, validado y con todas las funcionalidades requeridas.
