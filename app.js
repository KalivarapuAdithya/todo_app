const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const Todo = require('./models/todo');

mongoose.connect('mongodb+srv://adithya:1234@cluster0.2hle2.mongodb.net/TODO?retryWrites=true&w=majority' , { useUnifiedTopology: true , useNewUrlParser: true  });

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
            res.redirect('/');
          }
      })
    }
    else{
      res.redirect('/');
    }
})

app.get('/edit/:id',(req,res)=>{
  Todo.findById({_id:req.params.id},(err,todos)=>{
      if(err)
      console.log(err);
      else
      res.render('edit',{todo:todos});
  })
});

app.post('/edit/:id',(req,res)=>{
  let query={_id:req.params.id};
  let a = req.body.task;
  if(a.length!=0)
  {
    let task={task:a};
    Todo.updateOne(query,task,function(err){
      if(err)
      console.log(err);
      else {
        res.redirect('/');
      }
    });
  }
  else{
    res.redirect(`/edit/${req.params.id}`);
  }
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

app.listen(process.env.PORT||3000,(err)=>{
    if(err)
    console.log(err);
    else
    console.log('listening at 3000');
});
