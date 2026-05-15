const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const columnRoutes = require('./routes/column.routes');
const pomodoroRoutes = require('./routes/pomodoro.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Robust CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

module.exports = app;
