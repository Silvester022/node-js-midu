import { MovieModel } from "../models/local-file-system/movie.js"

import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {

  static async getAll(req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })

    // que es lo que renderiza
    res.json(movies)
  }

  static async getById(req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie Not Found' })
  }

  static async create(req, res) {
    const result = validateMovie(req.body)
  
    if (!result.success) return res.status(422).json({ error: result.error.issues }) // 422 Unprocessable Entity
  
    const newMovie = await MovieModel.create({ input: result.data })
  
    res.status(201).json(newMovie)
  }
  
  static async update (req, res) {
    const result = validatePartialMovie(req.body)
  
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
  
    const { id } = req.params
    const updateMovie = await MovieModel.update({ id, input: result.data })
    
    if(!updateMovie) return res.status(404).json({ message: 'Movie Not Found' })
  
    return res.json(updateMovie)
  }

  static async delete(req, res) {
    const { id } = req.params
    const movieIndex = await MovieModel.delete({ id })
  
    if (!movieIndex) return res.status(404).json({ message: 'Movie Not Found' })
  
    return res.json({ message: 'Movie deleted' })
  }
}