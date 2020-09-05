const User=require('../models/user');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcrypt');
passport.use(new LocalStrategy({
    usernameField:'email',passReqToCallback:true},function(req,email,password,done){
        //find a user and establish identity
        User.findOne({email:email},function(err,user){
            if(err)
            {
                console.log("Error in finding user");
                req.flash('error',err);
                return done(err);
            }

            if(!user){
                console.log("Invalid Username/Password");
                req.flash('error','Invalid Username/Password');
                return done(null,false);
            }

            //checking if user entered pwd matches with db password, by first decrypting the db password
            bcrypt.compare(password, user.password, function(err, res) {
                if(res) {
                    return done(null,user);
                } 
                else {
                    console.log("Invalid Username/Password");
                    req.flash('error','Invalid Username/Password');
                    return done(null,false);
                } 
              });
            
            
        })
}));

//serializing the user to decide which key is to be kept in cookie
passport.serializeUser(function(user,done){
    done(null,user.id)
})

//deserlizing the user from the key in the cookie
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err)
        {
            console.log('Error in finding user');
            return done(err);
        }
        return done(null,user);
    })
})

passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    //if not signin then redirect to login
    return res.redirect('/signIn');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;