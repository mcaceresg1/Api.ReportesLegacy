"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerBalanceComprobacionClipperQuery = void 0;
var uuid_1 = require("uuid");
/**
 * Query para obtener el Balance de Comprobación desde Clipper
 * Implementa el patrón CQRS para operaciones de lectura
 */
var ObtenerBalanceComprobacionClipperQuery = /** @class */ (function () {
    function ObtenerBalanceComprobacionClipperQuery(bdClipperGPC) {
        this.bdClipperGPC = bdClipperGPC;
        this.queryId = (0, uuid_1.v4)();
        this.timestamp = new Date();
        // Requiere el nombre de la base de datos Clipper GPC
    }
    return ObtenerBalanceComprobacionClipperQuery;
}());
exports.ObtenerBalanceComprobacionClipperQuery = ObtenerBalanceComprobacionClipperQuery;
