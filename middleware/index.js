var Blog = require("../models/blogs"); 
var Comment = require("../models/comments"); 

//all the middleware goes here 

var middlewareObj = {}; 

middlewareObj.checkBlogOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id.trim(), function(err, foundBlog){
            if(err){
                res.redirect("back"); 
                console.log(err); 
            } else {
                //does user own the blog
                if(foundBlog.author.id.equals(req.user._id)){
                    next(); 
                } else {
                    req.flash("error", "You need to be logged in")
                    res.redirect("back"); 
                }
            }
        }); 
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.id.trim(), function(err, foundComment){
            if(err){
                req.flash("error", "Campground not found")
                res.redirect("back");
                console.log(err); 
            } else {
                //does user own  the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }        
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next(); 
    }
    req.flash("error", "You need to login in")
    res.redirect("/login")
}

module.exports = middlewareObj;  