const express = require("express")
const app=express()
const fs=require('fs');

const readFile=(filename)=>{
	return new Promise((resolve, reject)=>{
	fs.readFile(filename, "utf8", (err,data)=>{
		if(err){
			console.error(err);
			return;
		}
		const tasks=data.split("\n")
		resolve(tasks)
	});
})
}

// use ejs files to prepare templates for view
const path=require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname, "views"))

app.get("/", (req,res)=>{
    readFile('Tasks')
        .then(tasks=>{
        //console.log(tasks)
        res.render("index",{tasks: tasks})
    })
})  

app.use(express.urlencoded({extended: true}))

app.post('/',(req,res)=>{
    readFile('Tasks')
        .then(tasks=>{
        tasks.push(req.body.task)
        const data=tasks.join("\n")
        fs.writeFile('Tasks',data,err=>{
            if(err){
                console.error(err);
                return;
            }
            res.redirect('/')
        })
    })
})

app.listen(3001,()=>{
    console.log("Example app is started at http//localhost:3001")
})