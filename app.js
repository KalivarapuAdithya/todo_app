const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const Todo = require('./models/todo');

mongoose.connect('mongodb://localhost/todo',{ useNewUrlParser:true ,useUnifiedTopology:true });

let db = mongoose.connection;

db.once('open',()=>{
    console.log('mongodb connected');
});

db.on('err',(err)=>{
    console.log(err);
});

app.get('/',(req,res)=>{
    Todo.find({},(err,todos)=>{
        if(err)
        console.log(err);
        else
        res.render('index',{todo:todos});
    })
});

app.post('/',(req,res)=>{
    let todo = new Todo();
    todo.task = req.body.task;
    todo.save((err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        res.redirect('/');
    })
})

app.get('/edit/:id',(req,res)=>{
  Todo.findById({_id:req.params.id},(err,todos)=>{
      if(err)
      console.log(err);
      else
      res.render('edit',{todos:todos});
  })
});

app.post('/edit/:id',(req,res)=>{
  let task={task:req.body.task};
  let query={_id:req.params.id};
  Todo.updateOne(query,task,function(err){
    if(err)
    console.log(err);
    else {
      res.redirect('/');
    }
  });
});

app.get('/delete/:id',(req,res)=>{
  let query={_id:req.params.id};
  Todo.deleteOne(query,function(err){
    if(err)
    console.log(err);
    else {
      res.redirect('/');
    }
  });
});

app.listen(3000,(err)=>{
    if(err)
    console.log(err);
    else
    console.log('listening at 3000');
});
