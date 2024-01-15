const fs = require('node:fs/promises')

// fs.readdir('.', (err, files) => {
//   if(err) return console.error('Error al leer el directorio', err);

//   files.forEach(file => {
//     console.log(file);
//   })
// })

// otra forma de hacerlo

fs.readdir('.')
  .then(files => {
    files.forEach(file => {
      console.log(file)
    })
  })
  .catch(err => {
    return console.error('Error al leer el directorio', err)
  })
