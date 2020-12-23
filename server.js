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


  

server.listen(3000)