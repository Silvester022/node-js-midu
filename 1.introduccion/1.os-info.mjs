import os from 'node:os'

console.log('Información del sistema operativo')
console.log('----------------')

console.log('Nombre del sistema operativo', os.platform())
console.log('Version del sistema operativo', os.release())
console.log('Arquitectura del sistema operativo', os.arch())
console.log('cpus', os.cpus()) // <- vamos a poder escalar procesos en node
console.log('memoria libre', os.freemem() / 1024 / 1024)
console.log('memoria total', os.totalmem() / 1024 / 1024)
console.log('uptime', os.uptime() / 60 / 60)
