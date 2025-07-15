const express = require('express');
const cors = require('cors');
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

let tasks = [
    { id: '1', name: 'Learn React', completed: false, completedAt: null, createdAt: new Date() },
    { id: '2', name: 'Build Express API', completed: true, completedAt: new Date(), createdAt: new Date() },
];
 
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

app.get('/tasks', (req, res) => {
    try {
        res.status(200).json({
            message: 'Tasks fetched successfully',
            data: tasks,
            success: true
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

app.post('/tasks', (req, res) => {
    try{
        const {name} = req.body;

        if(!name){
            return res.status(400).json({message : 'name is required', success : false});
        }
        const newTask = {
            id : generateId(), name,
            completed: false,
            completedAt : null,
            createdAt : new Date(),
        };
        tasks.push(newTask);
        res.status(201).json({ 
            message: 'task added succesfully',
            data : newTask,
            success : true
        });

    } catch (error) {
        console.error('Error adding task:' , error);
        res.status(500).json({ message: 'internal server error', success: false});
    }
});

app.delete('/tasks/:id', (req, res) => {
    try{
        const { id } = req.params;
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.id !== id);
        if (tasks.length === initialLength) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
          res.status(200).json({
            message: 'Task deleted successfully',
            data: { id },
            success: true
        }); 

    } catch (error){
        console.error('error deleting task:', error);
        res.status(500).json({message: 'Internal server error', error})
    }
});

app.put('/tasks/:id/done', (req, res) => {
    try {
        const { id } = req.params;
        const task = tasks.find(t => t.id === id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        task.completed = true;
        task.completedAt = new Date();
        res.status(200).json({
            message: 'Task marked as done successfully',
            data: task,
            success: true
        });
    } catch (error) {
        console.error('Error marking task as done:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on localhost:${PORT}`);
})