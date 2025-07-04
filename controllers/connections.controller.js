import Conexiones from "../models/Conexiones.js";

export const obtenerConexiones = async (req, res) => {
  try {
    const datos = await Conexiones.findAll();
    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las conexiones" });
  }
};

export const obtenerConexionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await Conexiones.findByPk(id);

    if (!dato) return res.status(404).json({ message: "No encontrado" });

    res.json(dato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar la conexión" });
  }
};

export const agregarConexion = async (req, res) => {
  try {
    await Conexiones.create(req.body);
    res.status(201).json({ message: "Conexión agregada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar la conexión" });
  }
};

export const editarConexion = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const dato = await Conexiones.findByPk(id);
    if (!dato)
      return res.status(404).json({ message: "Conexión no encontrada" });

    await dato.update(req.body);
    res.json({ message: "Conexión actualizada correctamente", dato });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la conexión" });
  }
};

export const eliminarConexion = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Conexiones.destroy({ where: { id } });

    if (!eliminado) return res.status(404).json({ message: "No encontrado" });

    res.json({ message: "Conexión eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la conexion" });
  }
};
