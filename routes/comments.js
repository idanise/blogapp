var express = require("express"); 
var router = express.Router({mergeParams: true});
var Category = require("../models/category"); 
var Blog = require("../models/blogs"); 
var Comment = require("../models/comments"); 
var middleware = require("../middleware"); 

//=======================
//COMMENT ROUTES
//=======================
router.get("/new", middleware.isLoggedIn, function(req, res){
    Blog.findById(req.params.id.trim(), function(err, foundBlog){
        if(err){
            console.log(err); 
        } else {
            res.render("comments/new", {category_id: req.params.id.trim(), blog: foundBlog})
        }
    });
});

// Comment create
router.post("/", middleware.isLoggedIn, function(req,  res){
    //look up blog using id 
    Blog.findById(req.params.id.trim(), function(err, blog){
        if(err){
            console.log(err); 
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){ 
                    req.flash("error", "Something went wrong")
                    console.log(err); 
                } else  {
                    //add username and id to comment 
                    comment.author.id = req.user._id; 
                    comment.author.username = req.user.username
                    //save comment 
                    comment.save(); 
                    blog.comments.push(comment); 
                    blog.save(); 
                    req.flash("success", "Successfull added a comment")
                    res.redirect("/category/:id/blogs/" + blog._id); 
                }
            }); 
        }
    }); 
}); 

//Comment destroy route
router.delete("/:id", middleware.checkCommentOwnership, function(req, res){
    //FindbyIdandremove
    Comment.findByIdAndRemove(req.params.id.trim(), function(err){
        if(err){
            res.redirect("back"); 
            console.log(err); 
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("back")
        }
    }); 
}); 

module.exports = router; 