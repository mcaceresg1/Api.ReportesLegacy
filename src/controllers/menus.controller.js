import Menus from "../models/Menus.js";

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

export const agregarMenu = async (req, res) => {
  try {
    const { descripcion, padreId, icon, estado = true } = req.body;

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
    const nuevoMenu = await Menus.create({ descripcion, padreId, icon, estado });

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
    const { id, descripcion, padreId, icon, estado } = req.body;

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


