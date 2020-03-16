var Movie = require("../models/movie");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkMovieOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            Movie.findById(req.params.id, function(err, foundMovie) {
                if(err){
                    res.redirect("back");
                } else {
                    if(foundMovie.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You are not authorised to do so");
                        res.redirect("/movies");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    }

middlewareObj.checkCommentOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, foundComment) {
                if(err){
                    res.redirect("back");
                } else {
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }
                }
            });
        }
    }

   middlewareObj.isLoggedIn = function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You are not logged in");
        res.redirect("/login");
    }
    
    module.exports = middlewareObj;