const {Router} = require('express');
const router = Router();
const {loginController,signupController,profileController,logoutController} = require('../controller/user.controller');
const auth = require('../middleware/userAuth');


router.post('/signup',async (req,res)=>{
    signupController(req,res);
});

router.post('/login', async (req, res) => {
    loginController(req, res);
});

router.get('/logout', async (req, res) => {
    logoutController(req, res);
});

router.get('/profile',auth, async (req, res) => {
    profileController(req, res);
});


module.exports = router;