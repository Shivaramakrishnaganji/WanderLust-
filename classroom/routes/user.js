const express=require("express");
const app=express();

const router = express.Router(); // Router Object is declared here


// define the home page route
router.get('/', (req, res) => {
  res.send('Show Users Data')
})
// define the about route
router.get('/about', (req, res) => {
  res.send(`About the User's data i want`)
})

router.get("/useID",(req,res)=>{
    res.send("Good Response useID");
})
router.post("/userDATa",(req,res)=>{
    res.send("Good Response");
})
router.post("/:id",(req,res)=>{
    res.send("Good Response");
})
router.delete("/:id/posts",(req,res)=>{
    res.send("Good Response");
})

module.exports = router;