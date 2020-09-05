const Post = require('../models/post');
const Comment=require('../models/comment');
const express = require('express');
const Like = require('../models/like');

//post creation
module.exports.create = async function(req,res){
    try{
        Post.uploadPostImg(req,res,async function(err){

            try{
            if(err)
            {
                 console.log("Multer error ",err);
                 return;
            }
            let img;
            if(req.file){
                img= Post.postImgPath+'/'+req.file.filename;
            }
            let post = await Post.create({
                content: req.body.content,
                user: req.user._id,
                postImg: img
            });
            
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post:post,
                        user:req.user
                    },
                    message:"Post created!"
                })
            }
            return res.redirect('back');
        }

        catch(err)
        {
            console.log('Error while posting:',err);
            return;
        }

        })
       
    }

    catch(err)
    {
        console.log('Error while posting:',err);
        return;
    }
}

//delete post
module.exports.destroy = async function(req,res){
    try{    
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();
            console.log("inside delete post comments")
            await Comment.deleteMany({post:req.params.id}); 
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

        }
        if(req.xhr){
            return res.status(200).json({
                data:{
                    postId:req.params.id
                },
                message:"Post deleted"
            });
        }
        return res.redirect('back');
    }

    catch(err){
        console.log('Error while posting:',err);
        return;
    }
}