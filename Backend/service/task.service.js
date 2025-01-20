const { Task } = require("../models/task.model");

const findByName = async (name) => {
    if (!name) throw new Error("Email is required");
    return await Task.findOne({ name });
};

const findAll = async () => {
    return await Task.find();
};

const findById = async (id) => {
    if (!id) throw new Error("ID is required");
    return await Task.findById(id);
};

const create = async (taskData) => {
    if (!taskData || !taskData.name || !taskData.description || !taskData.assignedTo || !taskData.deadline) {
        throw new Error("Missing required task fields");
    }
    const task = new Task(taskData);
    return await task.save();
};

const edit = async (id, updateData) => {
    if (!id || !updateData) throw new Error("ID and update data are required");
    return await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteTask = async (id) => {
    if (!id) throw new Error("ID is required");
    return await Task.findByIdAndDelete(id);
};

module.exports = { findByName, findAll, findById, create, edit, deleteTask };
