const path =require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)


const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs')
  })


  app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
  })
  
  io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId)
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
  })
  

server.listen(3000)