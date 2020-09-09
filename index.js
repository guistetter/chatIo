const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise 
require('dotenv/config')
const http = require('http').Server(app)
const io = require('socket.io')(http)

const Room = require('./models/room')

app.use(express.static('public'))
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded())
app.set('view engine', 'ejs')
app.use(session({
  secret: 'meuSegredo',
  name:"sessionID",
  cookie: {
    maxAge: 10*60*1000
  }
}))

app.get('/',(req, res) => {
  res.render('home')
})

app.post('/', (req, res) => {
  //auth - criarei depois... 
  console.log(req.body.name)
  req.session.user = {
    name: req.body.name
  }
  res.redirect('/room')
})

app.get('/room', (req, res) => {
  if(!req.session.user){
    res.redirect('/')
  } else {
    //res.send(req.session)
    res.render('room', {
      name: req.session.user.name
    })
  }
})

//pegando o evento de conexao, tratar e criar a sala
io.on('connection', socket => {
    //pegando as salas e enviando pro usuario
  Room.find({},(err, rooms) =>{
    socket.emit('rooList', rooms)
  })
    //salvando a nova sala no banco
  socket.on('addRoom',roomName =>{
    console.log('addRoomm', roomName)
    const room = new Room({
      name: roomName
    })
    room.save()
    .then(() =>{
      io.emit('newRoom', room)
    })
  })
})

//servidor só inicia apos o mongo iniciar
mongoose.connect('mongodb://localhost/chat-socketio',{
  useMongoClient: true
}).then(() =>{
  http.listen(3000,() => {
    console.log('chat running')
  })
})

