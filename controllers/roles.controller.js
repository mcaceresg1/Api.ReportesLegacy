import { getConnection } from "../config/db.js";

export const obtenerRoles = async (req, res) => {
try {
  const pool = await getConnection();

  // Ejecutar el procedimiento almacenado
  const result = await pool.request().execute("sp_get_all_roles");

  // Devolver los roles activos al cliente
  res.json(result.recordset);

} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error al obtener los roles activos" });
}

}

export const registrarRol = async (req, res) => {
  const { descripcion, descripcion_completa, usuario_creacion } = req.body;

  if (!descripcion || !usuario_creacion) {
    return res.status(400).json({ error: "Faltan campos obligatorios: descripcion o usuario_creacion" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("descripcion", descripcion)
      .input("descripcion_completa", descripcion_completa || "") // si no se envía, guarda cadena vacía
      .input("usuario_creacion", usuario_creacion)
      .execute("sp_insert_rol");

    const nuevoRolId = result.recordset[0]?.nuevo_rol_id;

    res.status(201).json({
      message: "Rol registrado exitosamente",
      rol_id: nuevoRolId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el rol" });
  }
};

export const editarRol = async (req, res) => {
  const { id, descripcion, descripcion_completa, estado } = req.body;

  // Validación simple
  if (!id || !descripcion || estado === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios: id, descripcion o estado" });
  }

  try {
    const pool = await getConnection();

    await pool.request()
      .input("id", id)
      .input("descripcion", descripcion)
      .input("descripcion_completa", descripcion_completa || "")
      .input("estado", estado)
      .execute("sp_update_rol");

    res.json({ message: "Rol actualizado exitosamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al actualizar el rol" });
  }
};

export const cambiarEstadoRol = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("id", id)
      .execute("sp_eliminar_rol_logicamente");

    res.json({ message: "Rol eliminado lógicamente (estado = 0)" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al eliminar el rol" });
  }
};
