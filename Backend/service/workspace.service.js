const { workspaceModel } = require('../models/workspace.model');

const getByName = async (name) => {
    try {
        if (!name) {
            return { status: 400, json: { message: "Workspace name is required" } };
        }
        let workspace = await workspaceModel.findOne({ name });
        if (workspace) {
            return { status: 200, json: workspace };
        }
        return { status: 404, json: { message: "Workspace not found" } };
    } catch (error) {
        return { status: 500, json: { message: "Internal server error", error } };
    }
};

const getById = async (id) => {
    try {
        if (!id) {
            return { status: 400, json: { message: "Workspace ID is required" } };
        }
        let workspace = await workspaceModel.findById(id);
        if (workspace) {
            return { status: 200, json: workspace };
        }
        return { status: 404, json: { message: "Workspace not found" } };
    } catch (error) {
        return { status: 500, json: { message: "Internal server error", error } };
    }
};

const getAll = async () => {
    try {
        let workspaces = await workspaceModel.find();
        return { status: 200, json: workspaces };
    } catch (error) {
        return { status: 500, json: { message: "Internal server error", error } };
    }
};

const create = async (name, admin) => {
    try {
        if (!name || !admin) {
            return { status: 400, json: { message: "Name and Admin are required" } };
        }
        let workspace = await workspaceModel.create({ name, admin });
        return workspace
    } catch (error) {
        return { status: 500, json: { message: "Internal server error", error } };
    }
};

const deleteWorkspace = async (id) => {
    try {
        if (!id) {
            return { status: 400, json: { message: "Workspace ID is required" } };
        }
        let workspace = await workspaceModel.findByIdAndDelete(id);
        if (workspace) {
            return { status: 200, json: { message: "Workspace deleted successfully" } };
        }
        return { status: 404, json: { message: "Workspace not found" } };
    } catch (error) {
        return { status: 500, json: { message: "Internal server error", error } };
    }
};

const addMember = async (workspaceId, memberIds) => {
    try {
        if (!workspaceId || !Array.isArray(memberIds) || memberIds.length === 0) {
            return { status: 400, json: { message: "Workspace ID and an array of Member IDs are required" } };
        }

        let workspace = await workspaceModel.findById(workspaceId);
        if (!workspace) {
            return { status: 404, json: { message: "Workspace not found" } };
        }

        // Loop through each memberId and add it if not already present
        for (let id of memberIds) {
            if (!workspace.members.includes(id)) {
                workspace.members.push(id);
            }
        }

        await workspace.save();

        return { status: 200, json: { message: "Members added successfully", workspace } };
    } catch (error) {
        return { status: 500, json: { message: "Internal server error", error } };
    }
};



module.exports = { getByName, getById, getAll, create, deleteWorkspace, addMember };
