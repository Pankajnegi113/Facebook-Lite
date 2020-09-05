const User = require('../models/user');
const Post = require('../models/post');
const FriendShip = require('../models/friendship');
const fs=require('fs');
const path=require('path');
const bcrypt = require('bcrypt');

//feed data of user
module.exports.feeds=async function(req,res){
     try{
          let users = await User.find({});
          let friendRequests = await FriendShip.find().populate('from_user').populate('to_user');
          let myfriends= await User.findById(req.user._id).populate('friendship');
          let postNcomment = await Post.find({})
          .sort('-createdAt')
          .populate('user')
          .populate({
               path:'comments',
               populate:{
                    path:'user'
               },
               populate:{
                    path:'likes'
               }
          }).populate('likes')

          if(postNcomment){
               return res.render('feeds', {
                         title: "User feeds",
                         posts: postNcomment,
                         users: users,
                         friendRequests : friendRequests,
                         myfriends: myfriends
                    });
          }
       }
     catch(err)
     {
         console.log("Error in fetching posts ",err);
         return;
     } 
}

//user creation on signup page
module.exports.create=async function(req,res){
     try{
          if(req.body.password!=req.body.confirmPassword)
          {
               console.log('pwd/confirm pwd mismatch');
               return res.redirect('back');
          }

          const hashedPassword = await bcrypt.hash(req.body.password, 10)
          req.body.password = hashedPassword;
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

//user login after passport storage of user details in locals
module.exports.createSession=function(req,res){
     req.flash('success','Logged in Successfully');
     return res.redirect('/users/feeds');
};

//user updation of name,email.profile pic
module.exports.update = async function(req,res){
     try{
          let user= await User.findById(req.params.id);
          User.uploadAvatar(req,res,function(err){
               if(err)
               {
                    console.log("Multer error ",err);
                    return;
               }
               user.firstname=req.body.firstname;
               user.lastname=req.body.lastname;
               user.email=req.body.email
               if(req.file){
                    if(user.avatar){
                         fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    user.avatar= User.avatarPath+'/'+req.file.filename;
               }
               user.save();
               return res.redirect('back');
         })
     }
     catch(err)
     {
          console.log("Error in uodating ",err);
          return;
     }
}

//user sends friend request
module.exports.sendRequest = async function(req,res){
     try{
          FriendShip.create({
               from_user: req.user._id,
               to_user: req.params.id
          })
          res.redirect('back');
     }
     catch(err){
          console.log("Error in sending Request ",err);
          return;
     }
}

//accepting request
module.exports.addFriend = async function(req,res){
     try{
          let current = await User.findById(req.user._id);            
          let requester = await User.findById(req.params.id);
          current.friendship.push(requester);
          current.save();  
          requester.friendship.push(current);
          requester.save();   
          await FriendShip.findOneAndRemove({from_user:req.params.id, to_user:req.user._id});
          res.redirect('back');
     }
     catch(err){
          console.log("Error in adding friend ",err);
          return;
     }
}

//remove friend from friend list
module.exports.removeFriend = async function(req,res){
     try{
          await User.findByIdAndUpdate(req.user.id,{$pull:{friendship:req.params.id}});
          await User.findByIdAndUpdate(req.params.id,{$pull:{friendship:req.user._id}});
          res.redirect('back');
     }
     catch(err){
          console.log("Error in removing friend ",err);
          return;
     }
}