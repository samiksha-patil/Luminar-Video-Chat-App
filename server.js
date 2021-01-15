const path =require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
//const { v1: uuidV1 } = require('uuid')
const port = process.env.PORT || 3000
const users= []

const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs')
  })


 


  app.get('/:name/:room', (req, res) => {
    console.log(req.params.name)
    console.log(req.params.room)

    res.render('room', { roomId: req.params.room, name:req.params.name })
    
  })

  
  io.on('connection', socket => {
    socket.on('join-room', (roomId, userId,name) => {
      p={ roomId, name }
      x =users.push(p)

      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId)
      io.to(roomId).emit("participants", name,users,roomId);
      socket.on("message", (message) => {
        io.to(roomId).emit("createMessage", message,name);
      })
     
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
  })
  

server.listen(port)