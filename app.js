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
  let messages = [];
    Todo.find({},(err,todos)=>{
        if(err)
        console.log(err);
        else
        res.render('index',{messages:messages,todo:todos});
    })
});

app.post('/',(req,res)=>{
    let messages = [];
    let a = req.body.task;
    if(a.length!=0)
    {
      let todo = new Todo();
      todo.task = a;
      todo.save((err)=>{
          if(err)
          {
              console.log(err);
          }
          else
          {
            messages.push({fail:0,message:'task added'});
            console.log(messages.length);
            console.log(messages);
            Todo.find({},(err,todos)=>{
            res.render('index',{messages:messages,todo:todos});
          });
          }
      })
    }
    else{
      messages.push({fail:1,message:'please fill a task'});
      console.log(messages.length);
      console.log(messages);
      Todo.find({},(err,todos)=>{
      res.render('index',{messages:messages,todo:todos});
    });
    }
})

app.get('/edit/:id',(req,res)=>{
  let messages = [];
  Todo.findById({_id:req.params.id},(err,todos)=>{
      if(err)
      console.log(err);
      else
      res.render('edit',{messages:messages,todo:todos});
  })
});

app.post('/edit/:id',(req,res)=>{
  let messages = [];
  let query={_id:req.params.id};
  let a = req.body.task;
  if(a.length!=0)
  {
    let task={task:a};
    Todo.updateOne(query,task,function(err){
      if(err)
      console.log(err);
      else {
        messages.push({fail:0,message:'task edited successfully'});
        console.log(messages.length);
        console.log(messages);
        Todo.find({},(err,todos)=>{
          res.render('index',{messages:messages,todo:todos});
      });
      }
    });
  }
  else{
    messages.push({fail:1,message:'please fill a task'});
    console.log(messages.length);
    console.log(messages);
    Todo.findById({_id:req.params.id},(err,todos)=>{
      res.render('edit',{messages:messages,todo:todos});
  });
  }
});

app.get('/delete/:id',(req,res)=>{
  let messages = [];
  let query={_id:req.params.id};
  Todo.deleteOne(query,function(err){
    if(err)
    console.log(err);
    else {
      messages.push({fail:0,message:'successfully deleted'});
      console.log(messages.length);
      console.log(messages);
      Todo.find({},(err,todos)=>{
        res.render('index',{messages:messages,todo:todos});
    });
    }
  });
});

app.listen(3000,(err)=>{
    if(err)
    console.log(err);
    else
    console.log('listening at 3000');
});
