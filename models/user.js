const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars')
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        
    },
    firstname:{
        type:String,
       
    },
    lastname:{
        type:String,
        
     },
    avatar:{
        type:String,
    },
    phone:{
        type:String,
    },
    friendship: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ]
    },
  {timeStamps:true}
);


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
})

userSchema.statics.uploadAvatar = multer({storage:storage}).single('avatar');
userSchema.statics.avatarPath= AVATAR_PATH;

const User=mongoose.model('User',userSchema);
module.exports=User;