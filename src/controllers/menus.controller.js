import Menus from "../models/Menus.js";
import Sistemas from "../models/Sistemas.js";
import RolSistemaMenu from "../models/RolSistemaMenu.js";
import Roles from "../models/Roles.js";
import { Op } from "sequelize";

export const obtenerMenus = async (req, res) => {
  try {
    const menuRaiz = await Menus.findAll({
      where: { padreId: null, estado: true }, // solo menús padres activos
      include: {
        model: Menus,
        as: "submenus",
        where: { estado: true },
        required: false,
        include: {
          model: Menus,
          as: "submenus",
          where: { estado: true },
          required: false,
          include: {
            model: Menus,
            as: "submenus",
            where: { estado: true },
            required: false,
          }
        }
      },
      order: [["id", "ASC"]],
    });

    res.json(menuRaiz);
  } catch (error) {
    console.error("Error al obtener el menú jerárquico:", error);
    res.status(500).json({ message: "Error al obtener el árbol de menús" });
  }
};

// Nuevo: Obtener menús por rol y sistema
export const obtenerMenusPorRolYSistema = async (req, res) => {
  try {
    const { rolId, sistemaId } = req.params;

    if (!rolId || !sistemaId) {
      return res.status(400).json({ 
        message: "rolId y sistemaId son requeridos" 
      });
    }

    // Buscar menús a través de RolSistemaMenu
    const menuPermissions = await RolSistemaMenu.findAll({
      where: {
        rolId: rolId,
        sistemaId: sistemaId,
        estado: true
      },
      include: {
        model: Menus,
        as: "menu",
        where: { estado: true },
        required: true
      }
    });

    // Extraer solo los menús
    const menus = menuPermissions.map(permission => permission.menu);

    // Organizar en estructura jerárquica
    const menusJerarquicos = organizarMenusJerarquicos(menus);

    res.json(menusJerarquicos);
  } catch (error) {
    console.error("Error al obtener menús por rol y sistema:", error);
    res.status(500).json({ message: "Error al obtener menús filtrados" });
  }
};

// Nuevo: Obtener menús por área usuaria
export const obtenerMenusPorArea = async (req, res) => {
  try {
    const { area } = req.params;

    if (!area) {
      return res.status(400).json({ 
        message: "El parámetro 'area' es requerido" 
      });
    }

    const menus = await Menus.findAll({
      where: {
        areaUsuaria: {
          [Op.like]: `%${area}%`
        },
        estado: true
      },
      order: [["id", "ASC"]]
    });

    const menusJerarquicos = organizarMenusJerarquicos(menus);
    res.json(menusJerarquicos);
  } catch (error) {
    console.error("Error al obtener menús por área:", error);
    res.status(500).json({ message: "Error al obtener menús por área" });
  }
};

// Nuevo: Obtener menús por sistema
export const obtenerMenusPorSistema = async (req, res) => {
  try {
    const { sistemaCode } = req.params;

    if (!sistemaCode) {
      return res.status(400).json({ 
        message: "El parámetro 'sistemaCode' es requerido" 
      });
    }

    const menus = await Menus.findAll({
      where: {
        sistemaCode: sistemaCode,
        estado: true
      },
      order: [["id", "ASC"]]
    });

    const menusJerarquicos = organizarMenusJerarquicos(menus);
    res.json(menusJerarquicos);
  } catch (error) {
    console.error("Error al obtener menús por sistema:", error);
    res.status(500).json({ message: "Error al obtener menús por sistema" });
  }
};

// Función auxiliar para organizar menús jerárquicos
function organizarMenusJerarquicos(menus) {
  const menuMap = new Map();
  const menusPadres = [];

  // Crear mapa de menús
  menus.forEach(menu => {
    menuMap.set(menu.id, { ...menu.toJSON(), hijos: [] });
  });

  // Organizar jerarquía
  menus.forEach(menu => {
    const menuItem = menuMap.get(menu.id);
    
    if (menu.padreId && menuMap.has(menu.padreId)) {
      // Es un submenú
      menuMap.get(menu.padreId).hijos.push(menuItem);
    } else {
      // Es un menú padre
      menusPadres.push(menuItem);
    }
  });

  return menusPadres;
}

// Nuevo: Poblar menús desde tabla de datos
export const poblarMenusDesdeTabla = async (req, res) => {
  try {
    console.log('🚀 Iniciando población de menús...');
    
    // Primero, crear/verificar que existen los roles básicos
    const rolesBasicos = [
      { id: 1, descripcion: 'Administrador', estado: true },
      { id: 2, descripcion: 'Atención Cliente', estado: true },
      { id: 3, descripcion: 'Tesorería y Caja', estado: true },
      { id: 4, descripcion: 'Contabilidad', estado: true },
      { id: 5, descripcion: 'Gestión de Personal', estado: true }
    ];

    console.log('📝 Creando/verificando roles básicos...');
    for (const rol of rolesBasicos) {
      try {
        const [rolCreado, created] = await Roles.findOrCreate({
          where: { id: rol.id },
          defaults: rol
        });
        console.log(`Rol ${rol.descripcion}: ${created ? 'creado' : 'ya existe'}`);
      } catch (error) {
        console.error(`❌ Error al crear/verificar rol ${rol.descripcion}:`, error.message);
      }
    }

    console.log('🏢 Creando/verificando sistema básico...');
    // Verificar/crear sistema básico
    const [sistemaCreado, sistemaCreated] = await Sistemas.findOrCreate({
      where: { id: 1 },
      defaults: { 
        id: 1, 
        descripcion: 'Sistema Principal', 
        estado: true 
      }
    });
    console.log(`Sistema: ${sistemaCreated ? 'creado' : 'ya existe'}`);

    // Datos basados en la tabla proporcionada
    const datosMenu = [
      // Atención Cliente
      { descripcion: "Atención Cliente", areaUsuaria: "1.- Atención Cliente", sistemaCode: "ORACLE", ruta: "Contratos / Inf. Financiera", routePath: "/home/contratos-financiera", icon: "customer_service" },
      { descripcion: "Atención Cliente", areaUsuaria: "1.- Atención Cliente", sistemaCode: "CLIPPER-TNEW0000", ruta: "Consultas / Contratos", routePath: "/home/consultas-contratos", icon: "search" },
      { descripcion: "Atención Cliente", areaUsuaria: "1.- Atención Cliente", sistemaCode: "CLIPPER-PARQUE1", ruta: "Documentos / Contratos", routePath: "/home/documentos-contratos", icon: "document" },
      { descripcion: "Atención Cliente", areaUsuaria: "1.- Atención Cliente", sistemaCode: "HMIS", ruta: "Contratos / Contratos", routePath: "/home/hmis-contratos", icon: "contract" },
      
      // Tesorería y Caja
      { descripcion: "Tesorería y Caja", areaUsuaria: "2.- Tesorería y Caja", sistemaCode: "EXACTUS", ruta: "CxP / TRN / Documentos", routePath: "/home/cxp-documentos", icon: "payment" },
      { descripcion: "Tesorería y Caja", areaUsuaria: "2.- Tesorería y Caja", sistemaCode: "EXACTUS", ruta: "CxP / RST / RCXP / Detalle de Movimientos por Pagar", routePath: "/home/detalle-movimientos", icon: "receipt" },
      { descripcion: "Tesorería y Caja", areaUsuaria: "2.- Tesorería y Caja", sistemaCode: "EXACTUS", ruta: "CG / RST / LO / MC / Reporte de Movimientos Contables", routePath: "/home/movimientos-contables", icon: "accounting" },
      
      // Contabilidad - múltiples entradas
      { descripcion: "Contabilidad", areaUsuaria: "4.- Contabilidad", sistemaCode: "EXACTUS", ruta: "CG / CO / De Cuentas Contables", routePath: "/home/cuentas-contables", icon: "account_balance" },
      { descripcion: "Libro Mayor", areaUsuaria: "4.- Contabilidad", sistemaCode: "EXACTUS", ruta: "CG / CO / Libro Mayor", routePath: "/home/libro-mayor", icon: "book", padreId: null },
      { descripcion: "Asientos", areaUsuaria: "4.- Contabilidad", sistemaCode: "EXACTUS", ruta: "CG / CO / Del Mayor / Asientos", routePath: "/home/libro-mayor/asientos", icon: "edit", padreId: "LIBRO_MAYOR" },
      { descripcion: "Balance de Comprobación", areaUsuaria: "4.- Contabilidad", sistemaCode: "EXACTUS", ruta: "CG / RST / LO / Balance de Comprobacion", routePath: "/home/balance-comprobacion", icon: "balance" },
      
      // Gestión de Personal
      { descripcion: "Gestión de Personal", areaUsuaria: "5.- Gestión de Personal", sistemaCode: "EXACTUS", ruta: "GN / Favoritos / Acciones de Personal", routePath: "/home/acciones-personal", icon: "people" },
      { descripcion: "Contratos Personal", areaUsuaria: "5.- Gestión de Personal", sistemaCode: "EXACTUS", ruta: "GN /Favoritos / Contratos", routePath: "/home/contratos-personal", icon: "assignment" },
      { descripcion: "Planilla", areaUsuaria: "5.- Gestión de Personal", sistemaCode: "EXCEL", ruta: "Planillon", routePath: "/home/planilla", icon: "spreadsheet" },
    ];

    console.log(`🗑️ Limpiando tablas relacionadas...`);
    // Limpiar tablas relacionadas primero (solo para desarrollo)
    await RolSistemaMenu.destroy({ where: {} });
    await Menus.destroy({ where: {} });
    console.log('✅ Tablas limpiadas');

    console.log(`📋 Insertando ${datosMenu.length} menús...`);
    // Insertar menús
    const menusCreados = [];
    
    for (const menu of datosMenu) {
      try {
        console.log(`Creando menú: ${menu.descripcion} - ${menu.ruta}`);
        const menuCreado = await Menus.create(menu);
        menusCreados.push(menuCreado);
        console.log(`✅ Menú creado con ID: ${menuCreado.id}`);
      } catch (error) {
        console.error(`❌ Error al crear menú: ${menu.descripcion}`, error.message);
      }
    }

    console.log(`🔗 Creando relaciones rol-sistema-menú...`);
    // Crear relaciones rol-sistema-menú
    // Rol 1 = Administrador (acceso a TODOS los menús)
    const relacionesCreadas = [];
    
    for (const menu of menusCreados) {
      try {
        console.log(`Asignando menú ${menu.descripcion} al rol 1 (admin)`);
        // SIEMPRE asignar todos los menús al rol 1 (administrador) 
        const relacionAdmin = await RolSistemaMenu.create({
          rolId: 1,
          sistemaId: 1, 
          menuId: menu.id,
          estado: true
        });
        relacionesCreadas.push(relacionAdmin);

        // También crear relaciones específicas por área para otros roles
        if (menu.areaUsuaria === "1.- Atención Cliente") {
          await RolSistemaMenu.create({
            rolId: 2, // Rol de Atención Cliente
            sistemaId: 1,
            menuId: menu.id,
            estado: true
          });
        } else if (menu.areaUsuaria === "2.- Tesorería y Caja") {
          await RolSistemaMenu.create({
            rolId: 3, // Rol de Tesorería
            sistemaId: 1,
            menuId: menu.id,
            estado: true
          });
        } else if (menu.areaUsuaria === "4.- Contabilidad") {
          await RolSistemaMenu.create({
            rolId: 4, // Rol de Contabilidad
            sistemaId: 1,
            menuId: menu.id,
            estado: true
          });
        } else if (menu.areaUsuaria === "5.- Gestión de Personal") {
          await RolSistemaMenu.create({
            rolId: 5, // Rol de Recursos Humanos
            sistemaId: 1,
            menuId: menu.id,
            estado: true
          });
        }
        console.log(`✅ Relaciones creadas para menú: ${menu.descripcion}`);
      } catch (error) {
        console.error(`❌ Error al crear relación para menú ${menu.descripcion}:`, error.message);
      }
    }

    console.log(`🎉 Proceso completado: ${menusCreados.length} menús y ${relacionesCreadas.length} relaciones`);
    res.status(201).json({
      message: `Se crearon ${menusCreados.length} menús y ${relacionesCreadas.length} relaciones exitosamente`,
      menus: menusCreados,
      relaciones: relacionesCreadas.length
    });
  } catch (error) {
    console.error("❌ Error al poblar menús:", error);
    res.status(500).json({ message: "Error al poblar menús desde tabla", error: error.message });
  }
};

export const agregarMenu = async (req, res) => {
  try {
    const { descripcion, padreId, icon, ruta, areaUsuaria, sistemaCode, routePath, estado = true } = req.body;

    // Validación básica
    if (!descripcion) {
      return res.status(400).json({ message: "El campo 'descripcion' es obligatorio." });
    }

    // Si hay padreId, validar que exista
    if (padreId) {
      const padre = await Menus.findByPk(padreId);
      if (!padre) {
        return res.status(400).json({ message: `No se encontró el menú padre con ID ${padreId}` });
      }
    }

    // Crear el menú
    const nuevoMenu = await Menus.create({ 
      descripcion, 
      padreId, 
      icon, 
      ruta, 
      areaUsuaria, 
      sistemaCode, 
      routePath, 
      estado 
    });

    res.status(201).json({
      message: "Menú agregado exitosamente",
      menu: nuevoMenu,
    });
  } catch (error) {
    console.error("Error al guardar el menú:", error);
    res.status(500).json({ message: "Error al guardar el menú" });
  }
};

export const editarMenu = async (req, res) => {
  try {
    const { id, descripcion, padreId, icon, ruta, areaUsuaria, sistemaCode, routePath, estado } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const menu = await Menus.findByPk(id);
    if (!menu) {
      return res.status(404).json({ message: "Menú no encontrado." });
    }

    // Verificar que no se asigne como su propio padre
    if (padreId && padreId === id) {
      return res.status(400).json({ message: "Un menú no puede ser su propio padre." });
    }

    // Si se pasa padreId, validar que exista
    if (padreId) {
      const padre = await Menus.findByPk(padreId);
      if (!padre) {
        return res.status(400).json({ message: `El menú padre con ID ${padreId} no existe.` });
      }
    }

    // Actualización segura solo de los campos permitidos
    await menu.update({
      descripcion: descripcion ?? menu.descripcion,
      padreId: padreId ?? menu.padreId,
      icon: icon ?? menu.icon,
      ruta: ruta ?? menu.ruta,
      areaUsuaria: areaUsuaria ?? menu.areaUsuaria,
      sistemaCode: sistemaCode ?? menu.sistemaCode,
      routePath: routePath ?? menu.routePath,
      estado: estado ?? menu.estado,
    });

    res.json({
      message: "Menú actualizado correctamente",
      menu,
    });
  } catch (error) {
    console.error("Error al actualizar el menú:", error);
    res.status(500).json({ message: "Error al actualizar el menú" });
  }
};

export const eliminarMenu = async (req, res) => {
 try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const menu = await Menus.findByPk(id);
    if (!menu) {
      return res.status(404).json({ message: "Menú no encontrado." });
    }

    // Validar si tiene submenús activos
    const submenúsActivos = await Menus.findAll({
      where: { padreId: id, estado: true }
    });

    if (submenúsActivos.length > 0) {
      return res.status(400).json({ 
        message: "No se puede desactivar este menú porque tiene submenús activos." 
      });
    }

    // Cambiar estado a false (desactivado)
    await menu.update({ estado: false });

    res.json({ message: "Menú desactivado correctamente." });
  } catch (error) {
    console.error("Error al desactivar el menú:", error);
    res.status(500).json({ message: "Error al desactivar el menú" });
  }
};


