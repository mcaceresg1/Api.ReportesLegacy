import { getConnection } from "../config/db.js";

export const obtenerDatos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM ConexionSQL");

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
  }
};

export const agregarDatos = async (req, res) => {
  try {
    const {
      usernameDB,
      passwordDB,
      nameDB,
      nameServer,
      nameTable,
      codEmpresa,
      desEmpresa,
      sistema,
    } = req.body;
    const pool = await getConnection();
    await pool
      .request()
      .input("usernameDB", usernameDB)
      .input("passwordDB", passwordDB)
      .input("nameDB", nameDB)
      .input("nameServer", nameServer)
      .input("nameTable", nameTable)
      .input("codEmpresa", codEmpresa)
      .input("desEmpresa", desEmpresa)
      .input("sistema", sistema)
      .query(
        "INSERT INTO ConexionSQL (usernameDB, passwordDB, nameDB, nameServer, nameTable, codEmpresa, desEmpresa, sistema) VALUES (@usernameDB, @passwordDB, @nameDB, @nameServer, @nameTable, @codEmpresa, @desEmpresa, @sistema)"
      );
    res.json({ message: "Datos guardados exitosamente" });
  } catch (error) {
    console.error(error);
  }
};

export const editarDatos = async (req, res) => {
  try {
    const {
      usernameDB,
      passwordDB,
      nameDB,
      nameServer,
      nameTable,
      codEmpresa,
      desEmpresa,
      sistema,
    } = req.body;
    const pool = await getConnection();
    await pool
      .request()
      .input("usernameDB", usernameDB)
      .input("passwordDB", passwordDB)
      .input("nameDB", nameDB)
      .input("nameServer", nameServer)
      .input("nameTable", nameTable)
      .input("codEmpresa", codEmpresa)
      .input("desEmpresa", desEmpresa)
      .input("sistema", sistema)
      .query(
        "UPDATE ConexionSQL SET usernameDB = @usernameDB, passwordDB = @passwordDB, nameDB = @nameDB, nameServer = @nameServer, nameTable = @nameTable, codEmpresa = @codEmpresa, desEmpresa = @desEmpresa, sistema = @sistema"
      );
    res.json({ message: "Datos actualizados exitosamente" });
  } catch (error) {
    console.error(error);
  }
};

export const eliminarDatos = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM ConexionSQL WHERE id = @id");
    res.json({ message: "Datos eliminados exitosamente" });
  } catch (error) {
    console.error(error);
  }
};
