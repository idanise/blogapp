var express = require("express"); 
var router = express.Router({mergeParams: true});
var Blog = require("../models/blogs"); 
var Comment = require("../models/comments"); 
var Category = require("../models/category"); 
var middleware = require("../middleware"); 

//=======================
//BLOG ROUTES
//=======================

//SHOW FORM TO CREATE BLOG
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find blog category by id
    Category.findById(req.params.id.trim(), function(err, category){
        if(err){
            console.log(err);
        } else {
            res.render("blog/new", {category: category})
        }
    });
});

//Blog create 
router.post("/", middleware.isLoggedIn, function(req, res){
    Category.findById(req.params.id.trim(), function(err, category){
        if(err){
            req.flash("error", "Something went wrong")
            console.log(err); 
        } else {
            var title = req.body.title; 
            var image = req.body.image; 
            var body = req.body.body; 
            var author = {
                id: req.user._id, 
                username: req.user.username
            }
            var newBlog = {title:title, image:image, body:body, author:author}
            //create new blog and save to db 
            Blog.create(newBlog, function(err, newlyCreated){
                if(err){
                    console.log(err); 
                } else {
                    newlyCreated.save()
                    category.blogs.push(newlyCreated); 
                    category.save(); 
                    req.flash("success", "Successfull added a blog")
                    res.redirect("/category/" + category._id + "/blogs"); 
                }
            });
        }
    }); 
});

//show more information about a blog
router.get("/:id", function(req, res){
    //find the blog with the correct id
    Blog.findById(req.params.id.trim()).populate("comments").exec(function(err, foundBlog){
            if(err){
                console.log(err); 
            } else {
                res.render("blog/show", {category_id: req.params.id.trim(), blog:foundBlog}); 
            }
    }); 
}); 

//Edit a blog route 
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
    Blog.findById(req.params.id.trim(), function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("blog/edit", {blog:foundBlog}); 
        }
    })
})

//Update blog route 
router.put("/", middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndUpdate(req.params.id.trim(), req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err); 
        } else {
            res.redirect("/category/:id/blogs/" + req.params.id.trim()); 
        }
    }); 
}); 


//Destroy blog route 
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
    //FindbyIdandremove
    Blog.findByIdAndRemove(req.params.id.trim(), function(err, foundBlog){
        if(err){
            res.redirect("back"); 
            console.log(err); 
        } else {
            req.flash("success", "Campground Deleted")
            res.redirect("/")
        }
    }); 
}); 

module.exports = router; 