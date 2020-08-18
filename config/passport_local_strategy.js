const User=require('../models/user');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField:'email'},function(email,password,done){
        //find a user and establish identity
        User.findOne({email:email},function(err,user){
            if(err)
            {
                console.log("Error in finding user");
                return done(err);
            }
            //checking if user entered pwd matches with db password, by first decrypting the db password
            if(!user || password!=user.password){
                console.log("Invalid Username/Password");
                return done(null,false);
            }
            return done(null,user);
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
    return res.redirect('/users/signIn');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;