const Comment = require('../models/comment');
const Post = require('../models/post');

//user signout
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You have logged out');
    return res.redirect('/signIn');
}

//user profile data
module.exports.userProfile = async function(req,res){
    try{
        let postNcomment = await Post.find({user:req.user})
        // .sort('_createdAt')
        .populate('user')
        .populate({
             path:'comments',
             populate:{
                  path:'user'
             }
        })
        if(postNcomment){
             return res.render('user-profile',{
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