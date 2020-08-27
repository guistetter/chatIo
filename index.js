const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise 

app.set('view engine', 'ejs')

app.get('/',(req, res) => {
  res.send('ola')
})

//servidor só inicia apos o mongo iniciar
mongoose.connect('mongodb://localhost/chat-socketio',{
  useMongoClient: true
}).then(() =>{
  app.listen(3000,() => {
    console.log('chat running')
  })
})

