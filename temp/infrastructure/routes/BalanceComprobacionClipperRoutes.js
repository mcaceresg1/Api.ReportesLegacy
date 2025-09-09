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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceComprobacionClipperRoutes = void 0;
var inversify_1 = require("inversify");
var express_1 = require("express");
var BalanceComprobacionClipperController_1 = require("../controllers/BalanceComprobacionClipperController");
/**
 * Rutas para Balance de Comprobación Clipper
 * Define los endpoints HTTP para el balance de comprobación desde Clipper
 */
var BalanceComprobacionClipperRoutes = /** @class */ (function () {
    function BalanceComprobacionClipperRoutes(balanceComprobacionClipperController) {
        this.balanceComprobacionClipperController = balanceComprobacionClipperController;
    }
    /**
     * Configura y retorna las rutas del balance de comprobación clipper
     * @returns Router configurado con las rutas
     */
    BalanceComprobacionClipperRoutes.prototype.getRouter = function () {
        var router = (0, express_1.Router)();
        // GET /api/balance-comprobacion-clipper - Obtener balance de comprobación clipper
        router.get("/", this.balanceComprobacionClipperController.obtenerBalanceComprobacionClipper.bind(this.balanceComprobacionClipperController));
        // GET /api/balance-comprobacion-clipper/info - Obtener información del endpoint
        router.get("/info", this.balanceComprobacionClipperController.obtenerInfo.bind(this.balanceComprobacionClipperController));
        return router;
    };
    BalanceComprobacionClipperRoutes = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)("BalanceComprobacionClipperController")),
        __metadata("design:paramtypes", [BalanceComprobacionClipperController_1.BalanceComprobacionClipperController])
    ], BalanceComprobacionClipperRoutes);
    return BalanceComprobacionClipperRoutes;
}());
exports.BalanceComprobacionClipperRoutes = BalanceComprobacionClipperRoutes;
