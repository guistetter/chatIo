const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise 
require('dotenv/config')

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

//servidor só inicia apos o mongo iniciar
mongoose.connect('mongodb://localhost/chat-socketio',{
  useMongoClient: true
}).then(() =>{
  app.listen(3000,() => {
    console.log('chat running')
  })
})

