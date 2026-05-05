const express=require("express");
const app=express();
const dns = require("dns");
const fs = require("fs");


dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load environment variables before importing files that use process.env.
if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}

const mongoose= require("mongoose");
const path =  require("path");
const methodOverride= require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
//Cookies Package 
const cookieParser = require('cookie-parser');
//sessions in the APP.JS
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const flash=require('connect-flash');


//Routes Paths
const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const apiAuthRouter = require("./routes/apiAuth.js");
const apiListingsRouter = require("./routes/apiListings.js");
const apiReviewsRouter = require("./routes/apiReviews.js");

//Implemetation of the passport's
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl= process.env.ATLAS_DB_URL;
const isProduction = process.env.NODE_ENV === "production";
const forceLegacyRollback = process.env.FORCE_EJS_ROLLBACK === "true";
const serveReactFrontend = isProduction && !forceLegacyRollback;
const reactDistPath = path.join(__dirname, "frontend", "dist");
const reactIndexPath = path.join(reactDistPath, "index.html");

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
})

store.on("error",(error)=>{
    console.log("Error in MONGO SESSION STORE",error);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie : {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


async function main() {
  if (!dbUrl) {
    throw new Error("ATLAS_DB_URL is missing from .env");
  }

  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 10000,
  });
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}




 //middleware's
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//cookies middleware


app.use(cookieParser());


app.use(session(sessionOptions));
app.use(flash());

//passport middleware's
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    console.log("Current User is:", req.user);
    next();
})


// //Demo user of the testing of login and sinup
// app.get('/registerUser',async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:'delta-student',
//     });
//     let newUser=await User.register(fakeUser,"helloworld");
//     res.send(newUser);
// })


//Routes
app.use("/api/auth", apiAuthRouter);
app.use("/api/listings", apiListingsRouter);
app.use("/api/reviews", apiReviewsRouter);

if (serveReactFrontend) {
    if (!fs.existsSync(reactIndexPath)) {
        throw new Error("React production build missing. Run `npm --prefix frontend run build` before starting production.");
    }

    app.use(express.static(reactDistPath));
} else {
    app.use("/listings",listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/",userRouter);
}



app.get("/getcookies",(req,res)=>{
    let {name="anonymous"} = req.cookies;

    res.send(`Hi , ${name}`);
})

app.get("/",(req,res,next)=>{
    if (serveReactFrontend) {
        return res.sendFile(reactIndexPath);
    }
    res.send("Hi , I am root user")
});

if (serveReactFrontend) {
    // SPA fallback only for client routes. API routes are handled above.
    app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
        if (req.path.includes(".") || req.path.startsWith("/uploads/") || req.path.startsWith("/public/")) {
            return next();
        }

        return res.sendFile(reactIndexPath);
    });
}



app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//Error Handling MiddleWare use to render coutom error in the screen and without interruption in the backend side
app.use((err,req,res,next)=>{

 let {statusCode=500 , message="Something went wrong"}=err;
 if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({
        ok: false,
        message,
    });
 }
 res.status(statusCode).render("error.ejs",{err});
//  res.status(statusCode).send(message);
})

let port=8000;

main()
  .then(() => {
    console.log("Connected to db");
    app.listen(port,()=>{
        console.log("server is listing to port 8000")
    })
  })
  .catch((err) => {
    console.error("MongoDB connection failed:");
    console.error(err.message);
    process.exit(1);
  });
