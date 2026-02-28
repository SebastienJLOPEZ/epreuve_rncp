const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

const fs = require('fs');
const path = require('path');

function loadTask() {
    const tasksFilePath = path.join(__dirname, '..', 'data', 'task.json');
    return JSON.parse(fs.readFileSync(tasksFilePath, 'utf-8'));
};

// Créer une nouvelle tâche
router.post('/' , (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
     if (!accessToken) {
        return res.status(401).json({ error: 'Access token is missing' });
     }
    const {title, description, status} = req.body;
    try {
         const tasks = loadTask();

         if (!title) {
            return res.status(400).json({ error: 'Title is required' });
         }
        
         const content = {
            title: title,
            description: description,
            status: status
         }

         if (!content.status) content.status = "todo";

         const newTask = new Task(tasks.length + 1, content.title, content.description, content.status);
         tasks.push(newTask);
         fs.writeFileSync(path.join(__dirname, '..', 'data', 'tasks.json'), JSON.stringify(tasks, null, 2));
         res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Récupérer toutes les tâches, filtrable par statut (todo, in-progress, done)
router.get('/', (req, res) => {
    try {

        // Filtrage par statut si le paramètre est présent
        const { status } = req.query;
        let tasks = loadTask();
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load tasks' });
    }
});

// Récupérer une tâche par ID (but d'édition)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const tasks = loadTask();
        const task = tasks.find(task => task.id === parseInt(id));
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load task' });
    }
});

// Mettre à jour une tâche par ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const tasks = loadTask();
        const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        tasks[taskIndex] = { id: parseInt(id), title, description, status };
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'tasks.json'), JSON.stringify(tasks, null, 2));
        res.json(tasks[taskIndex]);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Supprimer une tâche par ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const tasks = loadTask();
        const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const deletedTask = tasks.splice(taskIndex, 1)[0];
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'tasks.json'), JSON.stringify(tasks, null, 2));
        res.json(deletedTask);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;