const fs = require('fs');
const path = require('path');

function loadTask() {
    const tasksFilePath = path.join(__dirname, '..', 'data', 'task.json');
    return JSON.parse(fs.readFileSync(tasksFilePath, 'utf-8'));
};

module.exports = { loadTask };