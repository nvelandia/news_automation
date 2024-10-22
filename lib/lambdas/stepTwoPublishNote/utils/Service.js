'use strict';

const mysql = require('mysql2/promise');

const handlerConnection = async () => {
  let connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  // Conectar a MySQL
  await connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });

  return connection;
};

const Service = {
  async getMatchById(matchId) {
    let connection = await handlerConnection();
    try {
      const sql = `SELECT * FROM df_match WHERE match_id = ?`;
      const [rows] = await connection.query(sql, [matchId]);

      if (rows && rows.length > 0) {
        return rows[0];
      } else {
        return false;
      }
    } catch (error) {
      // Manejar errores
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error al insertar datos',
          error: error.message,
        }),
      };
    } finally {
      if (connection) {
        // Cerrar conexión
        await connection.end();
      }
    }
  },
  async getContenidoById(conId) {
    let connection = await handlerConnection();
    try {
      const sql = `SELECT * FROM tad_contenido WHERE con_id = ?`;
      const [rows] = await connection.query(sql, [conId]);

      if (rows && rows.length > 0) {
        return rows[0];
      } else {
        return false;
      }
    } catch (error) {
      // Manejar errores
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error al insertar datos',
          error: error.message,
        }),
      };
    } finally {
      if (connection) {
        // Cerrar conexión
        await connection.end();
      }
    }
  },
  async update(info, conId) {
    let connection = await handlerConnection();
    try {
      const sql = `UPDATE tad_contenido SET ? WHERE con_id = ?`;
      const [rows] = await connection.query(sql, [info, conId]);

      return rows;
    } catch (error) {
      // Manejar errores
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error al insertar datos',
          error: error.message,
        }),
      };
    } finally {
      if (connection) {
        // Cerrar conexión
        await connection.end();
      }
    }
  },
};

module.exports = Service;
