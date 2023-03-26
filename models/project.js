const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:String,
  descriptioon: String,
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
