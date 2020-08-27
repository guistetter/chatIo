const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise 

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/',(req, res) => {
  res.render('home')
})

//servidor só inicia apos o mongo iniciar
mongoose.connect('mongodb://localhost/chat-socketio',{
  useMongoClient: true
}).then(() =>{
  app.listen(3000,() => {
    console.log('chat running')
  })
})

