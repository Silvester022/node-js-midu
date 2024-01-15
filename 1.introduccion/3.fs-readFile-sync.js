const fs = require('node')

console.log('leyendo el primer archivo...')
const text = fs.readFileSync('./archivo.txt', 'utf-8')
console.log(text)

console.log('hacer cosas mientras lee el archivo')

console.log('leyendo el segundo archivo...')
const secondText = fs.readFileSync('./archivo2.txt', 'utf-8')
console.log(secondText)
