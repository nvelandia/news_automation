'use strict';

// const mysql = require('mysql2/promise');
const mysql = require('mysql');

//   connection = await mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//   });

const connection = mysql.createConnection({
  host: '3.83.172.156', // Cambia 'localhost' si tienes una IP diferente o puerto personalizado
  user: 'root', // Tu usuario de MySQL
  password: '!hundido!', // Contraseña de MySQL
  database: 'bd_cms', // El nombre de la base de datos a la que te quieres conectar
  port: 3306, // Puerto de MySQL (generalmente 3306)
});

// Conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

const Service = {
  async getTermByLeague(leagueId) {
    try {
      const sql = `SELECT * FROM df_league_termino WHERE league_id = ?`;
      const [rows] = await connection.query(sql, [leagueId]);

      if (rows.length > 0) {
        return rows[0].ter_id;
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
  async getTermByTeam(teamId) {
    try {
      const sql = `SELECT * FROM df_equipo_termino WHERE eq_id = ?`;
      const [rows] = await connection.query(sql, [teamId]);

      if (rows.length > 0) {
        return rows[0].ter_id;
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
  async getMatchById(matchId) {
    try {
      const sql = `SELECT * FROM df_match WHERE match_id = ?`;
      // const rows = await connection.query(sql, [matchId]);
      let rows;
      connection.query(sql, [matchId], (error, results, fields) => {
        rows = results;
      });

      console.log(rows);

      if (rows && rows.length > 0) {
        return rows;
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
        // await connection.end();
      }
    }
  },
  async insert(table, content) {
    try {
      const sql = `insert into ${table} set ?`;
      const [rows] = await connection.query(sql, [content]);

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
  async insertTerm(con_id, ter_id) {
    try {
      const sql = `insert into tad_contenido_termino (con_id, ter_id) values (?,?)`;
      const [rows] = await connection.query(sql, [con_id, ter_id]);

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
  async updateMatch(info, id) {
    try {
      const sql = `UPDATE df_match SET ? WHERE match_id = ?`;
      const [rows] = await connection.query(sql, [info, id]);

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
