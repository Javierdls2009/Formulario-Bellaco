const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { id, nombre, email, telefono } = JSON.parse(event.body);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST, user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    const sql = 'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?';
    await connection.execute(sql, [nombre, email, telefono, id]);
    await connection.end();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ mensaje: "Usuario actualizado con éxito" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};