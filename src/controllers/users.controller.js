// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Usuarios from "../models/Usuarios.js";
// import Roles from "../models/Roles.js";

// export const loginUsuario = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const usuario = await Usuarios.findOne({
//       where: { username },
//       include: [{ model: Roles, attributes: ["descripcion"] }],
//     });

//     if (!usuario) {
//       return res.status(400).json({ error: "Usuario no encontrado" });
//     }

//     const isMatch = await bcrypt.compare(password, usuario.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: "Contraseña incorrecta" });
//     }

//     const token = jwt.sign(
//       { userId: usuario.id, role: usuario.Role.descripcion },
//       "secretKey",
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.json({
//       message: "Login exitoso",
//       token,
//       role: usuario.Role.descripcion,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Error al iniciar sesión" });
//   }
// };


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuarios from "../models/Usuarios.js";
import Roles from "../models/Roles.js";

export const loginUsuario = async (req, res) => {
  const { username, password } = req.body;

  // Validación básica del body (buena práctica)
  if (!username || !password) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const usuario = await Usuarios.findOne({
      where: { username },
      include: {
        model: Roles,
        as: "rol", // Este alias debe coincidir con el definido en la relación
        attributes: ["descripcion"],
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        userId: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rolId: usuario.rolId, // Cambiar 'rol' por 'rolId' para que coincida con el frontend
      },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login exitoso",
      token,
      role: usuario.rol?.descripcion,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
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
    const { username, password, email, estado, rolId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await Usuarios.create({
      username,
      password: hashedPassword,
      email,
      estado,
      rolId,
    });

    res.status(201).json({ message: "Usuario agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar el usuario" });
  }
};


export const editarUsuario = async (req, res) => {
  try {
    const { id, rolId } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El campo 'id' es obligatorio." });
    }

    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // ✅ Validar que el rol exista
    if (rolId) {
      const existeRol = await Roles.findByPk(rolId);
      if (!existeRol) {
        return res.status(400).json({ message: `El rol con id ${rolId} no existe.` });
      }
    }

    await usuario.update(req.body);
    res.json({ message: "Usuario actualizado correctamente", usuario });

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
