const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '..', 'data', 'users.json');

class User {
    constructor(id, email, password) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = 'user'; // Par défaut, tous les utilisateurs ont le rôle 'user'
    }
}

module.exports = User;