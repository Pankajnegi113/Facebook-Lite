module.exports.homeSignUp=function(req,res){
    // if(req.isAuthenticated)
    // {
    //     return res.redirect('/users/profile');
    // }
    res.render('homeSignUp',{
        title:"Codeial | Home"
    })
}

module.exports.signIn=function(req,res){
    // if(req.isAuthenticated)
    // {
    //     return res.redirect('/users/profile');
    // }
    res.render('signIn',{
        title:"Codeial | Home"
    })
    
}