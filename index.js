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
const passportGoogle=require('./config/passport_google_oath2');

//adding flash messages
const flash=require('connect-flash');
const customMware=require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');


const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts);
app.use('/uploads',express.static(__dirname+'/uploads'));

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

//adding flash msgs
app.use(flash());
app.use(customMware.setFlash);
app.use('/',require('./routes'));

//listening to port 8000
app.listen(port,function(err){
    if(err)
    {
        console.log('error in running server',err);
        return;
    }

    console.log("Server is running at port ",port);
})