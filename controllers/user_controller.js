const User = require('../models/user');
const Post = require('../models/post');
module.exports.profile=async function(req,res){

     try{
          let postNcomment = await Post.find({})
          // .sort('_createdAt')
          .populate('user')
          .populate({
               path:'comments',
               populate:{
                    path:'user'
               }
          })
          console.log("helasdasdlo",postNcomment);
          if(postNcomment){
               return res.render('profile',{
                         title: "User profile",
                         posts: postNcomment
                    });
          }
       }
     catch(err)
     {
         console.log("Error in fetching posts ",err);
         return;
     } 
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
     return res.redirect('/users/profile');
};

module.exports.destroySession = function(req,res){
     req.logout();
     return res.redirect('/signIn');
}