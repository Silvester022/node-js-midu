const express = require('express') // require -> commonJS
const crypto = require('node:crypto')
const cors = require('cors')

const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const { REFUSED } = require('node:dns')

const app = express()
app.use(express.json())
app.use(cors())

app.disable('x-powered-by') // desabilita el header X-Powered-By: Express

// app.get('/', (req, res) => {
//   res.json({message: 'hola mundo'})
// })


// metodos normales: GET/HEAD/POST
// metodos complejos: PUT/PATCH/DELETE 

// CORS PRE-Flight
// OPTIONS

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://movies.com',
  'http://midu.dev',
]

// todos los recursos que sean MOVIES se identifican con /movies
app.get('/movies', (req, res) => {
  const origin = req.header('origin')

  // cuando la peticion es del mismo ORIGIN
  // http://localhost:3000 -> http://localhost:3000
  // el navegador no envia el origin
  if(ACCEPTED_ORIGINS.includes(origin) || !origin) {
    
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { genre } = req.query
  if (genre) {
    const filterMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))

    return res.json(filterMovies)
  }

  res.json(movies)
})

app.get('/movies/:id', (req, res) => { // path-to-regex
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie Not Found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  // 422 Unprocessable Entity
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues })
  }

  // en bbdd
  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }

  // esto no seria REST, porque estamos guardando el estado de la app en memoria
  movies.push(newMovie)

  res.status(201).json(newMovie) // actualizar la cache del cliente
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if(!result.success) return res.status(400).json({error: JSON.parse(result.error.message)})
  
  const { id } = req.params

  const movieIndex = movies.findIndex(movie => movie.id === id)
  if(movieIndex === -1) return res.status(404).json({message: 'Movie Not Found'}) 

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if(ACCEPTED_ORIGINS.includes(origin) || !origin) {
    
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if(movieIndex === -1) return res.status(404).json({message: 'Movie Not Found'})

  movies.splice(movieIndex, 1)

  return res.json({message: 'Movie deleted'})
})

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if(ACCEPTED_ORIGINS.includes(origin) || !origin) {
    
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  }
  res.send(200)
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
