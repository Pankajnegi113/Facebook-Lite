const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');
router.get('/',homeController.homeSignUp);
router.get('/signIn', homeController.signIn);
router.use('/users',require('./users'))
module.exports=router;