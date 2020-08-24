const express=require('express');
const passport=require('passport');
const router=express.Router();
const userController=require('../controllers/user_controller');
router.get('/profile',passport.checkAuthentication,userController.profile);
router.post('/create',userController.create);
router.post('/createSession',passport.authenticate('local',{failureRedirect:'/users/signIn'}),userController.createSession);
router.get('/signOut',userController.destroySession);
module.exports=router;