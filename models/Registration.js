const mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  registerDate: Date
})

mongoose.model('registration', registrationSchema)