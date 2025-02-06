const {Router} = require('express');
const auth = require('../middleware/userAuth');
const router = Router();
const notificationController = require('../controller/notification.controller');



router.post("/create",auth,async (req,res)=>{
    notificationController.createNotification(req,res);
})

router.get('/all',auth,async (req,res)=>{
    notificationController.getAllNotifications(req,res);
})

router.get('/:id',auth,async(req,res)=>{
    notificationController.getNotificationById(req,res);
})

router.delete("/:id",auth,async (req,res)=>{
    notificationController.deleteNotification(req,res);
})
router.post('/set/isNew/:id',auth, async (req,res)=>{
    notificationController.setIsNew(req,res);
})


module.exports = router;