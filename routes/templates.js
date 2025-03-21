const express = require('express');
const router = express.Router();
const Template = require('../models/eventTemplate');
const { v4: uuidv4 } = require('uuid');

// GET /api/templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/templates
router.post('/', async (req, res) => {
  const { name, duration, color } = req.body;

  if (!name || !duration) {
    return res.status(400).json({ message: 'Missing name or duration.' });
  }

  const newTemplate = new Template({
    _id: `template-${uuidv4()}`,
    name,
    duration,
    color: color || 'gray'
  });

  try {
    await newTemplate.save();
    res.status(201).json({ message: 'Template created', template: newTemplate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/templates/:id
router.post('/:id', async (req, res) => {
    const { name, duration, color } = req.body;
  
    try {
      const template = await Template.findById(req.params.id);
      if (!template) return res.status(404).json({ message: 'Template not found.' });
  
      if (name) template.name = name;
      if (duration) template.duration = duration;
      if (color) template.color = color;
  
      await template.save();
      res.json({ message: 'Template updated', template });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/templates/:id
router.delete('/:id', async (req, res) => {
    try {
      const template = await Template.findByIdAndDelete(req.params.id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found.' });
      }
  
      res.json({ message: 'Template deleted successfully.', template });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });  

module.exports = router;