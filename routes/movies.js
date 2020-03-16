var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");
var middleware = require("../middleware");

router.get('/', (req, res)=> {
    Movie.find({}, function(err, movies) {
        if(err)
            console.log(err);
        else
            res.render("movies/index", {movies: movies}); 
    });
});

router.post('/', middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var cast = req.body.cast;
    var director = req.body.director;
    var year = req.body.year;
    var author = { username: req.user.username, id: req.user._id};
    var newMovie = {name: name, image: image, description: desc, cast: cast, director: director, 
                    year: year, author: author};
    Movie.create(newMovie, function(err, newMovie){
        if(err) {
            console.log("You got an error");
        } else {
            res.redirect("/movies");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("movies/new");
});

router.get("/:id/edit", middleware.checkMovieOwnership, function(req, res){
    Movie.findById(req.params.id, function(err, foundMovie){
        res.render("movies/edit", {movie: foundMovie});
    });
});

router.put("/:id", middleware.checkMovieOwnership, function(req, res){
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedMovie){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/movies/" + req.params.id);
        }
    });
});

router.get("/:id", function(req, res) {
    Movie.findById(req.params.id).populate("comments").exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
    //        console.log(foundMovie);
            res.render("movies/show", {movie: foundMovie});
        }
    });
});

router.delete("/:id", middleware.checkMovieOwnership, function(req, res){
    Movie.findByIdAndDelete(req.params.id, function(err, movie){
        if(err){
            console.log(err);
        } else {
            res.redirect("/movies");
        }
    });
});

module.exports = router;