var express = require("express"); 
var router = express.Router({mergeParams: true});
var Category = require("../models/category"); 
var passport = require("passport"); 
var User = require("../models/user"); 

//INDEX ROUTE 
router.get("/", function(req, res){
    Category.find({}, function(err, category){
        if(err){
            console.log(err); 
        } else {
            res.render("index", {category: category}) 
        }
    })
});

//=======================
//CATEGORY ROUTES
//=======================
router.get("/category/:id/blogs", function(req, res){
    //Find the different categories of blogs 
    Category.findById(req.params.id.trim()).populate("blogs").exec(function(err, foundCategory){
        if(err){
            console.log(err);
        } else {
           //render show template that will show blog in that category
           res.render("blog/blogs", {category_id: req.params.id.trim(), category: foundCategory})
        }
   });
}); 

//==============
//AUTH ROUTES 
//==============

//show register form 
router.get("/register", function(req, res){
    res.render("register"); 
}); 

//Handles registration logic 
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err); 
            return res.render("register"); 
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success",  "Welcome to Blog App")
            res.redirect("/")
        }); 
    }); 
}); 

//show login form 
router.get("/login", function(req, res){
    res.render("login"); 
}); 

//handles login logic 
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/", 
        failureRedirect: "/login"
    }), function(req, res){
}); 

//Logout route 
router.get("/logout", function(req, res){
    req.logout(); 
    req.flash("sucess", "Logged you out!")
    res.redirect("/"); 
})

module.exports = router; 