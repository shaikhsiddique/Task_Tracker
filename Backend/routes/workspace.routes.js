const { Router } = require('express');
const router = Router();
const auth = require('../middleware/userAuth');
const workspaceController = require('../controller/workspace.controller');

router.get('/all',auth,async (req,res)=>{
    workspaceController.getAllWorkspacesController(req,res);
})
router.get('/:id',auth,async (req,res)=>{
    workspaceController.getWorkspaceByIdController(req,res);
})
router.post('/create',auth,async (req,res)=>{
    workspaceController.createWorkspaceController(req,res);
})

router.post('/add-member',auth,async (req,res)=>{
    workspaceController.addMembersController(req,res);
})

router.post('/remove-member',auth,async (req,res)=>{
    workspaceController.removeMemberController(req,res);
})
router.delete('/:id',auth,async (req,res)=>{
    workspaceController.deleteWorkspaceController(req,res)
})

module.exports = router;