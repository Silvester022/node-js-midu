import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {

  constructor({movieModel}) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })

    // que es lo que renderiza
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie Not Found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)
  
    if (!result.success) return res.status(422).json({ error: result.error.issues }) // 422 Unprocessable Entity
  
    const newMovie = await this.movieModel.create({ input: result.data })
  
    res.status(201).json(newMovie)
  }
  
  update  = async (req, res) => {
    const result = validatePartialMovie(req.body)
  
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
  
    const { id } = req.params
    const updateMovie = await this.movieModel.update({ id, input: result.data })
    
    if(!updateMovie) return res.status(404).json({ message: 'Movie Not Found' })
  
    return res.json(updateMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const movieIndex = await this.movieModel.delete({ id })
  
    if (!movieIndex) return res.status(404).json({ message: 'Movie Not Found' })
  
    return res.json({ message: 'Movie deleted' })
  }
}