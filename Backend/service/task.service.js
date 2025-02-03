const { taskModel } = require("../models/task.model");

const findByName = async (name) => {
    try {
        if (!name) throw new Error("Name is required");
        const task = await taskModel.findOne({ name });
        if (!task) throw new Error("Task not found");
        return task;
    } catch (error) {
        throw new Error(error.message);
    }
};

const findAll = async () => {
    try {
        return await taskModel.find();
    } catch (error) {
        throw new Error(error.message);
    }
};

const findById = async (id) => {
    try {
        if (!id) throw new Error("ID is required");
        const task = await taskModel.findById(id);
        if (!task) throw new Error("Task not found");
        return task;
    } catch (error) {
        throw new Error(error.message);
    }
};

const create = async (taskData) => {
    try {
        if (!taskData || !taskData.name || !taskData.description || !taskData.assignedTo || !taskData.deadline) {
            throw new Error("Missing required task fields");
        }
        const task = new taskModel(taskData);
        return await task.save();
    } catch (error) {
        throw new Error(error.message);
    }
};

const edit = async (id, updateData) => {
    try {
        if (!id) throw new Error("ID is required");
        if (!updateData || Object.keys(updateData).length === 0) throw new Error("Update data is required");
        const updatedTask = await taskModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedTask) throw new Error("Task not found");
        return updatedTask;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteTask = async (id) => {
    try {
        if (!id) throw new Error("ID is required");
        const deletedTask = await taskModel.findByIdAndDelete(id);
        if (!deletedTask) throw new Error("Task not found");
        return deletedTask;
    } catch (error) {
        throw new Error(error.message);
    }
};

const markComplete = async (id,userId) => {
    try {
        if (!id) throw new Error("ID is required");
        
        const task = await taskModel.findById(id);
        if (!task) throw new Error("Task not found");
        
        if (task.assignedTo.toString() !== userId.toString()) {
            console.log(task.assignedTo.toString(),userId.toString())
            throw new Error("Task can only be marked complete by the assigned user");
        }
        
        task.status = "completed";
        await task.save();
        return task;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { findByName, findAll, findById, create, edit, deleteTask, markComplete };
