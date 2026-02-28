require ('dotenv').config();

const cors = require('cors');
const express = require('express');
const autRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const { verifyToken, verifyAdmin } = require('./middleware/auth');

const fs = require('fs');
const path = require('path');

function loadTask() {
    const tasksFilePath = path.join(__dirname, '..', 'data', 'task.json');
    return JSON.parse(fs.readFileSync(tasksFilePath, 'utf-8'));
};



// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000; // Port par défaut si non spécifié dans les variables d'environnement

// Configuration CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', './pages');

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes utilisés par l'API REST
app.use('/auth', autRoutes);
app.use('/tasks', taskRoutes);

// Route pour la page de connexion interne à l'API REST
app.get('/login', (req, res) => {
    res.render('auth-login');
});

// Route pour la page de tâches | Accessible uniquement aux utilisateurs authentifiés et ayant le rôle d'administrateur
app.get('/taskpage', verifyToken, verifyAdmin, (req, res) => {
   try {
        res.render('taskpage');
    } catch (err) {
        res.status(500).json({ error: 'Failed to load task page' });
    }
});

app.get('/taskadd', verifyToken, verifyAdmin, (req, res) => {
   try {
        const tasks = loadTask();
        res.render('taskadd');
    } catch (err) {
        res.status(500).json({ error: 'Failed to load task add page' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});