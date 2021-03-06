// all the middleware goes in here
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = {};

// middleware for authenticating a user
middlewareObj.checkCampgroundOwnership = function(req,res,next){
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        res.redirect("back");
      } else {
        // does the user own the campground
        if (foundCampground.author.id.equals(req.user._id)) {
          console.log("------------------------" + foundCampground);
          next();

        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash("error", "Comment Not found");
        res.redirect("back");
      } else {
        // does the user own the comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do thata")
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that")
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First !");
  res.redirect("/login");
}
module.exports = middlewareObj;
