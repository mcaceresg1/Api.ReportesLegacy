import RolSistemaMenu from "../models/RolSistemaMenu.js";
import Menus from "../models/Menus.js";
import Sistemas from "../models/Sistemas.js";

// export const obtenerMenusPorRolYSistema = async (req, res) => {
//   const { rolId, sistemaId } = req.params;

//   try {
//     if (!rolId || !sistemaId) {
//       return res.status(400).json({ message: "Faltan parámetros." });
//     }

//     const menus = await RolSistemaMenu.findAll({
//       where: {
//         rolId,
//         sistemaId,
//         estado: true,
//       },
//       include: {
//         model: Menus,
//         as: "menu", // Asegúrate de definir esto en asociaciones
//         where: { estado: true },
//       },
//     });

//     const menuList = menus.map((item) => item.menu);

//     res.json(menuList);
//   } catch (error) {
//     console.error("Error al obtener menús:", error);
//     res.status(500).json({ message: "Error interno del servidor" });
//   }
// };

import { Op } from "sequelize"; // Asegúrate de importar esto si aún no lo tienes

export const obtenerMenusPorRolYSistema = async (req, res) => {
  const { rolId, sistemaId } = req.params;

  try {
    if (!rolId || !sistemaId) {
      return res.status(400).json({ message: "Faltan parámetros." });
    }

    console.log(`🔍 Buscando menús para rolId: ${rolId}, sistemaId: ${sistemaId}`);

    // 1. Obtener información del sistema
    const sistema = await Sistemas.findByPk(sistemaId);
    if (!sistema) {
      return res.status(404).json({ message: "Sistema no encontrado." });
    }

    // 2. Obtener los IDs de los menús asignados al rol y sistema
    const rolSistemaMenus = await RolSistemaMenu.findAll({
      where: {
        rolId,
        sistemaId,
        estado: true,
      },
      attributes: ['menuId'],
    });

    const menuIds = rolSistemaMenus.map((item) => item.menuId);

    console.log(`📋 Menús asignados (IDs): ${menuIds.join(', ')}`);

    if (!menuIds.length) {
      return res.status(404).json({ message: "No hay menús asignados a este rol y sistema." });
    }

    // 3. Obtener todos los menús asignados y sus hijos con información completa
    const menus = await Menus.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.in]: menuIds } },
          { padreId: { [Op.in]: menuIds } }
        ],
        estado: true
      },
      attributes: [
        'id', 
        'descripcion', 
        'padreId', 
        'icon', 
        'ruta', 
        'routePath',
        'areaUsuaria',
        'sistemaCode',
        'estado'
      ],
      order: [['padreId', 'ASC'], ['id', 'ASC']]
    });

    console.log(`📋 Total menús obtenidos: ${menus.length}`);

    // 4. Convertir lista plana en jerarquía
    const menuMap = new Map();
    const rootMenus = [];

    menus.forEach(menu => {
      const menuData = menu.toJSON();
      menuData.hijos = [];
      // Agregar información del sistema
      menuData.sistema = {
        id: sistema.id,
        descripcion: sistema.descripcion,
        codigo: sistema.descripcion // Usar descripción como código si no existe código específico
      };
      menuMap.set(menuData.id, menuData);
    });

    for (const menu of menuMap.values()) {
      if (menu.padreId && menuMap.has(menu.padreId)) {
        menuMap.get(menu.padreId).hijos.push(menu);
      } else {
        rootMenus.push(menu);
      }
    }

    console.log(`📋 Menús raíz estructurados: ${rootMenus.length}`);
    console.log('🔍 Menús por área usuaria:', 
      rootMenus.reduce((acc, menu) => {
        acc[menu.areaUsuaria || 'Sin área'] = (acc[menu.areaUsuaria || 'Sin área'] || 0) + 1;
        return acc;
      }, {})
    );

    res.json(rootMenus);
  } catch (error) {
    console.error("Error al obtener menús por rol y sistema:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const asignarMenusPorRolYSistema = async (req, res) => {
  const { rolId, sistemaId, menuIds } = req.body;

  try {
    if (!rolId || !sistemaId || !Array.isArray(menuIds)) {
      return res.status(400).json({ message: 'Faltan parámetros o formato incorrecto.' });
    }

    // 1. Eliminar asignaciones previas
    await RolSistemaMenu.destroy({
      where: { rolId, sistemaId }
    });

    // 2. Crear nuevas asignaciones
    const nuevasAsignaciones = menuIds.map(menuId => ({
      rolId,
      sistemaId,
      menuId,
      estado: true,
    }));

    await RolSistemaMenu.bulkCreate(nuevasAsignaciones);

    res.json({ message: 'Menús asignados correctamente.' });
  } catch (error) {
    console.error('Error al asignar menús:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const actualizarAsignacionPorId = async (req, res) => {
  const { id } = req.params;
  const { rolId, sistemaId, menuId, estado } = req.body;

  try {
    const asignacion = await RolSistemaMenu.findByPk(id);

    if (!asignacion) {
      return res.status(404).json({ message: 'Asignación no encontrada.' });
    }

    await asignacion.update({
      rolId: rolId ?? asignacion.rolId,
      sistemaId: sistemaId ?? asignacion.sistemaId,
      menuId: menuId ?? asignacion.menuId,
      estado: estado ?? asignacion.estado,
    });

    res.json({
      message: 'Asignación actualizada correctamente.',
      asignacion,
    });
  } catch (error) {
    console.error('Error al actualizar asignación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
