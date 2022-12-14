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


const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyparser = require('body-parser');
const MoviesDB = require('./modules/moviesDB.js');
const app = express();
const db = new MoviesDB();
const dotenv = require('dotenv').config();
const HTTP_PORT = process.env.PORT || 8080;
app.use(bodyparser.json());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => 
{
  res.send("WEB422 Assignment-1 (Web-API)");
});

app.post("/api/movies", async (req, res) => 
{
  try 
  {
    if (Object.keys(req.body).length === 0)
    {
      return res.status(400).json({ error: "No movie data" });
    }
    const movee = await db.addNewMovie(req.body);
    res.status(201).json(movee);
  } 
  catch (error) 
  {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/movies", async (req, res) => 
{
  try 
  {
    const movee = await db.getAllMovies
    (
      req.query.page,
      req.query.perPage,
      req.query.title || null
    );
    if (movee.length === 0)
    {
      return res.status(204).send();
    }
    res.json(movee);
  }
   catch (error) 
  {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/movies/:_id", async (req, res) => 
{
  try 
  {
    const movee = await db.getMovieById(req.params._id);
    if (!movee) 
    {
      return res.status(400).json({ error: "No Movie found." });
    }
    res.send(movee);
  } catch (error) 
  {
    res.status(400).json({ error: error.message });
  }
});



app.put("/api/movie/:_id", async (req, res) => 
{
  try 
  {
    if (Object.keys(req.body).length === 0) 
    {
      return res.status(400).json({ error: "No new data" });
    }
    const movee = await db.updateMovieById(req.body, req.params._id);
    res.json({ success: "Movie updated" });
  } catch (error) 
  {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/movies/:_id", async (req, res) =>
 {
  try 
  {
    const movie = await db.getMovieById(req.params._id);
    await db.deleteMovieById(req.params._id);
    res.json({ success: `Movie - ${movie.title} delete successfull` });

  } catch (error)
  {
    res.status(400).json({ error: error.message });
  }
});



db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => 
  {
    app.listen(HTTP_PORT, () => 
    {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => 
  {
    console.log(err.message);
  });
