require("./config/config.js");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const _ = require("lodash");
const {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose.js");
var {Todo} = require("./models/todo.js");
var {User} = require("./models/user.js");

var app = express();

var port = process.env.PORT;

// app.use((req, res, next) => {
//
//     var log = `${Date()} : ${req.method} : ${req.url}`;
//     fs.appendFile("server.log", log + "\n", (err) => {
//         if(err){
//             console.log("Couldnt append file");
//         }
//     });
//
//     next();
// });

app.use(bodyParser.json());

app.post("/todos", (req, res) => {

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((result) => {
        res.send({result});
    }, (e) => {
        res.status(400).send(e);
    });

    console.log(req.body);
});

app.get("/todos", (req, res) => {
    Todo.find().then( (todos) => {
        res.send({
            todos,
            status: 200,
            message: "Results listed"
        });
    }, (e) => {
        res.status(400).send("An error occured: " + e);
    });
});

app.get("/todos/:id", (req, res) => {
    var id = req.params.id;

    if(ObjectID.isValid(id)){
        Todo.findById(id).then((result) => {
            if(!result){
               return res.status(400).send({
                    errorMessage: "This ToDo doesnt exist"
                });
            }

            res.status(200).send({result});

        }).catch((e) => res.status(404));
    } else {
        return res.status(400).send({
            errorMessage: "ToDo-ID is not valid"
        });
    }
    
});

app.delete("/todos/:id", (req, res) => {
    var id = req.params.id;

    if(ObjectID.isValid(id)){

        Todo.findByIdAndRemove(id).then((todo) => {
            if(!todo){
                return res.status(400).send({
                    errorMessage: "NOT FOUND"
                })
            }

            res.status(200).send({todo});

        }).catch((e) => res.status(404));

    } else {
        return res.status(400).send({
            errorMessage: "ToDos ID not found"
        })
    }
});

app.patch("/todos/:id", (req, res) => {
    //CURRENTLY HERE
    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"]);

    if(!ObjectID.isValid(id)){

        return res.status(400).send({
            errorMessage: "ID not found"
        });
       
    }


    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(400).send({
                errorMessage: "ToDo not found"
            });
        }

        res.send({todo});
    }).catch((e) => res.status(400).send({
        errorMessage: "Something went wrong"
    }));
});

app.listen(port, () => {   
     console.log(`listening to port: ${port}`);             
});

module.exports = {app};