const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  _id: String, // e.g., "template-001"
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  color: { type: String, default: "gray" }
});

module.exports = mongoose.model('EventTemplate', templateSchema);
