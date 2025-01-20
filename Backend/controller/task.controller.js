const { Task, validateTask } = require('../models/task.model');
const taskService = require('../service/task.service');


const createTaskController = async (req, res) => {
    try {

        let { name, description, deadline, tag, assignedTo } = req.body;
        
        if (!assignedTo) {
            assignedTo = req.user._id;
        }
        let parts = deadline.split('-');
        deadline = new Date(parts[2], parts[1] - 1, parts[0]);
        
        const { error } = validateTask({ name, description, deadline, tag, assignedTo });
        if (error) return res.status(400).json({ error: error.details[0].message });

        let attachment;
        if (req.files) {
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
        res.status(201).json({ message: "Task created successfully", task });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

module.exports = { createTaskController };
