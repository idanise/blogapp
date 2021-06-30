const { RSA_NO_PADDING } = require('constants');
const { Router } = require('express');
const category = require('./models/category');

var express = require('express'),
    ejs = require('ejs'),
    request = require('request'),
    app = express(),
    bodyParser = require("body-parser"),
    path = require('path'),
    mongoose = require('mongoose'),
    flash = require("connect-flash"),
    passport= require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Blog = require("./models/blogs"), 
    Comment = require("./models/comments"),
    User = require("./models/user"),
    Category = require("./models/category"), 
    middleware = require("./middleware")
    ObjectId = mongoose.Types.ObjectId;

var blogRoutes = require("./routes/blogs");
    commentRoutes = require("./routes/comments");
    indexRoutes = require("./routes//index"); 

mongoose.connect('mongodb://localhost:27017/blog_app_v5', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + "public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: "My life is terrible now",
    resave: false, 
    saveUninitialized: false
})); 

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

//sending user data to all pages
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next();
});

//Requiring rotues
app.use(indexRoutes); 
app.use("/category/:id/blogs/:id/comments", commentRoutes); 
app.use("/category/:id/blogs", blogRoutes); 

app.listen(process.env.port || 5500, function(){
    console.log('Server has started')
}); 