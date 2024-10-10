const express = require("express")
const app=express()

// use ejs files to prepare templates for view
const path=require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname, "views"))

app.get("/", (req,res)=>{
    const tasks =["study HTML", "Study CSS", "Study JS"]
    console.log(tasks)
    res.render("index",{tasks:tasks})
})

app.listen(3001,()=>{
    console.log("Example app is started at http//localhost:3001")
})