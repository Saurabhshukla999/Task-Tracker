// backend/routes/tasks.js
const express = require('express');
const router = express.Router();

// Mock Database (In-memory array for now - will be replaced by MongoDB)
let tasks = [
    { id: '1', name: 'Learn React', completed: false, completedAt: null, createdAt: new Date() },
    { id: '2', name: 'Build Express API', completed: true, completedAt: new Date(), createdAt: new Date() },
];

// Helper to generate unique IDs
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Middleware to find task by ID (for cleaner route handlers)
router.param('id', (req, res, next, id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found', success: false });
    }
    req.task = task;
    next();
});

// GET /api/tasks - List all tasks
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Tasks fetched successfully',
        data: tasks,
        success: true
    });
});

// POST /api/tasks - Add a new task
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Task name is required', success: false });
    }
    const newTask = {
        id: generateId(),
        name,
        completed: false,
        completedAt: null,
        createdAt: new Date(),
    };
    tasks.push(newTask);
    res.status(201).json({
        message: 'Task added successfully',
        data: newTask,
        success: true
    });
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    if (tasks.length === initialLength) {
         // This case should ideally be caught by router.param, but good for redundancy
        return res.status(404).json({ message: 'Task not found', success: false });
    }
    res.status(200).json({
        message: 'Task deleted successfully',
        data: { id },
        success: true
    });
});

// PUT /api/tasks/:id/done - Mark a task as done
router.put('/:id/done', (req, res) => {
    const task = req.task; // From router.param
    if (task.completed) {
        return res.status(400).json({ message: 'Task is already completed', success: false });
    }
    task.completed = true;
    task.completedAt = new Date();
    res.status(200).json({
        message: 'Task marked as done successfully',
        data: task,
        success: true
    });
});

// NEW: PUT /api/tasks/:id - Update Task Name
router.put('/:id', (req, res) => {
    const task = req.task; // From router.param
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'New task name is required', success: false });
    }

    task.name = name;
    res.status(200).json({
        message: 'Task name updated successfully',
        data: task,
        success: true
    });
});

module.exports = router;