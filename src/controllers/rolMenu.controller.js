import { raw } from "mysql2";
import Menus from "../models/Menus.js";
import RolMenu from "../models/RolMenu.js";
import { Op } from 'sequelize';

export const obtenerRolMenu = async (req, res) => {
  try {
    const datos = await RolMenu.findAll();
    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los roles" });
  }
};

export const agregarRolMenu = async (req, res) => {
  try {
    await RolMenu.create(req.body);
    res.status(201).json({ message: "Agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar el rol" });
  }
};

export const editarRolMenu = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const dato = await RolMenu.findByPk(id);
    if (!dato) return res.status(404).json({ message: "No encontrada" });

    await dato.update(req.body);
    res.json({ message: "Rol actualizado correctamente", dato });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar al rol" });
  }
};

export const cambiarEstadoRolMenu = async (req, res) => {
  try {
    const { id, estado } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const dato = await RolMenu.findByPk(id);
    if (!dato) return res.status(404).json({ message: "Rol no encontrada" });

    await dato.update({ estado });
    res.json({
      message: "Estado del rol actualizado correctamente",
      datoEstado: dato.estado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cambiar el estado del rol" });
  }
};

export const obtenerMenuPorIdRol = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener los IDs de los menús asignados al rol
    const rolMenus = await RolMenu.findAll({
      where: { rolId: id, estado: true },
      attributes: ['menuId'],
    });

    const menuIds = rolMenus.map(rm => rm.menuId);

    if (!menuIds.length) {
      return res.status(404).json({ message: "No hay menús asignados a este rol" });
    }

    // 2. Obtener todos los menús asignados y sus hijos
    const menus = await Menus.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.in]: menuIds } },
          { padreId: { [Op.in]: menuIds } }
        ],
        estado: true
      },
      attributes: ['id', 'descripcion', 'padreId', 'icon', 'estado'],
      order: [['padreId', 'ASC'], ['id', 'ASC']] // opcional para ordenar
    });

    // 3. Convertir lista plana en jerarquía
    const menuMap = new Map();
    const rootMenus = [];

    menus.forEach(menu => {
      menu = menu.toJSON(); // asegurarse de que sea plano
      menu.hijos = [];
      menuMap.set(menu.id, menu);
    });

    for (const menu of menuMap.values()) {
      if (menu.padreId && menuMap.has(menu.padreId)) {
        // Añadir como hijo del padre
        menuMap.get(menu.padreId).hijos.push(menu);
      } else {
        // Si no tiene padre o no se asignó su padre, es raíz
        rootMenus.push(menu);
      }
    }

    res.json(rootMenus);
  } catch (error) {
    console.error("Error al obtener menús por rol:", error);
    res.status(500).json({ message: "Error al obtener los menús" });
  }
};

