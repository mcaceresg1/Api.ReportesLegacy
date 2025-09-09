"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceComprobacionClipperController = void 0;
var inversify_1 = require("inversify");
var ObtenerBalanceComprobacionClipperQuery_1 = require("../../application/queries/balance-comprobacion-clipper/ObtenerBalanceComprobacionClipperQuery");
/**
 * Controller para Balance de Comprobación Clipper
 * Maneja las peticiones HTTP relacionadas con el balance de comprobación desde Clipper
 */
var BalanceComprobacionClipperController = /** @class */ (function () {
    function BalanceComprobacionClipperController(queryBus) {
        this.queryBus = queryBus;
    }
    /**
     * Obtiene el balance de comprobación desde Clipper
     * GET /api/balance-comprobacion-clipper?bdClipperGPC=bdclipperGPC
     */
    BalanceComprobacionClipperController.prototype.obtenerBalanceComprobacionClipper = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var bdClipperGPC, query, resultado, response, error_1, errorResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("BalanceComprobacionClipperController.obtenerBalanceComprobacionClipper - Iniciando");
                        bdClipperGPC = req.query.bdClipperGPC;
                        // Validar parámetros requeridos
                        if (!bdClipperGPC || typeof bdClipperGPC !== "string") {
                            res.status(400).json({
                                success: false,
                                message: "El parámetro 'bdClipperGPC' es obligatorio",
                                error: "Parámetro requerido faltante",
                            });
                            return [2 /*return*/];
                        }
                        query = new ObtenerBalanceComprobacionClipperQuery_1.ObtenerBalanceComprobacionClipperQuery(bdClipperGPC);
                        return [4 /*yield*/, this.queryBus.execute(query)];
                    case 1:
                        resultado = _a.sent();
                        response = {
                            success: true,
                            message: "Balance de comprobación clipper obtenido exitosamente",
                            data: resultado,
                            total: resultado.length,
                            timestamp: new Date().toISOString(),
                        };
                        console.log("BalanceComprobacionClipperController.obtenerBalanceComprobacionClipper - Completado: ".concat(resultado.length, " registros"));
                        res.status(200).json(response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error en BalanceComprobacionClipperController.obtenerBalanceComprobacionClipper:", error_1);
                        errorResponse = {
                            success: false,
                            message: "Error al obtener balance de comprobación clipper",
                            error: error_1 instanceof Error ? error_1.message : "Error desconocido",
                            timestamp: new Date().toISOString(),
                        };
                        res.status(500).json(errorResponse);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtiene información sobre el endpoint
     * GET /api/balance-comprobacion-clipper/info
     */
    BalanceComprobacionClipperController.prototype.obtenerInfo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_a) {
                try {
                    info = {
                        endpoint: "Balance de Comprobación Clipper",
                        description: "Obtiene los datos del balance de comprobación desde la base de datos Clipper",
                        version: "1.0.0",
                        methods: {
                            GET: {
                                "/?bdClipperGPC=bdclipperGPC": "Obtiene todos los registros del balance de comprobación clipper",
                                "/info": "Obtiene información sobre este endpoint",
                            },
                        },
                        parameters: {
                            bdClipperGPC: "string - Nombre de la base de datos Clipper GPC (requerido). Valores disponibles: bdclipperGPC, bdclipperGPC1",
                        },
                        dataStructure: {
                            cuenta: "string - Código de la cuenta contable",
                            nombre: "string - Nombre de la cuenta contable",
                            saldoAcumuladoDebe: "number - Saldo acumulado en debe (enero a noviembre)",
                            saldoAcumuladoHaber: "number - Saldo acumulado en haber (enero a noviembre)",
                            movimientoMesDebe: "number - Movimiento del mes en debe (diciembre)",
                            movimientoMesHaber: "number - Movimiento del mes en haber (diciembre)",
                            saldoActualDebe: "number - Saldo actual en debe (enero a diciembre)",
                            saldoActualHaber: "number - Saldo actual en haber (enero a diciembre)",
                        },
                        timestamp: new Date().toISOString(),
                    };
                    res.status(200).json({
                        success: true,
                        data: info,
                    });
                }
                catch (error) {
                    console.error("Error en BalanceComprobacionClipperController.obtenerInfo:", error);
                    res.status(500).json({
                        success: false,
                        message: "Error al obtener información del endpoint",
                        error: error instanceof Error ? error.message : "Error desconocido",
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    BalanceComprobacionClipperController = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)("IQueryBus")),
        __metadata("design:paramtypes", [Object])
    ], BalanceComprobacionClipperController);
    return BalanceComprobacionClipperController;
}());
exports.BalanceComprobacionClipperController = BalanceComprobacionClipperController;
