require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const templateRoutes = require('./routes/templates');
const activeEventRoutes = require('./routes/activeEvents');



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/active-events', activeEventRoutes);
app.use('/api/templates', templateRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
