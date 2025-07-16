import Sistemas from "../models/Sistemas.js";

export const obtenerSistemas = async (req, res) => {
  try {
    const datos = await Sistemas.findAll();
    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los sistemas" });
  }
};

export const agregarSistema = async (req, res) => {
  try {
    await Sistemas.create(req.body);
    res.status(201).json({ message: "Sistema agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar el sistema" });
  }
};

export const editarSistema = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "El campo 'id' es obligatorio." });

    const sistema = await Sistemas.findByPk(id);
    if (!sistema) return res.status(404).json({ message: "Sistema no encontrado" });

    await sistema.update(req.body);
    res.json({ message: "Sistema actualizado correctamente", sistema });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el sistema" });
  }
};

export const eliminarSistema = async (req, res) => {
  try {
    const { id } = req.params;
    const sistema = await Sistemas.findByPk(id);
    if (!sistema) return res.status(404).json({ message: "Sistema no encontrado" });

    await sistema.destroy();
    res.json({ message: "Sistema eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el sistema" });
  }
};
