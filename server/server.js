const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

var {mongoose} = require("./db/mongoose.js");
var {Todo} = require("./models/todo.js");
var {User} = require("./models/user.js");

var app = express();

var port = process.env.PORT || 3000;

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
        res.send(result);
    }, (e) => {
        res.status(400).send(e);
    });

    console.log(req.body);
});

app.listen(port, () => {   
     console.log(`listening to port: ${port}`);             
});