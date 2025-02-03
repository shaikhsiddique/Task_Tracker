const { Router } = require('express');
const router = Router();
const upload = require('../config/multer')
const taskController = require('../controller/task.controller');
const auth = require('../middleware/userAuth');



router.post("/create",auth,upload, async (req,res)=>{
   taskController.createTaskController(req,res);
})

router.post("/edit/:id",auth,upload, async (req,res)=>{
    taskController.editTaskController(req,res);
})

router.delete("/delete/:id",auth, async (req,res)=>{
   
    taskController.deleteTaskController(req,res);
})

router.get("/all",auth, async (req,res)=>{
    taskController.getAllTaskController(req,res);
})

router.get("/today",auth, async (req,res)=>{
    taskController.getTodayTaskController(req,res);
})

router.get("/upcoming",auth, async (req,res)=>{
    taskController.getUpcomingTasksController(req,res);
})

router.get("/:id",auth, async (req,res)=>{
    taskController.getByIdTaskController(req,res);
})
router.post("/mark-complete/:id",auth,async (req,res)=>{
    taskController.markCompleteTaskController(req,res);
})



module.exports = router;