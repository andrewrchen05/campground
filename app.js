var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    passport    = require("passport-local"),
    User        = require("./models/user"),
    localStrategy = require("passport-local"),
    passport = require("passport"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    flash       = require("connect-flash");
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v11";
mongoose.connect(url);

// mongoose.connect("mongodb://localhost/yelp_camp_v10", { useNewUrlParser: true });
//mongoose.connect("mongodb+srv://andrewrchen05:ACmongo6!@cluster0-yh1vs.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is my secret hash function",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); //required for Express applications
app.use(passport.session()); //required for persistent login sessions
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //support login sessions with unique cookie
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) { //variable available in any file
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);

// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The YelpCamp Server Has Started!");
// });

app.listen(process.env.PORT || 3000, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});

// app.listen(3000, () => {
// 	console.log("Server is up & running!");	
// });