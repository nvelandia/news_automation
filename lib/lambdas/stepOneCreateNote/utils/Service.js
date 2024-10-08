'use strict';

const mysql = require('mysql2/promise');
// const mysql = require('mysql');

const handlerConnection = async () => {
  //   connection = await mysql.createConnection({
  //     host: process.env.MYSQL_HOST,
  //     user: process.env.MYSQL_USER,
  //     password: process.env.MYSQL_PASSWORD,
  //     database: process.env.MYSQL_DATABASE,
  //   });

  // Hereeeeee

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
  async getTermByLeague(leagueId) {
    let connection = await handlerConnection();
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
    let connection = await handlerConnection();
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
    let connection = await handlerConnection();
    try {
      console.log('flag 1', matchId);
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
        // await connection.end();
      }
    }
  },
  async insert(table, content) {
    console.log('flag 1');

    let connection = await handlerConnection();
    try {
      const sql = `insert into ${table} set ?`;
      const [result] = await connection.query(sql, [content]);

      return result.insertId;
    } catch (error) {
      console.log('Error', error);
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
        console.log('flag 2');

        await connection.end();
      }
    }
  },
  async insertTerm(con_id, ter_id) {
    let connection = await handlerConnection();
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
    let connection = await handlerConnection();
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
