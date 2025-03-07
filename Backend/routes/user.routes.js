const {Router} = require('express');
const router = Router();
const userController = require('../controller/user.controller');
const auth = require('../middleware/userAuth');
const upload = require('../config/multer');


router.post('/signup',upload ,async (req,res)=>{
    userController.signupController(req,res);
});

router.post('/login', async (req, res) => {
    userController.loginController(req, res);
});

router.get('/logout', async (req, res) => {
    userController.logoutController(req, res);
});

router.get('/profile',auth, async (req, res) => {
    userController.profileController(req, res);
});
router.post('/update',upload ,async (req,res)=>{
    userController.updateProfileController(req,res);
});
router.get('/all',auth,async (req,res)=>{
    userController.getAllUserController(req,res);
})
router.get("/:id",auth,async (req,res)=>{
    userController.getUserByIdController(req,res);
})


module.exports = router;