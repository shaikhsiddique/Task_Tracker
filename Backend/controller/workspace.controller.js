const { validateWorkspace } = require('../models/workspace.model');
const workspaceService = require('../service/workspace.service');
const userService = require('../service/user.service');

const createWorkspaceController = async (req, res) => {
    try {
        let {  name,description,tag } = req.body;
        let admin = req.user;

        if (!name || !admin) {
            return res.status(400).json({ message: "Name and Admin are required" });
        }

        const { error } = validateWorkspace({ name, admin: admin._id,description,tag });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const existingWorkspace = await workspaceService.getByName(name);
        if (existingWorkspace.status === 200) {
            return res.status(400).json({ error: "Workspace with this name already exists" });
        }

        const workspace = await workspaceService.create(name, admin._id,description,tag,);
        await userService.addWorkspace(admin._id, workspace._id);
        
        const addMemberResult = await workspaceService.addMember(workspace._id, [admin._id]);
        if (addMemberResult.status !== 200) {
            return res.status(addMemberResult.status).json(addMemberResult.json);
        }

        return res.status(201).json({ message: "Workspace created successfully", workspace });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });
    }
};


const getWorkspaceByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const workspace = await workspaceService.getById(id);
        return res.status(workspace.status).json(workspace.json);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const getAllWorkspacesController = async (req, res) => {
    try {
        const workspaces = await workspaceService.getAll();
        return res.status(workspaces.status).json(workspaces.json);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const deleteWorkspaceController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await workspaceService.deleteWorkspace(id);
        return res.status(result.status).json(result.json);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const addMembersController = async (req, res) => {
    try {
        const { workspaceId, memberIds } = req.body;
        if (!workspaceId || !Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({ message: "Workspace ID and an array of Member IDs are required" });
        }
        const result = await workspaceService.addMember(workspaceId, memberIds);
        memberIds.forEach(async (memberId)=>{
            await userService.addWorkspace(memberId, workspaceId);
        })
        return res.status(result.status).json(result.json);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const removeMemberController = async (req,res) => {
    try {
        const { workspaceId, memberId } = req.body;
        if (!workspaceId ||! memberId) {
            return res.status(400).json({ message: "Workspace ID and an array of Member IDs are required" });
        }
        const result = await workspaceService.removeMember(workspaceId, memberId);
        await userService.removeWorkspace(memberId,workspaceId);
        return res.status(result.status).json(result.json);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }


}

module.exports = { 
    createWorkspaceController, 
    getWorkspaceByIdController, 
    getAllWorkspacesController, 
    deleteWorkspaceController, 
    addMembersController,
    removeMemberController 
};
