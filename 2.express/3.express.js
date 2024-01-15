const ditto = require('./pokemon/ditto.json')

const express = require('express')

const PORT = process.env.PORT ?? 3000

const app = express()
app.disable('x-powered-by')

// app.use((req, res, next) => {
//   console.log('mi primer middleware')
//   // trackear la request a la base de datos
//   // revisar si el usuario tiene cookies
//   next()
// })

// app.use((req, res, next) => {
//   if(req.method !== 'POST') return next()
//   if(req.headers['content-type'] !== 'application/json') return next()

//   // solo llegan request que son POST y que tienen el header content-type: application/json
//   let body = ''

//   req.on('data', chunk => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)

//     data.timestamp = Date.now()
//     // mutar la request y meter la informacion en el req.body
//     req.body = data
//     next()
//   })
// })

// otra forma de hacer el app.use de arriba

app.use(express.json())

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

// la ultima a la que va a llegar
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`servidor levantado en http://localhost:${PORT}`)
})