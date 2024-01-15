const path = require('node:path')

// barra separadora de carpetas segun SO
console.log(path.sep)

// unir rutas con path.join
const filePath = path.join('/content', 'subfolder', 'text.txt')
console.log(filePath)

// da el nombre del fichero con extension
const base = path.basename('tmp/hw-secret/password.txt')
console.log(base)

// da el nombre del fichero si extension
const filename = path.basename('tmp/hw-secret/password.txt', '.txt')
console.log(filename)

// da la extension
const extension = path.extname('tmp/hw-secret/password.txt')
console.log(extension)
