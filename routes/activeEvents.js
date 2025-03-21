const express = require('express');
const router = express.Router();
const ActiveEvent = require('../models/activeEvent');
const Template = require('../models/eventTemplate');
const { v4: uuidv4 } = require('uuid');

// Helper: convert "HH:mm" to total minutes
const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// GET /api/active-events
// Optional query param: ?date=YYYY-MM-DD
router.get('/', async (req, res) => {
  const filter = {};

  // Add filter by date if provided
  if (req.query.date) {
    filter.date = req.query.date; // e.g., "2025-03-21"
  }

  try {
    const events = await ActiveEvent.find(filter).sort({ date: 1, startTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/active-events
router.post('/', async (req, res) => {
  const { templateId, date, startTime } = req.body;

  if (!templateId || !date || !startTime) {
    return res.status(400).json({ message: 'Missing required fields: templateId, date, startTime.' });
  }

  try {
    // 1. Find template
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found.' });

    const duration = template.duration;
    const newStart = timeToMinutes(startTime);
    const newEnd = newStart + duration;

    // 2. Check for overlaps
    const sameDayEvents = await ActiveEvent.find({ date });
    for (const event of sameDayEvents) {
      const evStart = timeToMinutes(event.startTime);
      const evEnd = evStart + event.duration;

      if (newStart < evEnd && newEnd > evStart) {
        return res.status(400).json({ message: 'Event overlaps with another scheduled event.' });
      }
    }

    // 3. Optional: enforce time range (05:00–22:00)
    const dayStart = 5 * 60;
    const dayEnd = 22 * 60;
    if (newStart < dayStart || newEnd > dayEnd) {
      return res.status(400).json({ message: 'Event must be between 05:00 and 22:00.' });
    }

    // 4. Create and save new active event
    const activeEvent = new ActiveEvent({
      _id: `ae-${uuidv4()}`,
      templateId,
      name: template.name,
      duration,
      color: template.color,
      date,
      startTime
    });

    await activeEvent.save();
    res.status(201).json({ message: 'Event scheduled successfully.', event: activeEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/active-events/:id
router.post('/:id', async (req, res) => {
    const { date, startTime, duration } = req.body;
  
    if (!date || !startTime) {
      return res.status(400).json({ message: 'Missing required fields: date and startTime.' });
    }
  
    try {
      const event = await ActiveEvent.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Active event not found.' });
  
      const newStart = timeToMinutes(startTime);
      const newEnd = newStart + (duration || event.duration);
  
      // Check for overlaps on the new date
      const sameDayEvents = await ActiveEvent.find({ date });
  
      for (const other of sameDayEvents) {
        if (other._id === event._id) continue;
  
        const otherStart = timeToMinutes(other.startTime);
        const otherEnd = otherStart + other.duration;
  
        if (newStart < otherEnd && newEnd > otherStart) {
          return res.status(400).json({ message: 'Updated event overlaps with another scheduled event.' });
        }
      }
  
      // Optional: time bounds check
      const dayStart = 5 * 60;
      const dayEnd = 22 * 60;
      if (newStart < dayStart || newEnd > dayEnd) {
        return res.status(400).json({ message: 'Event must be between 05:00 and 22:00.' });
      }
  
      // Update the fields
      event.date = date;
      event.startTime = startTime;
      if (duration) event.duration = duration;
  
      await event.save();
      res.json({ message: 'Active event updated successfully.', event });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

  
// DELETE /api/active-events/:id
router.delete('/:id', async (req, res) => {
    try {
      const deleted = await ActiveEvent.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Active event not found.' });
      }
  
      res.json({ message: 'Active event deleted successfully.', event: deleted });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  

module.exports = router;
