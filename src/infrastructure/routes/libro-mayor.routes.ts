import { Router } from "express";
import { container } from "../container/container";
import { LibroMayorController } from "../controllers/LibroMayorController";

const router = Router();
const libroMayorController =
  container.get<LibroMayorController>("LibroMayorController");

/**
 * @swagger
 * components:
 *   schemas:
 *     LibroMayor:
 *       type: object
 *       properties:
 *         centro_costo:
 *           type: string
 *           description: Centro de costo
 *           example: "001"
 *         cuenta_contable:
 *           type: string
 *           description: Cuenta contable
 *           example: "01.1.1.1.004"
 *         descripcion_cuenta:
 *           type: string
 *           description: Descripción de la cuenta contable
 *           example: "Caja General"
 *         saldo_fisc_local:
 *           type: number
 *           description: Saldo fiscal en moneda local
 *           example: 1000.00
 *         saldo_fisc_dolar:
 *           type: number
 *           description: Saldo fiscal en dólares
 *           example: 1000.00
 *         saldo_corp_local:
 *           type: number
 *           description: Saldo corporativo en moneda local
 *           example: 1000.00
 *         saldo_corp_dolar:
 *           type: number
 *           description: Saldo corporativo en dólares
 *           example: 1000.00
 *         saldo_fisc_und:
 *           type: number
 *           description: Saldo fiscal en unidades
 *           example: 100.00
 *         saldo_corp_und:
 *           type: number
 *           description: Saldo corporativo en unidades
 *           example: 100.00
 *         debito_fisc_local:
 *           type: number
 *           description: Débito fiscal en moneda local
 *           example: 500.00
 *         credito_fisc_local:
 *           type: number
 *           description: Crédito fiscal en moneda local
 *           example: 300.00
 *         debito_fisc_dolar:
 *           type: number
 *           description: Débito fiscal en dólares
 *           example: 500.00
 *         credito_fisc_dolar:
 *           type: number
 *           description: Crédito fiscal en dólares
 *           example: 300.00
 *         debito_corp_local:
 *           type: number
 *           description: Débito corporativo en moneda local
 *           example: 500.00
 *         credito_corp_local:
 *           type: number
 *           description: Crédito corporativo en moneda local
 *           example: 300.00
 *         debito_corp_dolar:
 *           type: number
 *           description: Débito corporativo en dólares
 *           example: 500.00
 *         credito_corp_dolar:
 *           type: number
 *           description: Crédito corporativo en dólares
 *           example: 300.00
 *         debito_fisc_und:
 *           type: number
 *           description: Débito fiscal en unidades
 *           example: 50.00
 *         credito_fisc_und:
 *           type: number
 *           description: Crédito fiscal en unidades
 *           example: 30.00
 *         debito_corp_und:
 *           type: number
 *           description: Débito corporativo en unidades
 *           example: 50.00
 *         credito_corp_und:
 *           type: number
 *           description: Crédito corporativo en unidades
 *           example: 30.00
 *     CuentaContableInfo:
 *       type: object
 *       properties:
 *         cuenta_contable:
 *           type: string
 *           description: Código de la cuenta contable
 *           example: "01.1.1.1.004"
 *         descripcion:
 *           type: string
 *           description: Descripción de la cuenta contable
 *           example: "Caja General"
 *         descripcion_ifrs:
 *           type: string
 *           description: Descripción IFRS
 *           example: "Cash and Cash Equivalents"
 *         tipo:
 *           type: string
 *           description: Tipo de cuenta
 *           example: "A"
 *         tipo_detallado:
 *           type: string
 *           description: Tipo detallado
 *           example: "ACTIVO"
 *         conversion:
 *           type: string
 *           description: Conversión
 *           example: "S"
 *         saldo_normal:
 *           type: string
 *           description: Saldo normal
 *           example: "D"
 *         tipo_cambio:
 *           type: string
 *           description: Tipo de cambio
 *           example: "S"
 *         acepta_datos:
 *           type: string
 *           description: Acepta datos
 *           example: "S"
 *         tipo_oaf:
 *           type: string
 *           description: Tipo OAF
 *           example: "N"
 *         consolida:
 *           type: string
 *           description: Consolida
 *           example: "S"
 *         usa_centro_costo:
 *           type: string
 *           description: Usa centro de costo
 *           example: "S"
 *         usuario:
 *           type: string
 *           description: Usuario
 *           example: "ADMIN"
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora
 *           example: "2024-01-01T00:00:00Z"
 *         usuario_ult_mod:
 *           type: string
 *           description: Usuario última modificación
 *           example: "ADMIN"
 *         fch_hora_ult_mod:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora última modificación
 *           example: "2024-01-01T00:00:00Z"
 *         notas:
 *           type: string
 *           description: Notas
 *           example: "Cuenta principal de caja"
 *         acepta_unidades:
 *           type: string
 *           description: Acepta unidades
 *           example: "N"
 *         unidad:
 *           type: string
 *           description: Unidad
 *           example: ""
 *         uso_restringido:
 *           type: string
 *           description: Uso restringido
 *           example: "N"
 *         seccion_cuenta:
 *           type: string
 *           description: Sección de cuenta
 *           example: "1"
 *         origen_conversion:
 *           type: string
 *           description: Origen conversión
 *           example: "M"
 *         valida_presup_cr:
 *           type: string
 *           description: Valida presupuesto CR
 *           example: "N"
 *         cuenta_ifrs:
 *           type: string
 *           description: Cuenta IFRS
 *           example: "1001"
 *         usa_conta_electro:
 *           type: string
 *           description: Usa contabilidad electrónica
 *           example: "N"
 *         version:
 *           type: string
 *           description: Versión
 *           example: "1"
 *         fecha_ini_ce:
 *           type: string
 *           format: date
 *           description: Fecha inicio contabilidad electrónica
 *           example: "2024-01-01"
 *         fecha_fin_ce:
 *           type: string
 *           format: date
 *           description: Fecha fin contabilidad electrónica
 *           example: "2024-12-31"
 *         cod_agrupador:
 *           type: string
 *           description: Código agrupador
 *           example: "AG001"
 *         desc_cod_agrup:
 *           type: string
 *           description: Descripción código agrupador
 *           example: "Agrupador Principal"
 *         sub_cta_de:
 *           type: string
 *           description: Sub cuenta de
 *           example: ""
 *         desc_sub_cta:
 *           type: string
 *           description: Descripción sub cuenta
 *           example: ""
 *         nivel:
 *           type: integer
 *           description: Nivel
 *           example: 1
 *         maneja_tercero:
 *           type: string
 *           description: Maneja tercero
 *           example: "N"
 *         RowPointer:
 *           type: string
 *           description: Row Pointer
 *           example: "12345678-1234-1234-1234-123456789012"
 *     PeriodoContableInfo:
 *       type: object
 *       properties:
 *         fecha_final:
 *           type: string
 *           format: date
 *           description: Fecha final del período
 *           example: "2024-01-31"
 *         descripcion:
 *           type: string
 *           description: Descripción del período
 *           example: "Enero 2024"
 */

// Health check
router.get(
  "/health",
  libroMayorController.health.bind(libroMayorController)
);

// Obtener cuentas contables
router.get(
  "/:conjunto/cuentas-contables",
  libroMayorController.obtenerCuentasContables.bind(libroMayorController)
);

// Obtener períodos contables
router.get(
  "/:conjunto/periodos-contables",
  libroMayorController.obtenerPeriodosContables.bind(libroMayorController)
);

// Generar reporte
router.get(
  "/:conjunto/generar",
  libroMayorController.generarReporte.bind(libroMayorController)
);

// Obtener datos paginados
router.get(
  "/:conjunto/obtener",
  libroMayorController.obtenerLibroMayor.bind(libroMayorController)
);

// Exportar a Excel
router.get(
  "/:conjunto/exportar-excel",
  libroMayorController.exportarExcel.bind(libroMayorController)
);

// Exportar a PDF
router.get(
  "/:conjunto/exportar-pdf",
  libroMayorController.exportarPDF.bind(libroMayorController)
);

export default router;
