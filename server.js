/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Parikh Harsh Kamleshbhai
*  Student ID: 129168217
*  Date: 15/09/2022
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 


const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config(); 
app.use(express.json());
app.use(cors());
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;


app.get("/",function(req,res)
{
    res.json({msg:"API Listening"});
});

app.post("/api/movies",(req,res)=>{  // add new movie, returns to client either movie or error msg
   try
   {
    const addnew =  db.addNewMovie(req.body);
    res.json(addnew);
   }
   catch(err)
    {
        res.status(500).send(err.message);
    }
});


app.get("/api/movies",(req,res)=>
{
    db.getAllMovies(req.body.page, req.body.perPage, req.body.title)
    .then(()=>
    {
        res.json(req.body);
    })
    .catch((err)=>
    {
      res.status(500).send("Please try vslid input");
    });
});



app.get("/api/movies",(req, res)=>{
    if (req.query.page || req.query.perPage) 
    {
     try
     {
        const specificMoviename =  db.getAllMovies(req.query.page, req.query.perPage, req.query.title);
        res.json(specificMoviename);
     }
     catch (err)
     {
        res.status(500).send(err.message);
     }
    }
    else 
    {
      res.status(404).send(err.message);
    }
  });



app.get("/api/movies/:id",(req,res)=>
{
    try
    {
        const movieName = db.getMovieById(req.params.id);
        res.json(movieName);
    }
    catch (err)
    {
        res.status(204).send(err.message);
    }
});

app.put("/api/movies/:id",(req,res)=>{
    if(req.params.id != req.body)
    {
        res.status(404).send(err.message);
    } 
    else
    {
        const msgforClient = db.updateMovieById(req.body,req.params.id);
        if(msgforClient)
        {
            res.json(msgforClient);
        } 
        else
        {
            res.status(204).send(err.message);
        }
    }
});



app.delete("/api/movies/:id",(req,res)=>
{
    if(req.params.id !== req.body)
    {
        db.deleteMovieById(req.params.id).then(() => 
        {
            res.status(201).json({ message: "delete successfull" });
          })
          .catch((err)=>
          {
            res.status(500).send(err.message);
          });
    }
    else
    {
        res.status(204).send(err.message);
    }
});


var connectionString = "mongodb+srv://dbUser:Harsh123@senecaweb.vuzkizh.mongodb.net/sample_mflix?retryWrites =true&w=majority";
console.log(connectionString);

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>
{
    app.listen(HTTP_PORT, ()=>
    {
        console.log(`Listening on: ${HTTP_PORT}`);
    });
})
.catch((err)=>
{
    console.log(err);
});
