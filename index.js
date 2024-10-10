const express = require("express")
const app=express()
const fs=require('fs');

// use ejs files to prepare templates for view
const path=require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname, "views"))

app.get("/", (req,res)=>{

    fs.readFile('Tasks','utf8',(err,data)=>{
        if(err){
            console.error(err);
            return;
        }
        //console.log(data);
        //console.log(typeof data);
        //console.log(data.split("\n"))
        const tasks =data.split("\n")
        res.render("index",{tasks: tasks})
    });
    
})

app.listen(3001,()=>{
    console.log("Example app is started at http//localhost:3001")
})