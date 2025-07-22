import { Router } from "express";
import {
  obtenerMenus,
  obtenerMenusPorRolYSistema,
  obtenerMenusPorArea,
  obtenerMenusPorSistema,
  poblarMenusDesdeTabla,
  agregarMenu,
  editarMenu,
  eliminarMenu,
} from "../controllers/menus.controller.js";
import { verificarToken } from "../middleware/verificarToken.js";

const router = Router();

// ===== RUTAS PÚBLICAS (sin autenticación requerida) =====
// Obtener menús (lectura)
router.get("/", obtenerMenus);
router.get("/rol/:rolId/sistema/:sistemaId", obtenerMenusPorRolYSistema);
router.get("/area/:area", obtenerMenusPorArea);
router.get("/sistema/:sistemaCode", obtenerMenusPorSistema);

// Poblar menús (solo para desarrollo/admin inicial)
router.post("/poblar", poblarMenusDesdeTabla);

// ===== RUTAS PROTEGIDAS (requieren autenticación) =====
router.use(verificarToken);

// CRUD básico de menús
router.post("/", agregarMenu);
router.put("/", editarMenu);
router.delete("/:id", eliminarMenu);

export default router; 