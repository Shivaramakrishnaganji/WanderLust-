const express=require("express");
const app=express();

const router = express.Router(); // Router Object is declared here


//here the post routers in the project
router.get("/",(req,res)=>{
    res.send("I am Root of Post Router");
})
router.get("/:id",(req,res)=>{
    res.send("I am Post Router for post ID");
})
router.get("/Postid",(req,res)=>{
    res.send("I am Delete Routter here in the Post Router");
})
router.get("/postss/:id",(req,res)=>{
    res.send("I am Post Router");
})

module.exports=router;