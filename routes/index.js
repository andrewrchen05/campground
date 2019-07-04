var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var passport = require("passport");
var User    = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res){
    res.render("landing");
});

//AUTHENTICATION ROUTES

//show register form
router.get("/register", function(req, res) {
    res.render("register");
})

//handle signup logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp," + user.username + "!")
             res.redirect("/campgrounds");
        })
    })
})

//show login form
router.get("/login", function(req ,res) {
   //req.flash("success", "Welcome back, " + req.use)
    res.render("login");
})

//router.post("/login", middleware, callback)

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
	failureFlash: true
}),
    function(req, res) {

});


//LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
})

module.exports = router;