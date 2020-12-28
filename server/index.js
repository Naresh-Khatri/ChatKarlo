const express = require('express')
const app = express()
const http = require('http').Server(app)
const socketio = require('socket.io')(http, { cors: { origin: '*' } })
app.use(express.static('public'))

const PORT = process.env.PORT || 8081

var count = 0

socketio.on('connection', (socket) => {
  count++
  console.log(`a user connected`)
  socket.emit('counter', { count: count })
  console.log('countering')
  console.log('connected count', count)

  setInterval(() => {
    socket.emit('counter', { count: count })
  }, 500)
  socket.on('typing', (data) => {
    console.log(data.username + ' is typing')
  })

  socket.on('message', (message) => {
    console.log(`${socket.id.substr(0, 2)} said ${JSON.stringify(message)}`)
    socketio.emit('message', JSON.stringify(message))
  })

  socket.on('disconnect', () => {
    count--
    socket.emit('counter', { count: count })
    console.log('user disconnected')
    console.log('disconnected count', count)
  })
})

http.listen(PORT, () => console.log('listening on port ' + PORT))
