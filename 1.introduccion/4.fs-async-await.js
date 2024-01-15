const { readFile } = require('node:fs/promises')

const init = async () => {
  console.log('leyendo el primer archivo...')

  const text = await readFile('./archivo.txt', 'utf-8')
  console.log('primer texto:', text)

  console.log('hacer cosas mientras lee el archivo')

  console.log('leyendo el segundo archivo...')

  const SecondText = await readFile('./archivo2.txt', 'utf-8')
  console.log('Segundo archivo:', SecondText)
}

init()

// IIFE inmediatly invoked function expression
// (
//   async () => {

//     console.log('leyendo el primer archivo...');

//     const text = await readFile('./archivo.txt', 'utf-8');
//     console.log('primer texto:', text);

//     console.log('hacer cosas mientras lee el archivo');

//     console.log('leyendo el segundo archivo...');

//     const SecondText = await readFile('./archivo2.txt', 'utf-8');
//     console.log('Segundo archivo:', SecondText);
//   })()
