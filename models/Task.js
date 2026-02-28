const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '..', 'data', 'task.json');

class Task {
    constructor(id, title, description, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = Task;