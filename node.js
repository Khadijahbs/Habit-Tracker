// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Habit = require('./models/Habit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/habit-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.get('/api/habits', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/habits', async (req, res) => {
  const habit = new Habit({
    name: req.body.name,
    category: req.body.category
  });
  
  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/api/habits/:id/complete', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    const today = new Date().toISOString().split('T')[0];
    
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
      habit.streak = habit.completedDates.length;
    }
    
    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/habits/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});