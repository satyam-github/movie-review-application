var express = require("express");
var router = express.Router({mergeParams: true});
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn , function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {movie: movie});
        }
    });
});

router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, foundComment){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/edit", {movie_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        } else {
            res.redirect("/movies/" + req.params.id);
        }
    });
});

router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            res.redirect("/movies/" + req.params.id);
        }
    }); 
});

router.post("/", middleware.isLoggedIn , function(req, res) {
    Movie.findById(req.params.id, function(err, movie){
        if(err){
            console.log(err);
            res.redirect("/movies");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                movie.comments.push(comment);
                movie.save();
            //    console.log(comment);
                res.redirect('/movies/' + movie._id);
            }
         });
        }
    });
});

module.exports = router;