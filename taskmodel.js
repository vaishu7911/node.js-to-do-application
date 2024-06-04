const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: ObjectId,
    ref: 'login',
    required: true
  },
  completed: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;