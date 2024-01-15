const http = require('node:http')
const fs = require('node:fs')

const desirePort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (req.url === '/') {
    res.end('<h1>bienvenido a mi página de inicio<h1>')

  } else if (req.url === '/contacto') {
    res.setHeader('Content-Type', 'image/jpg')

  } else if (req.url === '/imagen-super-bonita.jpg') {

    fs.readFile('cat-sleep.jpg', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('<h1>500 - Internal Server Error</h1>')

      } else {
        res.setHeader('Content-Type', 'image/jpg')
        res.end(data)
      }
    })
  } else {
    res.statusCode = 404 // not found
    res.end('<h1>404<h1>')
  }
}

const server = http.createServer(processRequest)

server.listen(desirePort, () => {
  console.log(`server listening on port http://localhost:${desirePort}`)
})
