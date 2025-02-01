const { Task, validateTask } = require('../models/task.model');
const { userModel } = require('../models/user.model');
const taskService = require('../service/task.service');


const createTaskController = async (req, res) => {
    try {
        let { name, description, deadline, tag, assignedTo } = req.body;

        if (!assignedTo) {
            assignedTo = req.user._id;
        }
        const { error } = validateTask({ name, description, deadline, tag, assignedTo });
        if (error) return res.status(400).json({ error: error.details[0].message });

        let attachment;
        if (req.files && req.files.length > 0) {
            attachment = req.files[0].publicUrl;
        }

        const data = {
            name,
            description,
            deadline,
            attachment,
            tag,
            assignedTo,
            assignedBy: req.user._id,
        };

        const existingTask = await taskService.findByName(name);
        if (existingTask) {
            return res.status(400).json({ error: "A task with this name already exists" });
        }

        const task = await taskService.create(data);
        let user = await userModel.findById(req.user._id);
        user.tasks.push(task._id);
        await user.save();

        res.status(201).json({ message: "Task created successfully", task });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

const editTaskController = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, description, deadline, tag, assignedTo } = req.body;
        const existingTask = await taskService.findById(id);
        if (!existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        assignedTo = assignedTo || existingTask.assignedTo;
        name = name || existingTask.name;
        description = description || existingTask.description;
        tag = tag || existingTask.tag;
        deadline = deadline || existingTask.deadline;

        const { error } = validateTask({ name, description, deadline, tag, assignedTo });
        if (error) return res.status(400).json({ error: error.details[0].message });

        let attachment = existingTask.attachment;
        if (req.files.length > 0) {
            attachment = req.files[0].publicUrl;
        }

        const data = {
            name,
            description,
            deadline,
            attachment,
            tag,
            assignedTo,
            assignedBy: req.user._id,
        };
        const updatedTask = await taskService.edit(id, data);
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

const deleteTaskController = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        await taskService.deleteTask(id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

const getAllTaskController = async (req, res) => {
    try {
        const task = await taskService.findAll();

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task retrived successfully",task });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

const getByIdTaskController = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task retrived successfully",task });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

const getTodayTaskController = async (req, res) => {
    try {
        const tasks = await taskService.findAll();

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ error: "No tasks found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayTasks = tasks.filter(task => {
            const taskDeadline = new Date(task.deadline);
            taskDeadline.setHours(0, 0, 0, 0);
            return taskDeadline.getTime() === today.getTime();
        });

        res.status(200).json({ message: "Tasks retrieved successfully", tasks: todayTasks });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

const getUpcomingTasksController = async (req, res) => {
    try {
        const tasks = await taskService.findAll();

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ error: "No tasks found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingTasks = tasks.filter(task => {
            const taskDeadline = new Date(task.deadline);
            taskDeadline.setHours(0, 0, 0, 0);
            return taskDeadline > today;
        }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        res.status(200).json({ message: "Upcoming tasks retrieved successfully", tasks: upcomingTasks });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};



module.exports = { createTaskController , editTaskController , deleteTaskController ,getAllTaskController ,getByIdTaskController , getTodayTaskController , getUpcomingTasksController };
