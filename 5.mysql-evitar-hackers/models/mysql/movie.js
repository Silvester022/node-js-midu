import mysql from "mysql2/promise"

const DEFAULT_CONFIG = {
  host: process.env.DATABSE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { required: false }
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
      )

      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id }] = genres

      // get all movies ids from database table 
      // la query a movie_genres
      // join y devolver resultado
      const [res] = await connection.query(
        'SELECT * FROM movie_genres where movie_id = ?;', [id]
      )
    }

    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie;'
    )

    return movies
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie
        WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create({ input }) {
    const {
      title,
      year,
      director,
      duration,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    
    try {
      const result = await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
          VALUES (UUID_TO_BIN("${uuid}"), ?,  ?, ?, ?, ?, ?)`,
        [title, year, director, duration, poster, rate]
      )
  
      const [movies] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie
          WHERE id = UUID_TO_BIN(?);`,
        [uuid]
      )
      
      return movies[0]

    } catch (e) {
      // puede mostrar info sensible
      throw new Error('Error creating movie')
      // enviar la traza a un servicio interno
      // sendLog(e)
    }
  }

  static async delete({ id }) {
  }

  static async update({ id, input }) {
  }
}