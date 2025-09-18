import { Request, Response } from "express";
import { ReporteClipperService } from "../../application/services/ReporteCliperService";
import { inject, injectable } from "inversify";
import { IReporteClipperService } from "../../domain/services/IReporteClipperService";

/**
 * @swagger
 * components:
 *   schemas:
 *     ContratoClipper:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         cliente:
 *           type: string
 *         servicio:
 *           type: string
 *         monto:
 *           type: number
 *         fecha:
 *           type: string
 *           format: date
 */
@injectable()
export class ClipperController {
  constructor(
    @inject("IReporteClipperService")
    private readonly clipperService: IReporteClipperService
  ) {}

  /**
   * @swagger
   * /api/reporte-clipper/{ruta}/contratos:
   *   get:
   *     summary: Obtener contratos por sede
   *     description: Retorna contratos para la sede indicada (clipper-lurin, clipper-tacna, clipper-lima)
   *     tags: [Clipper - Lista contratos]
   *     parameters:
   *       - in: path
   *         name: ruta
   *         required: true
   *         schema:
   *           type: string
   *           enum: [clipper-lurin, clipper-tacna, clipper-lima]
   *         description: Ruta de la sede
   *     responses:
   *       200:
   *         description: Contratos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ContratoClipper'
   *                 message:
   *                   type: string
   *                   example: Consulta exitosa
   *       400:
   *         description: Ruta inválida
   *       500:
   *         description: Error interno del servidor
   */

  async obtenerContratos(req: Request, res: Response): Promise<void> {
    try {
      const ruta = req.params["ruta"];
      console.log(ruta);
      const rutasValidas = ["clipper-lurin", "clipper-tacna", "clipper-lima"];

      if (
        !ruta ||
        !["clipper-lurin", "clipper-tacna", "clipper-lima"].includes(ruta)
      ) {
        res.status(400).json({
          success: false,
          message: "Ruta no válida",
          data: [],
        });
        return;
      }

      const data = await this.clipperService.obtenerContratos(ruta);

      res.json({
        success: true,
        message: "Consulta exitosa",
        data,
      });
    } catch (error) {
      console.error("❌ Error en ClipperController.obtenerContratos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Error desconocido",
        data: [],
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-clipper/{ruta}/contratos-paginados:
   *   get:
   *     summary: Obtener contratos paginados por sede
   *     description: Retorna contratos paginados para la sede indicada con filtros y ordenamiento
   *     tags: [Clipper - Lista contratos]
   *     parameters:
   *       - in: path
   *         name: ruta
   *         required: true
   *         schema:
   *           type: string
   *           enum: [clipper-lurin, clipper-tacna, clipper-lima]
   *         description: Ruta de la sede
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 0
   *           default: 0
   *         description: Número de página (base 0)
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *           default: 20
   *         description: Límite de registros por página
   *       - in: query
   *         name: sortField
   *         required: false
   *         schema:
   *           type: string
   *         description: Campo para ordenar
   *       - in: query
   *         name: sortOrder
   *         required: false
   *         schema:
   *           type: integer
   *           enum: [1, -1]
   *           default: 1
   *         description: Orden (1 ascendente, -1 descendente)
   *       - in: query
   *         name: globalFilter
   *         required: false
   *         schema:
   *           type: string
   *         description: Filtro global de búsqueda
   *     responses:
   *       200:
   *         description: Contratos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/ContratoClipper'
   *                     totalRecords:
   *                       type: integer
   *                       example: 3000
   *                     page:
   *                       type: integer
   *                       example: 0
   *                     limit:
   *                       type: integer
   *                       example: 20
   *                 message:
   *                   type: string
   *                   example: Consulta exitosa
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerContratosPaginados(req: Request, res: Response): Promise<void> {
    try {
      const ruta = req.params["ruta"];
      const page = parseInt(req.query["page"] as string) || 0;
      const limit = Math.min(
        parseInt(req.query["limit"] as string) || 20,
        1000
      ); // Máximo 1000 registros
      const sortField = req.query["sortField"] as string;
      const sortOrder = parseInt(req.query["sortOrder"] as string) || 1;
      const globalFilter = req.query["globalFilter"] as string;

      const rutasValidas = ["clipper-lurin", "clipper-tacna", "clipper-lima"];

      if (!ruta || !rutasValidas.includes(ruta)) {
        res.status(400).json({
          success: false,
          message: "Ruta no válida",
          data: {
            data: [],
            totalRecords: 0,
            page: 0,
            limit: 0,
          },
        });
        return;
      }

      if (page < 0) {
        res.status(400).json({
          success: false,
          message: "La página debe ser mayor o igual a 0",
          data: {
            data: [],
            totalRecords: 0,
            page: 0,
            limit: 0,
          },
        });
        return;
      }

      if (limit < 1 || limit > 1000) {
        res.status(400).json({
          success: false,
          message: "El límite debe estar entre 1 y 1000",
          data: {
            data: [],
            totalRecords: 0,
            page: 0,
            limit: 0,
          },
        });
        return;
      }

      const result = await this.clipperService.obtenerContratosPaginados(
        ruta,
        page,
        limit,
        sortField,
        sortOrder,
        globalFilter
      );

      res.json({
        success: true,
        message: "Consulta exitosa",
        data: result,
      });
    } catch (error) {
      console.error(
        "❌ Error en ClipperController.obtenerContratosPaginados:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Error desconocido",
        data: {
          data: [],
          totalRecords: 0,
          page: 0,
          limit: 0,
        },
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-clipper/{ruta}/contratos/{contrato}/{control}:
   *   get:
   *     summary: Obtener contrato por ID y control
   *     description: Retorna el detalle completo de un contrato (cabecera, artículos, cuenta corriente, pagos, notas, comisiones, facturas/boletas y sepelios).
   *     tags: [Clipper - Contrato Detallado]
   *     parameters:
   *       - in: path
   *         name: ruta
   *         required: true
   *         schema:
   *           type: string
   *           enum: [clipper-lurin, clipper-tacna, clipper-lima]
   *         description: Ruta de la base de datos
   *       - in: path
   *         name: contrato
   *         required: true
   *         schema:
   *           type: string
   *         description: Número de contrato
   *       - in: path
   *         name: control
   *         required: false
   *         schema:
   *           type: string
   *         description: Número de control
   *     responses:
   *       200:
   *         description: Contrato encontrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Consulta exitosa
   *                 data:
   *                   $ref: '#/components/schemas/ClipperContratoDetalle'
   *       400:
   *         description: Parámetros inválidos
   *       404:
   *         description: Contrato no encontrado
   *       500:
   *         description: Error interno del servidor
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     ClipperContratoDetalle:
   *       type: object
   *       properties:
   *         cabecera:
   *           $ref: '#/components/schemas/CabeceraContrato'
   *         detalleArticulo:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/DetalleArticulo'
   *         cuentaCorriente:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/CuentaCorriente'
   *         notasContables:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/NotaContable'
   *         pagos:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Pago'
   *         comisiones:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Comision'
   *         factbol:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Factbol'
   *         sepelios:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Sepelio'
   *
   *     CabeceraContrato:
   *       type: object
   *       properties:
   *         contratoControl:
   *           type: string
   *           example: "1065/666"
   *         tipo:
   *           type: string
   *           example: "Venta"
   *         sector:
   *           type: string
   *           example: "Sector A 123"
   *         cliente:
   *           type: string
   *           example: "12345 Pérez Juan"
   *         consejero:
   *           type: string
   *           example: "67890 López María"
   *         venta:
   *           type: string
   *           format: date
   *         precio:
   *           type: number
   *           example: 15000.50
   *         gasto:
   *           type: number
   *           example: 250.00
   *         total:
   *           type: number
   *           example: 15250.50
   *         escogido:
   *           type: string
   *           example: "S"
   *         letras:
   *           type: number
   *           example: 12
   *         producto:
   *           type: string
   *           example: "Plan Familiar"
   *         anulado:
   *           type: string
   *           nullable: true
   *
   *     DetalleArticulo:
   *       type: object
   *       properties:
   *         articulo:
   *           type: string
   *           example: "A001"
   *         desArticulo:
   *           type: string
   *           example: "Espacio Premium"
   *         valorVenta:
   *           type: number
   *           example: 12000.00
   *         fondo:
   *           type: string
   *           example: ""
   *         canon:
   *           type: number
   *           example: 200.00
   *         igv:
   *           type: number
   *           example: 2160.00
   *         precNeto:
   *           type: number
   *           example: 14160.00
   *
   *     CuentaCorriente:
   *       type: object
   *       properties:
   *         tipoDescripcion:
   *           type: string
   *           example: "Letra"
   *         numLetra:
   *           type: string
   *           example: "001"
   *         numSec:
   *           type: string
   *           example: "01"
   *         fecha:
   *           type: string
   *           format: date
   *         monto:
   *           type: number
   *           example: 1200.00
   *         saldo:
   *           type: number
   *           example: 600.00
   *         estado:
   *           type: string
   *           example: "CANCELADO"
   *
   *     NotaContable:
   *       type: object
   *       properties:
   *         tipo:
   *           type: string
   *           example: "NC"
   *         numero:
   *           type: string
   *           example: "NC-2024-01"
   *         fecha:
   *           type: string
   *           format: date
   *         descripcion:
   *           type: string
   *           example: "Ajuste contable"
   *         importe:
   *           type: number
   *           example: 500.00
   *         igv:
   *           type: number
   *           example: 90.00
   *         canon:
   *           type: number
   *           example: 50.00
   *
   *     Pago:
   *       type: object
   *       properties:
   *         tipoDescrip:
   *           type: string
   *           example: "Letra"
   *         numeroLetra:
   *           type: string
   *           example: "001"
   *         secuencia:
   *           type: string
   *           example: "01"
   *         vencePago:
   *           type: string
   *           example: "2024-01-10 => 2024-01-05"
   *         monto:
   *           type: number
   *           example: 1200.00
   *         canon:
   *           type: number
   *           example: 200.00
   *         recibo:
   *           type: string
   *           example: "RC-2024-15"
   *
   *     Comision:
   *       type: object
   *       properties:
   *         codVendedor:
   *           type: string
   *           example: "V001"
   *         nomVendedor:
   *           type: string
   *           example: "López María"
   *         parte:
   *           type: string
   *           example: "1/3"
   *         fechaComision:
   *           type: string
   *           format: date
   *         comision:
   *           type: number
   *           example: 500.00
   *         estadoComision:
   *           type: string
   *           example: "PAGADO"
   *
   *     Factbol:
   *       type: object
   *       properties:
   *         tipoFacBol:
   *           type: string
   *           example: "Factura"
   *         numFacBol:
   *           type: string
   *           example: "F001-12345"
   *         fechaDoc:
   *           type: string
   *           format: date
   *         monedaFacBol:
   *           type: string
   *           example: "PEN"
   *         servicioFacBol:
   *           type: string
   *           example: "Sepelio"
   *         espacioFacBol:
   *           type: string
   *           example: "Espacio 123"
   *         fondoFacBol:
   *           type: string
   *           example: "Fondo 1"
   *         igvFacBol:
   *           type: number
   *           example: 1800.00
   *         canonFacBol:
   *           type: number
   *           example: 300.00
   *         tipocamFacBol:
   *           type: number
   *           example: 3.75
   *
   *     Sepelio:
   *       type: object
   *       properties:
   *         ordenSepelio:
   *           type: string
   *           example: "SP-2024-01"
   *         nivelSepelio:
   *           type: string
   *           example: "Nivel 2"
   *         nomSepelio:
   *           type: string
   *           example: "García Pedro"
   *         fallecidoSepelio:
   *           type: string
   *           format: date
   *         entierrosEPELIO:
   *           type: string
   *           format: date
   *         documentoSepelio:
   *           type: string
   *           example: "DNI 12345678"
   */

  async obtenerContratoPorId(req: Request, res: Response): Promise<void> {
    try {
      const ruta = req.params["ruta"];
      const contrato = req.params["contrato"];
      const control: string | null = req.params["control"] ?? null;

      if (
        !ruta ||
        !["clipper-lurin", "clipper-tacna", "clipper-lima"].includes(ruta)
      ) {
        res.status(400).json({
          success: false,
          message: "Ruta no válida",
          data: null,
        });
        return;
      }

      if (!contrato) {
        res.status(400).json({
          success: false,
          message: 'Parámetro "contrato" es requerido',
          data: null,
        });
        return;
      }

      const data = await this.clipperService.obtenerContratoPorId(
        ruta,
        contrato,
        control
      );

      if (!data) {
        res.status(404).json({
          success: false,
          message: "Contrato no encontrado",
          data: null,
        });
        return;
      }

      res.json({
        success: true,
        message: "Consulta exitosa",
        data,
      });
    } catch (error) {
      console.error(
        "❌ Error en ClipperController.obtenerContratoPorId:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno",
        error: error instanceof Error ? error.message : "Error desconocido",
        data: null,
      });
    }
  }
}
