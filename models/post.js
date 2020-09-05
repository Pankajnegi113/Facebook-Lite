const mongoose = require('mongoose');
const multer=require('multer');
const path=require('path');
const POST_IMG_PATH=path.join('/uploads/posts')
const postSchema = new mongoose.Schema(
    {
        content: {
            type : String,
            // required:true
        },
        user: {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        postImg:{
            type:String,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'Comment'
            }
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Like'
            }
        ]
    },
    {
        timestamps : true
    });

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',POST_IMG_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
})

postSchema.statics.uploadPostImg = multer({storage:storage}).single('postImg');
postSchema.statics.postImgPath= POST_IMG_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;