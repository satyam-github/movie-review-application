var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Movie = require("../models/movie");
var passport = require("passport");
var middleware = require("../middleware");

router.get('/', (req,res)=> {
    res.redirect("/movies");
});


router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var userName = new User({username: req.body.username});
    User.register(userName, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome " + user.username);
            res.redirect("/movies");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/movies",
        failureRedirect: "/login"
    }), function(req, res){
        req.flash("success", "Successfully logged in");
});

// CHANGE PASSWORD
router.get("/change-password", middleware.isLoggedIn ,function(req,res)
{
  res.render('change-password');
});

router.post("/change-password",function(req,res)
{
  User.findById(req.user._id).exec(function(err,person)
  {
    if(err)
    {
      req.flash("errorArr",err.message);
      res.redirect("/movies");
    }
    else
    {
      if(req.body.password  == req.body.confirm)
        { // if both passwords match, then store new password, else redirect
          person.setPassword(req.body.password,function()
          {
            person.save();
            req.flash("successArr","Password Changed Successfully!");
            res.redirect("/movies");
          });
        }
        else
        { 
          req.flash("errorArr","Password was not changed because they did not match");
          res.redirect('/movies');  
        }
    }
  });
});

router.get("/profiles/:username",function(req,res)
{
    
  User.findOne({ username: req.params.username }, function(err, user)
  {
    if (!user) {
      req.flash('errorArr',"user not found!");
      res.redirect('/movies');      
    }
    else
    {
      Movie.find().populate("comments").exec(function(err,allMovies){
        if(err)
              console.log(err);
        else
        {
          Movie.find({"author.username":req.params.username}).populate("comments").exec(function(err,foundMovie)
          {
            if(err)
                console.log(err);
            else
            {
                res.render("profile",{user:user , movies:foundMovie, allMovies:allMovies});        
            }
          });
        }
      });
    }
  });
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are successfully logged out");
    res.redirect("/movies");
});

module.exports = router;