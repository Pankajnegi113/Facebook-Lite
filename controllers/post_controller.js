const Post = require('../models/post');
const Comment=require('../models/comment');
const e = require('express');
module.exports.create = async function(req,res){
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id});
        return res.redirect('back');
    }

    catch(err)
    {
        console.log('Error while posting:',err);
        return;
    }

}

module.exports.destroy = async function(req,res){
    try{    
        let post = await Post.findById(req.params.id);
        console.log(post);
        if(post.user == req.user.id){
            post.remove();
            Comment.deleteMany({post:req.params.id}); 
        }
        return res.redirect('back');
    }

    catch(err){
        console.log('Error while posting:',err);
        return;
    }
}