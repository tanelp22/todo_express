// cd todo_express
// npm start

const express = require("express")
const app=express()
const fs=require('fs');

const readFile=(filename)=>{
	return new Promise((resolve, reject)=>{
	    fs.readFile(filename, "utf8", (err,data)=>{
		    if(err){
			    console.error(err);
                reject(err);
			    return;
		    }
		    const tasks=JSON.parse(data)
		    resolve(tasks)
	    });
    })
}

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, "utf8", (err) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve(true);
        });
    });
};

// use ejs files to prepare templates for view
const path=require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname, "views"))

app.get("/", (req,res)=>{
    readFile('./tasks.json')
        .then(tasks=>{
        
        res.render("index",{
            tasks: tasks,
            error: null
        })
    })
})  

app.use(express.urlencoded({extended: true}))

app.post('/',(req,res)=>{
    let error = null
    if(req.body.task.trim().length==0){
        error='Please insert correct task data'
        readFile('./tasks.json')
        .then(tasks=>{
            res.render('index',{
                tasks: tasks,
                error: error
            })
        })
    }
    else{
        readFile('./tasks.json')
        .then(tasks=>{
        
            let index
            if(tasks.length===0){
                index=1
            }
            else{
                index=tasks[tasks.length-1].id+1;
            }
            const newTask={
                "id":index,
                "task":req.body.task
            }
            tasks.push(newTask)
            data=JSON.stringify(tasks, null, 2)
            writeFile('./tasks.json',data)
        
            res.redirect('/')
        })
    }
})

app.get('/delete-task/:taskId',(req,res)=>{
    let deletedTaskId=parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks=>{
        tasks.forEach((task,index)=>{
            if(task.id===deletedTaskId){
                tasks.splice(index,1)   
            }
        })

        tasks.forEach((task, index) => {
            task.id = index + 1;
        });

        data=JSON.stringify(tasks,null,2)
        writeFile('./tasks.json',data)
        res.redirect('/')
    })
})

app.get('/update-task/:taskId',(req,res)=>{
    const taskId = parseInt(req.params.taskId);
    readFile('./tasks.json')
        .then(tasks => {
            const task = tasks.find(t => t.id === taskId);
            if (!task) {
                return res.status(404).send('Task not found');
            }
            res.render('edit', { task });
        })
        .catch(err => res.status(500).send('Server error: Unable to read tasks.'));
});

app.get('/reset', (req, res) => {
    fs.writeFile('./tasks.json', '[{"id": 1,"task": "Study PHP"},{"id": 2,"task": "Study JAVA"},{"id": 3,"task": "Study JavaScript"}]', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Server Error: Could not overwrite file.');
        }
        console.log('Reseted Form');
        res.redirect('/');
    });
    
});

app.post('/update-task/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const updatedTask = req.body.task.trim();


    
    if (updatedTask.length === 0) {
        // If task content is empty, re-render edit page with an error message
        readFile('./tasks.json')
            .then(tasks => {
                const task = tasks.find(t => t.id === taskId);
                if (!task) {
                    return res.status(404).send('Task not found');
                }
                // Render edit page with the error message
                res.render('edit',{
                    task,
                    error: 'Task content cannot be empty' 
                })
            })
            .catch(err => res.status(500).send('Server error: Unable to read tasks.'));
        return;
    }

    readFile('./tasks.json')
        .then(tasks => {
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex === -1) {
                return res.status(404).send('Task not found');
            }

            // Update the task
            tasks[taskIndex].task = updatedTask;
            const data = JSON.stringify(tasks, null, 2);

            // Write the updated data back to tasks.json
            return writeFile('./tasks.json', data);
        })
        .then(() => res.redirect('/'))
        .catch(err => res.status(500).send('Server error: Unable to update task.'));
});


app.listen(3001,()=>{
    console.log("Example app is started at http//localhost:3001")
})