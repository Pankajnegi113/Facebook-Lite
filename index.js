const express=require('express');
const { urlencoded } = require('express');
const app=express();
const port=8000;
app.use(express.static('assets'));
app.use(express.urlencoded());
app.set('view engine','ejs');
app.set('views','./views');
const db=require('./config/mongoose');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const passport=require('passport');
const passportLocal=require('./config/passport_local_strategy');


const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts);

//cookie-session management and mongoStore so that on restarting server user is still logged in
app.use(session({
    name:'authentication',
    secret:'somethingTemp',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log("Error in coonecting-mongodb setup ok")
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);


app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err)
    {
        console.log('error in running server',err);
        return;
    }

    console.log("Server is running at port ",port);
})