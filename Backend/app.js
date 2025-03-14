const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const cors = require('cors');
const cookie_parser = require('cookie-parser');
const morgan = require('morgan');
const sendNotification = require('./config/notification');

const userRouter = require('./routes/user.routes');
const taskRouter = require('./routes/task.routes');
const workspaceRouter = require('./routes/workspace.routes');
const notificationRouter = require('./routes/notification.routes');

const { updateTaskStatus } = require('./config/deadline');

// CORS configuration
const corsOptions = {
    origin: "https://task-tracker-cyan-alpha.vercel.app",
    credentials: true, 
    optionsSuccessStatus: 200
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookie_parser());

db();
updateTaskStatus();
sendNotification();

app.use("/user", userRouter);
app.use("/task", taskRouter);
app.use('/workspace', workspaceRouter);
app.use("/notification", notificationRouter);

module.exports = app;
