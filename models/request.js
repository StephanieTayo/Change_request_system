const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  projectid:String,
  name: String,
  email :{ type: String, unique: true },
  address: String,
  
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
