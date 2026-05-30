const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { id } = JSON.parse(event.body);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST, user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    await connection.end();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ mensaje: "Usuario eliminado con éxito" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};