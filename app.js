const express = require("express");
const { validateMovie, validateUser } = require("./validators");

const app = express();

app.use(express.json());

require("dotenv").config();

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

// Password
const {verifyToken } = require("./auth.js");
const movieHandlers = require("./movieHandlers");

// get movies
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

// post movies
app.post("/api/movies",validateMovie, verifyToken, movieHandlers.postMovie);

// put movies
app.put("/api/movies/:id",validateMovie, movieHandlers.putMovie)

// delete movies
app.delete("/api/movies/:id", movieHandlers.deleteMovie)

const userHandlers = require("./userHandlers");

// Password
const { hashPassword, verifyPassword } = require("./auth.js");

// user login
app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext, verifyPassword)
// get users
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);

// post users
app.post("/api/users", validateUser, hashPassword, userHandlers.postUser);

// put users
app.put("/api/users/:id", validateUser, hashPassword, userHandlers.putUser)

// delete users
app.delete("/api/users/:id", userHandlers.deleteUser)

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

