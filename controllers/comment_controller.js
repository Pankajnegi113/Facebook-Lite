const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');

//create comments
module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post)
        if(post)
        {
            let comment = await Comment.create({
                    content: req.body.content,
                    user:req.user._id,
                    post: req.body.post
                });
            post.comments.push(comment);
            post.save();
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment:comment
                    },
                    message:"Post deleted"
                });
            }
            res.redirect('back');
        }
    }

    catch(err)
    {
        console.log('Error while posting:',err);
        return
    }
}

//delete comment
module.exports.destroy = async function(req,res){
    try{    
        console.log(req.params.id);
        let comment = await Comment.findById(req.params.id);
        console.log("cghv  hv ",comment);
            let postId = comment.post;
            comment.remove();
            await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});

            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        commentId:req.params.id
                    },
                    message:"Comment deleted"
                });
            }
        return res.redirect('back');
    }

    catch(err){
        console.log('Error while posting:',err);
        return;
    }
}