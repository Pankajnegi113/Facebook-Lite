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