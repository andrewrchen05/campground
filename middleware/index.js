var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {    
                res.redirect("back");
            } else {
                //does user own the campground? 
                if (foundCampground.author.id.equals(req.user._id)) {
                    //res.render("campgrounds/edit", {campground: foundCampground});
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        })  
    } 
    else {
        res.redirect("back"); //go back to previous page
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error", "You need to logged in to do that!")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) { //middleware function
    if (req.isAuthenticated()) {
        //req.flash("success", "Welcome back, " + req.user);
        return next();
    }
    req.flash("error", "Please Login First!"); //passes for next request (key, error)
    res.redirect("/login");
}

module.exports = middlewareObj;