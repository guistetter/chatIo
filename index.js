require('dotenv/config')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const sharedSession = require('express-socket.io-session')

const Room = require('./models/room')

mongoose.Promise = global.Promise 
app.use(express.static('public'))
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded())
app.set('view engine', 'ejs')

//compartilhar session do express com o socket para obter nome do usuario mais afrente
const session = session({
  secret: 'meuSegredo',
  name:"sessionID",
  cookie: {
    maxAge: 10*60*1000
  }
})
app.use(session)
io.use(sharedSession(session,{autoSave: true}))

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
    socket.emit('roomList', rooms)
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
  //join, entrar na sala
  socket.on('join', roomId => {
    socket.join(roomId)
    console.log('join join')
  })

  socket.on('sendMsg', msg =>{
    console.log(msg)
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

