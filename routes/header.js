const express=require('express');
const passport=require('passport');
const router=express.Router();
const headerController=require('../controllers/header_controller');
router.get('/signOut',passport.checkAuthentication,headerController.destroySession);
router.get('/userProfile',passport.checkAuthentication,headerController.userProfile);
module.exports=router;