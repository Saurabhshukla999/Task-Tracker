// backend/server.js
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks'); // Import the new router
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Use the tasks router for all /api/tasks requests
app.use('/api/tasks', tasksRouter);

// Basic root route (optional)
app.get('/', (req, res) => {
    res.send('Task Tracker Backend API is running!');
});

// Global Error Handler (optional, but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', success: false });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});