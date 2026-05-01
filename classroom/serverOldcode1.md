// app.get("/user",(req,res)=>{
//     res.send("Good Response");
// })
// app.post("/user",(req,res)=>{
//     res.send("Good Response");
// })
// app.post("/user/:id",(req,res)=>{
//     res.send("Good Response");
// })
// app.delete("/user/:id",(req,res)=>{
//     res.send("Good Response");
// })

//use the middleware function to import the Routter Functionality from the user.js
app.use("/users",users)
app.use("/posts",posts);

app.use(cookieParser("secretcode"));

app.get("/getSignedCookies",(req,res)=>{
    res.cookie("Welcome-to","Hyd");
    res.cookie("made-in","India",{signed:true});
    res.send("I am sending the Signed Cookies to you!");
})


app.get("/verifyCookies",(req,res)=>{
    console.log(req.signedCookies);
    res.send("Verified!");
});

app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.cookie("origin","India");
    res.cookie("welcome","India");
    res.send("I am sending an Cookie!");
})


app.get("/",(req,res)=>{
    res.send("I am Root Router in this Project");
    console.dir(req.cookies);
})


// //here the post routers in the project
// app.get("/post",(req,res)=>{
//     res.send("I am Post Router");
// })
// app.post("/post",(req,res)=>{
//     res.send("I am Post Router");
// })
// app.delete("/post",(req,res)=>{
//     res.send("I am Post Router");
// })
// app.get("/post/:id",(req,res)=>{
//     res.send("I am Post Router");
// })

let port=3000;

app.listen(port,()=>{
    console.log("server is listing to port 3000")
})
