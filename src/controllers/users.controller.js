import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuarios from "../models/Usuarios.js";
import Roles from "../models/Roles.js";

export const loginUsuario = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuarios.findOne({
      where: { username },
      include: [{ model: Roles, attributes: ["descripcion"] }],
    });

    if (!usuario) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: usuario.id, role: usuario.Role.descripcion },
      "secretKey",
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login exitoso",
      token,
      role: usuario.Role.descripcion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const datos = await Usuarios.findAll();
    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las conexiones" });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const dato = await Usuarios.findByPk(id);

    if (!dato) return res.status(404).json({ message: "No encontrado" });

    res.json(dato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar al usuario" });
  }
};

export const agregarUsuario = async (req, res) => {
  try {
    const { username, password, email, estado, roleId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await Usuarios.create({
      username,
      password: hashedPassword,
      email,
      estado,
      roleId,
    });

    res.status(201).json({ message: "Usuario agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar el usuario" });
  }
};

export const editarUsuario = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const dato = await Usuarios.findByPk(id);
    if (!dato)
      return res.status(404).json({ message: "Usuario no encontrada" });

    await dato.update(req.body);
    res.json({ message: "Usuario actualizado correctamente", dato });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar al usuario" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuarios.destroy({ where: { id } });

    if (!eliminado) return res.status(404).json({ message: "No encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};
