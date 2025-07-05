import Roles from "../models/Roles.js";

export const obtenerRoles = async (req, res) => {
  try {
    const datos = await Roles.findAll();
    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los roles" });
  }
};

export const agregarRol = async (req, res) => {
  try {
    await Roles.create(req.body);
    res.status(201).json({ message: "Rol agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar el rol" });
  }
};

export const editarRol = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const dato = await Roles.findByPk(id);
    if (!dato) return res.status(404).json({ message: "Rol no encontrada" });

    await dato.update(req.body);
    res.json({ message: "Rol actualizado correctamente", dato });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar al rol" });
  }
};

export const cambiarEstadoRol = async (req, res) => {
  try {
    const { id, estado } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const dato = await Roles.findByPk(id);
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
