const express=require('express');
const { urlencoded } = require('express');
const app=express();
const port=8000;

app.use(express.urlencoded());
app.set('view engine','ejs');
app.set('views','./views');
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err)
    {
        console.log('error in running server',err);
        return;
    }

    console.log("Server is running at port ",port);
})