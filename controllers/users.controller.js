import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnection } from "../config/db.js";

export const registrarUsuario = async (req, res) => {
  const { username, password, email, role = "User" } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const pool = await getConnection();
    await pool
      .request()
      .input("username", username)
      .input("password", hashedPassword)
      .input("email", email)
      .input("role", role)
      .query(
        "INSERT INTO Usuarios (username, password, email, role) VALUES (@username, @password, @email, @role)"
      );

    res.json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    console.error(err);
  }
};

export const loginUsuario = async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("username", username)
      .query("SELECT * FROM Usuarios WHERE username = @username");

    if (result.recordset.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, "secretKey", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login exitoso",
      token: token,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Usuarios");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};
