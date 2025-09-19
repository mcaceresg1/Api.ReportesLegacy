import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IReporteDocumentosProveedorService } from "../../domain/services/IReporteDocumentosProveedorService";

@injectable()
export class ReporteDocumentosProveedorController {
  constructor(
    @inject("IReporteDocumentosProveedorService")
    private readonly reporteService: IReporteDocumentosProveedorService
  ) {}

  /**
   * @swagger
   * /api/documentos-proveedor/proveedores/{conjunto}:
   *   get:
   *     summary: Obtiene una lista de proveedores de un conjunto específico con búsqueda dinámica optimizada.
   *     description: Este endpoint permite buscar proveedores de manera dinámica. Sin filtro retorna los primeros 50 proveedores activos. Con filtro busca hasta 100 proveedores que coincidan con el texto de búsqueda. La búsqueda se realiza tanto en el código como en el nombre del proveedor y los resultados se ordenan por relevancia.
   *     tags:
   *       - Tesorería y Caja - Lista Proveedor
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: "Nombre del esquema o base de datos (por ejemplo: ASFSAC)"
   *       - in: query
   *         name: filtro
   *         required: false
   *         schema:
   *           type: string
   *         description: "Texto de búsqueda para filtrar proveedores por nombre o código. Dejar vacío para obtener los primeros 50 proveedores activos."
   *         example: "PROV001"
   *     responses:
   *       200:
   *         description: "Lista de proveedores obtenida correctamente"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       proveedor:
   *                         type: string
   *                       nombre:
   *                         type: string
   *                       alias:
   *                         type: string
   *                       activo:
   *                         type: string
   *                       moneda:
   *                         type: string
   *                       saldo:
   *                         type: number
   *       400:
   *         description: "Parámetro 'conjunto' requerido"
   *       500:
   *         description: "Error interno del servidor"
   */

  async obtenerProveedor(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { filtro = "" } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro 'conjunto' es requerido",
        });
        return;
      }

      const proveedores = await this.reporteService.obtenerProveedor(
        conjunto,
        filtro.toString()
      );

      res.json({
        success: true,
        data: proveedores,
      });
    } catch (error) {
      console.error(
        "Error en ReporteDocumentosProveedorController.obtenerProveedor:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error al obtener proveedores",
      });
    }
  }

  /**
   * @swagger
   * /api/documentos-proveedor/reporte:
   *   get:
   *     summary: Obtiene el reporte de documentos de un proveedor entre un rango de fechas
   *     tags:
   *       - Tesoreria y Caja - Documentos Proveedor
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         schema:
   *           type: string
   *         required: true
   *         description: "Nombre del esquema o base de datos"
   *       - in: query
   *         name: proveedor
   *         schema:
   *           type: string
   *         required: false
   *         description: "Código del proveedor"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: "Fecha inicial (YYYY-MM-DD)"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         required: false
   *         description: "Fecha final (YYYY-MM-DD)"
   *     responses:
   *       200:
   *         description: "Reporte de documentos obtenido correctamente"
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   proveedor:
   *                     type: string
   *                   nombre:
   *                     type: string
   *                   fecha_vence:
   *                     type: string
   *                     format: date
   *                   tipo:
   *                     type: string
   *                   documento:
   *                     type: string
   *                   aplicacion:
   *                     type: string
   *                   moneda:
   *                     type: string
   *                   monto:
   *                     type: number
   *       400:
   *         description: "Parámetros incompletos"
   *       500:
   *         description: "Error interno del servidor"
   */

  async obtenerReporteDocumentosPorProveedor(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { conjunto, proveedor, fechaInicio, fechaFin } = req.query;

      if (!conjunto || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message:
            "Parámetros incompletos. Se requieren conjunto, fechaInicio y fechaFin.",
        });
        return;
      }

      // Convertir proveedor vacío a null
      const proveedorParam =
        (proveedor as string)?.trim() === "" ? null : (proveedor as string);

      const reporte =
        await this.reporteService.obtenerReporteDocumentosPorProveedor(
          conjunto as string,
          proveedorParam,
          fechaInicio as string,
          fechaFin as string
        );

      res.json({
        success: true,
        data: reporte,
      });
    } catch (error) {
      console.error(
        "Error en ReporteDocumentosProveedorController.obtenerReporteDocumentosPorProveedor:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
      });
    }
  }

  /**
   * @swagger
   * /api/documentos-proveedor/documentosPorPagar:
   *   get:
   *     summary: Obtiene documentos por pagar con filtros de fechas y/o proveedor
   *     description: |
   *       Este endpoint permite obtener documentos por pagar con dos tipos de filtros:
   *
   *       **Caso 1 - Solo por fechas (todos los proveedores):**
   *       - Proporcionar solo: conjunto, fechaInicio, fechaFin
   *       - Ejemplo: `/api/documentos-proveedor/documentosPorPagar?conjunto=ASFSAC&fechaInicio=2022-01-01&fechaFin=2022-12-31`
   *
   *       **Caso 2 - Por fechas y proveedor específico:**
   *       - Proporcionar: conjunto, proveedor, fechaInicio, fechaFin
   *       - Ejemplo: `/api/documentos-proveedor/documentosPorPagar?conjunto=ASFSAC&proveedor=10094374982&fechaInicio=2022-01-01&fechaFin=2022-12-31`
   *
   *       El sistema automáticamente detecta qué tipo de consulta realizar según los parámetros proporcionados.
   *     tags:
   *       - Tesoreria y Caja - Detalle Movimientos por Pagar
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         schema:
   *           type: string
   *         required: true
   *         description: "Nombre del esquema o base de datos (ej: ASFSAC)"
   *         example: "ASFSAC"
   *       - in: query
   *         name: proveedor
   *         schema:
   *           type: string
   *         required: false
   *         description: |
   *           Código del proveedor específico.
   *           - Si se proporciona: filtra solo documentos de ese proveedor
   *           - Si se omite o está vacío: incluye todos los proveedores
   *         example: "10094374982"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: "Fecha inicial del rango (YYYY-MM-DD)"
   *         example: "2022-01-01"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: "Fecha final del rango (YYYY-MM-DD)"
   *         example: "2022-12-31"
   *     responses:
   *       200:
   *         description: |
   *           Reporte de documentos por pagar obtenido correctamente.
   *
   *           **Estructura de respuesta:**
   *           - Array de documentos con información detallada
   *           - Cada documento incluye datos del proveedor, fechas, montos y tipos de documento
   *           - Los montos se calculan según el tipo de documento (debe/haber en soles y dólares)
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
   *                     type: object
   *                     properties:
   *                       CONTRIBUYENTE:
   *                         type: string
   *                         description: "RUC o código del contribuyente"
   *                         example: "10094374982"
   *                       NOMBRE:
   *                         type: string
   *                         description: "Nombre del proveedor"
   *                         example: "VALENCIA GONZALES AGRIPINA SATURNINA"
   *                       FECHA_DOCUMENTO:
   *                         type: string
   *                         format: date
   *                         description: "Fecha del documento"
   *                         example: "2022-06-21T00:00:00.000Z"
   *                       DOCUMENTO:
   *                         type: string
   *                         description: "Número del documento"
   *                         example: "00001-72"
   *                       TIPO:
   *                         type: string
   *                         description: "Tipo de documento (B/V, CHQ, CNJ, etc.)"
   *                         example: "B/V"
   *                       APLICACION:
   *                         type: string
   *                         description: "Descripción o glosa del documento"
   *                         example: "DECORACION CAPILLA ANIV LURIN"
   *                       FECHA:
   *                         type: string
   *                         format: date
   *                         description: "Fecha contable"
   *                         example: "2022-07-01T00:00:00.000Z"
   *                       ASIENTO:
   *                         type: string
   *                         description: "Número de asiento contable"
   *                         example: "0900022443"
   *                       DEBE_LOC:
   *                         type: number
   *                         description: "Monto debe en moneda local (soles)"
   *                         example: 0
   *                       HABER_LOC:
   *                         type: number
   *                         description: "Monto haber en moneda local (soles)"
   *                         example: 1670
   *                       DEBE_DOL:
   *                         type: number
   *                         description: "Monto debe en dólares"
   *                         example: 0
   *                       HABER_DOL:
   *                         type: number
   *                         description: "Monto haber en dólares"
   *                         example: 435.01
   *                       MONEDA:
   *                         type: string
   *                         description: "Moneda del documento"
   *                         example: "SOL"
   *             examples:
   *               todos_proveedores:
   *                 summary: "Respuesta para consulta solo por fechas"
   *                 value:
   *                   success: true
   *                   data:
   *                     - CONTRIBUYENTE: "10094374982"
   *                       NOMBRE: "VALENCIA GONZALES AGRIPINA SATURNINA"
   *                       FECHA_DOCUMENTO: "2022-06-21T00:00:00.000Z"
   *                       DOCUMENTO: "00001-72"
   *                       TIPO: "B/V"
   *                       APLICACION: "DECORACION CAPILLA ANIV LURIN"
   *                       FECHA: "2022-07-01T00:00:00.000Z"
   *                       ASIENTO: "0900022443"
   *                       DEBE_LOC: 0
   *                       HABER_LOC: 1670
   *                       DEBE_DOL: 0
   *                       HABER_DOL: 435.01
   *                       MONEDA: "SOL"
   *               proveedor_especifico:
   *                 summary: "Respuesta para consulta por fechas y proveedor"
   *                 value:
   *                   success: true
   *                   data:
   *                     - CONTRIBUYENTE: "10094374982"
   *                       NOMBRE: "VALENCIA GONZALES AGRIPINA SATURNINA"
   *                       FECHA_DOCUMENTO: "2022-04-08T00:00:00.000Z"
   *                       DOCUMENTO: "0001-43"
   *                       TIPO: "B/V"
   *                       APLICACION: "FLORES PARA EL ALTAR (LURIN)"
   *                       FECHA: "2022-04-08T00:00:00.000Z"
   *                       ASIENTO: "0900019535"
   *                       DEBE_LOC: 0
   *                       HABER_LOC: 990
   *                       DEBE_DOL: 0
   *                       HABER_DOL: 266.06
   *                       MONEDA: "SOL"
   *       400:
   *         description: |
   *           Error de parámetros. Posibles causas:
   *           - Parámetro 'conjunto' requerido
   *           - Fechas inválidas o en formato incorrecto
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Parámetros incompletos. Se requieren conjunto"
   *       500:
   *         description: |
   *           Error interno del servidor. Posibles causas:
   *           - Error de conexión a la base de datos
   *           - Error en la consulta SQL
   *           - Error de procesamiento de datos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Error interno del servidor."
   */

  async obtenerReporteDocumentosPorPagar(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { conjunto, proveedor, fechaInicio, fechaFin } = req.query;

      console.log("🔍 [Backend] Parámetros recibidos en documentosPorPagar:", {
        conjunto,
        proveedor,
        fechaInicio,
        fechaFin,
      });
      console.log("🔍 [Backend] Tipo de proveedor:", typeof proveedor);
      console.log(
        "🔍 [Backend] Proveedor es undefined?",
        proveedor === undefined
      );
      console.log("🔍 [Backend] Proveedor es null?", proveedor === null);
      console.log("🔍 [Backend] Proveedor es string vacío?", proveedor === "");

      if (!conjunto) {
        console.log("❌ [Backend] Error: conjunto no proporcionado");
        res.status(400).json({
          success: false,
          message: "Parámetros incompletos. Se requieren conjunto",
        });
        return;
      }

      console.log("📡 [Backend] Llamando al servicio con parámetros:", {
        conjunto: conjunto as string,
        proveedor: proveedor as string,
        fechaInicio: fechaInicio as string,
        fechaFin: fechaFin as string,
      });

      // Decidir qué método usar según si hay proveedor o no
      let reporte;
      const proveedorStr = proveedor as string;
      const tieneProveedor = proveedorStr && proveedorStr.trim() !== "";

      if (tieneProveedor) {
        console.log(
          "🔍 [Backend] Usando método: obtenerReporteDocumentosPorPagarPorFechasYProveedor"
        );
        reporte =
          await this.reporteService.obtenerReporteDocumentosPorPagarPorFechasYProveedor(
            conjunto as string,
            proveedorStr,
            fechaInicio as string,
            fechaFin as string
          );
      } else {
        console.log(
          "🔍 [Backend] Usando método: obtenerReporteDocumentosPorPagarPorFechas"
        );
        reporte =
          await this.reporteService.obtenerReporteDocumentosPorPagarPorFechas(
            conjunto as string,
            fechaInicio as string,
            fechaFin as string
          );
      }

      console.log("📊 [Backend] Reporte obtenido del servicio:", {
        cantidad: reporte?.length || 0,
        primerosElementos: reporte?.slice(0, 2) || [],
      });

      res.json({
        success: true,
        data: reporte,
      });
    } catch (error) {
      console.error(
        "❌ [Backend] Error en ReporteDocumentosProveedorController.obtenerReporteDocumentosPorPagar:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
      });
    }
  }

  /**
   * @swagger
   * /api/documentos-proveedor/obtenerdocumentos:
   *   get:
   *     summary: Obtiene todos los documentos de proveedores con filtro de fechas
   *     tags:
   *       - Tesoreria y Caja - Documentos Proveedor
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         schema:
   *           type: string
   *         required: true
   *         description: "Nombre del esquema o base de datos"
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: "Fecha inicial (YYYY-MM-DD)"
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         required: true
   *         description: "Fecha final (YYYY-MM-DD)"
   *     responses:
   *       200:
   *         description: "Documentos obtenidos correctamente"
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       proveedor:
   *                         type: string
   *                       nombre:
   *                         type: string
   *                       fecha_vence:
   *                         type: string
   *                         format: date
   *                       tipo:
   *                         type: string
   *                       documento:
   *                         type: string
   *                       aplicacion:
   *                         type: string
   *                       moneda:
   *                         type: string
   *                       monto:
   *                         type: number
   *       400:
   *         description: "Parámetros incompletos"
   *       500:
   *         description: "Error interno del servidor"
   */
  async obtenerDocumentos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, fechaInicio, fechaFin } = req.query;

      console.log("🔍 [Backend] Parámetros recibidos en obtenerDocumentos:", {
        conjunto,
        fechaInicio,
        fechaFin,
      });

      if (!conjunto || !fechaInicio || !fechaFin) {
        console.log("❌ [Backend] Error: parámetros incompletos");
        res.status(400).json({
          success: false,
          message:
            "Parámetros incompletos. Se requieren conjunto, fechaInicio y fechaFin.",
        });
        return;
      }

      console.log(
        "📡 [Backend] Llamando al servicio obtenerDocumentos con parámetros:",
        {
          conjunto: conjunto as string,
          fechaInicio: fechaInicio as string,
          fechaFin: fechaFin as string,
        }
      );

      const documentos = await this.reporteService.obtenerDocumentos(
        conjunto as string,
        fechaInicio as string,
        fechaFin as string
      );

      console.log("📊 [Backend] Documentos obtenidos del servicio:", {
        cantidad: documentos?.length || 0,
        primerosElementos: documentos?.slice(0, 2) || [],
      });

      res.json({
        success: true,
        data: documentos,
      });
    } catch (error) {
      console.error(
        "❌ [Backend] Error en ReporteDocumentosProveedorController.obtenerDocumentos:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
      });
    }
  }
}
