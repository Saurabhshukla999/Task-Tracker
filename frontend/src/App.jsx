import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [loading , setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchTasks();
  }, []);
 
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success){
        setTasks(response.data.data);
      } else{
        setError(response.data.message || ' failed to fetch tasks')
      }
    } catch(err) {
      setError('failed to connect to backend API');
      console.error('Error fetching tasks',err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault();
    if(!newTaskName.trim()){
      alert('task name is required');
      return;
    }
    try {
      const response = await axios.post(API_URL, {name: newTaskName});
      if(response.data.success){
        setTasks([...tasks,response.data.data])
      }else {
                setError(response.data.message || 'Failed to add task');
            }
        } catch (err) {
            setError('Error adding task.');
            console.error('Error adding task:', err);
        }
  }
  const handleDeleteTask = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            if (response.data.success) {
                setTasks(tasks.filter(task => task.id !== id));
            } else {
                setError(response.data.message || 'Failed to delete task');
            }
        } catch (err) {
            setError('Error deleting task.');
            console.error('Error deleting task:', err);
        }
    };

    // Mark as Done (PUT)
    const handleMarkAsDone = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/done`);
            if (response.data.success) {
                setTasks(tasks.map(task =>
                    task.id === id ? { ...task, completed: true, completedAt: response.data.data.completedAt } : task
                ));
            } else {
                setError(response.data.message || 'Failed to mark task as done');
            }
        } catch (err) {
            setError('Error marking task as done.');
            console.error('Error marking task as done:', err);
        }
    };

    if (loading) {
        return <div className="container">Loading tasks...</div>;
    }

    if (error) {
        return <div className="container error">Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1>Task Tracker</h1>

            <form onSubmit={handleAddTask} className="add-task-form">
                <input
                    type="text"
                    placeholder="New task name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                />
                <button type="submit">Add Task</button>
            </form>

            <ul className="task-list">
                {tasks.length === 0 ? (
                    <li className="no-tasks">No tasks yet! Add one above.</li>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className={task.completed ? 'task-item completed' : 'task-item'}>
                            <span>{task.name}</span>
                            {task.completed && <span className="completed-at"> (Done: {new Date(task.completedAt).toLocaleString()})</span>}
                            <div className="task-actions">
                                {!task.completed && (
                                    <button onClick={() => handleMarkAsDone(task.id)} className="mark-done-btn">
                                        Mark Done
                                    </button>
                                )}
                                <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default App
