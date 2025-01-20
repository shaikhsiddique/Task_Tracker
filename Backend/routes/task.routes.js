const { Router } = require('express');
const router = Router();
const upload = require('../config/multer')
const taskController = require('../controller/task.controller');
const auth = require('../middleware/userAuth');



router.post("/create",auth,upload, async (req,res)=>{
   taskController.createTaskController(req,res);
})

router.put("/edit/:id", async (req,res)=>{
    
})

router.delete("/delete/:id", async (req,res)=>{
    
})

router.get("/all", async (req,res)=>{
    
})

router.get("/today", async (req,res)=>{
    
})

router.get("/upcoming", async (req,res)=>{
    
})

router.get("/:id", async (req,res)=>{
    
})




module.exports = router;