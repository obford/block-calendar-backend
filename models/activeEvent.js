const mongoose = require('mongoose');

const activeEventSchema = new mongoose.Schema({
  _id: String, // e.g., "ae-001"
  templateId: String,
  name: { type: String, required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  startTime: { type: String, required: true }, // "HH:mm"
  duration: { type: Number, required: true },
  color: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActiveEvent', activeEventSchema);
