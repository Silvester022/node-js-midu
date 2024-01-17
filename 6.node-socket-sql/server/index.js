import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io';
import { createServer } from 'node:http';
import 'dotenv/config';
import { createClient } from '@libsql/client';

const port = process.env.PORT ?? 3000

const app = express()
app.use(logger('dev'))

const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: {}
  }
})

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_AUTH_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT
  )
`)

io.on('connection', async(socket) => {
  console.log('a user has connected');

  socket.on('disconnect', () => {
    console.log('an user has disconnected');
  })

  socket.on('chat message', async(msg) => {
    let result 
    const username = socket.handshake.auth.username ?? 'anonymous'
    
    try {
      result = await db.execute({
        sql: `INSERT INTO messages (content, user) VALUES (:msg, :username)`,
        args: { msg, username }
      })
    } catch (e) {
      console.error(e);
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
  })

  if(!socket.recovered) {
    try {
      const results = await db.execute({
        sql: `SELECT id, content, user FROM messages WHERE id > ?`,
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => {
        socket.emit('chat message', row.content, row.id.toString(), row.user)
      })
    
    } catch (e) {
      console.error(e);
      return
    }
  }
})

app.get('/', (req, res) => {
  // cwd -> current working directory - carpeta en la que se ha iniciado el proceso
  res.sendFile(process.cwd() + '/client/index.html' )
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})