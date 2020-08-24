const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.create = async function(req,res){
    try{
        console.log(req.body.post);
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
            res.redirect('back');
        }
    }

    catch(err)
    {
        console.log('Error while posting:',err);
        return
    }
}


module.exports.destroy = async function(req,res){
    try{    
        let comment = await Comment.findById(req.params.id);
        console.log(comment);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
        }
        return res.redirect('back');
    }

    catch(err){
        console.log('Error while posting:',err);
        return;
    }
}