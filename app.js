var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var methodOverride = require("method-override");

var User = require("./models/user");
const PORT = process.env.PORT || 5000;


var movieRoutes = require("./routes/movies");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://satyam:satyam@cluster0-iwwk2.mongodb.net/movie_review?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true 
});

//mongoose.connect("mongodb://localhost/movie_review", { useNewUrlParser: true });
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for assigned currentUsers to all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
});