const { platform, release, arch, cpus, freemem, totalmem, uptime } = require('node:os')

console.log('Información del sistema operativo')
console.log('----------------')

console.log('Nombre del sistema operativo', platform())
console.log('Version del sistema operativo', release())
console.log('Arquitectura del sistema operativo', arch())
console.log('cpus', cpus()) // <- vamos a poder escalar procesos en node
console.log('memoria libre', freemem() / 1024 / 1024)
console.log('memoria total', totalmem() / 1024 / 1024)
console.log('uptime', uptime() / 60 / 60)
