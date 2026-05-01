const express=require("express");
const app=express();
const users = require("./routes/user.js")
const posts=require("./routes/post.js")
const cookieParser = require('cookie-parser');
const path=require('path');

const flash = require('connect-flash');
const session = require('express-session');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = { secret: 'mysuperCode',
    resave: false,
    saveUninitialized:true
 };


 
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash('success');
    res.locals.errorsMsg=req.flash('error');

  next();
});

app.get('/hello',(req,res)=>{
    // console.log( req.flash("success"));
    res.render('page.ejs',{name : req.session.name});
});

app.get("/register",(req,res)=>{
  let {name="Anyonmous"}=req.query;
  req.session.name=name;
  if(name==="Anyonmous"){
    req.flash('error','User is not found in the DB');
  }else{
  req.flash('success','user registered successfully!')// two parameters

  }
  res.redirect('/hello');
});

app.get('/test',(req,res)=>{
    res.send("Testing the sessions!");
})

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count+=1;
    }
    else{
        req.session.count=1;
    }
    
    res.send(`You send the request to ${req.session.count} times`);
});

let port=3000;

app.listen(port,()=>{
    console.log("server is listing to port 3000")
})

