const mongoose = require('mongoose')
const MessageSchema = mongoose.Schema({
  name: String 
})
const Message = mongoose.model('Message', MessageSchema)
module.exports = Message