const User = require('../models/user');

module.exports.profile=function(req,res){
     res.render('profile',{
            title:"User profile"});
}

module.exports.create=async function(req,res){
     try{
          if(req.body.password!=req.body.confirmPassword)
          {
               console.log('pwd/confirm pwd mismatch');
               return res.redirect('back');
          }

          let user=await User.findOne({email:req.body.email});
          if(!user){
               await User.create(req.body);
               return res.redirect('/signIn');
          }
          else{
               return res.redirect('back');
          }

     }
     catch(err){
          console.log('Error',err);
     }
}

module.exports.createSession=function(req,res){
     return res.render('profile',{
          title:'User-Profile'
     })
};