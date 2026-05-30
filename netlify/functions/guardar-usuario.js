const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  // Solo permitimos peticiones POST (para enviar datos)
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { nombre, email, telefono } = JSON.parse(event.body);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST, user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Insertar los datos que llegaron del formulario HTML
    const sql = 'INSERT INTO usuarios (nombre, email, telefono) VALUES (?, ?, ?)';
    await connection.execute(sql, [nombre, email, telefono]);
    await connection.end();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ mensaje: "Usuario guardado con éxito" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};