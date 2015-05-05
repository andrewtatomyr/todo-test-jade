// set up
var express= require("express");
var app= express();
var mongoose= require("mongoose");


//var morgan= require("morgan");
var bodyParser= require("body-parser");
var cookieParser = require('cookie-parser');
var methodOverride= require("method-override");




// configuration


mongoose.connect('mongodb://todo:12345678@proximus.modulusmongo.net:27017/irOnub4i'); //my own on modulus.io: { "login": "todo", "password": "12345678" }

app.set('port', (process.env.PORT || 5001));//

app.use(express.static(__dirname+'/public'));
//app.use(morgan("dev"));
app.use(bodyParser.urlencoded({'extended': 'true'})); //без цього не хотіло читати дані POST :) Очевидно!
app.use(bodyParser.json());
//app.use(bodyParser.json({ type: "application/vnd.api+json"}));
app.use(methodOverride());
app.use(cookieParser());






// define model

var TodoSchema = new mongoose.Schema({

  "urid": String,
  "task": String,
  "executed": Boolean,
  "time": String

});


var Todo= mongoose.model("Todo", TodoSchema);



// routes

  // api





  app.get("/api/todo", function(req,res) {

    var urid= req.cookies.urid;
    console.log("request from urid: ", urid);

    Todo.find({"urid": urid}, function(err,todos) {
      if (err) {
        res.send(err);
      } else {
        res.json(todos);
      }
    });

  });

  app.post("/api/todo", function(req,res) {

    Todo.create(req.body  /*save??*/, function(err, todo  ) {  //'todo'???
      if (err) {
        res.send(err);
      } else {
        console.log('a new task created');
/**/
        res.send({msg: 'OK'});
/**
        Todo.find({"urid": urid}, function(err,todos) {
          if (err) {
            res.send(err);
          } else {
            res.json(todos);
          }
        });
/**/
            //res.end();?
      }
    });
  });



  app.get('/api/todo/:tid', function(req, res) {
    tid= req.params.tid; //витягуємо значення запиту
    console.log('tid: '+tid);
    Todo.findById(tid, function(err,theTodo) {
      if (err) {
        res.send(err);
      } else {
        //res.json(todos);

        theTodo.executed= !theTodo.executed;
        console.log('and ... -> ');
        console.log(theTodo);


        theTodo.save(function(err) {
          if (err) res.send.err();

          console.log('task updated');
          res.json(theTodo);
          //res.send({msg: 'OK'});
        });

      }
    });
  });

  app.get('/api/delexec', function(req, res) {
    /*
    tid= req.params.tid; //витягуємо значення запиту
    console.log('tid: '+tid);
    */

    Todo.remove({executed: true}, function(err) {
      if (err) res.send(err);

      //res.json(todos);


      console.log('del some ');
      //console.log(theTodo);


      res.send({msg: 'OK'});

    });
    /**/




  });


/**
  app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
      _id: req.param.todo_id
    },function(err, todo) {
      if (err) {
        res.send(err);
      } else {
        Todo.find(function(err, todos) {
          if (err) {
            res.send(err);
          } else {
            res.json(todos);
          }
        });
      }
    });


  });
/**/






// application
app.get('*', function(req, res) {
  res.sendfile('./public/index.html');
});


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
