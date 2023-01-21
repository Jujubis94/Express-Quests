const joi = require("joi");

const moviesSchema = joi.object({
    title: joi.string().max(255).required(),
    director: joi.string().max(255).required(),
    year: joi.number().integer().min(1880).max(2099).required(),
    color: joi.number().max(1).required(),
    duration: joi.number().integer().min(1).max(43200)
});


const validateMovie = (req, res, next) => {
    // validate req.body then call next() if everything is ok
    const { title, director, year, color, duration } = req.body;

    const { error } = moviesSchema.validate(
        { title, director, year, color, duration },
        { abortEarly: false }
      );

      if (error) {
        res.status(422).json({ validationErrors: error.details });
      } else {
        next();
      }
  };

  const usersSchema = joi.object({
    firstname: joi.string().max(255).required(),
    lastname: joi.string().max(255).required(),
    email: joi.string().email().max(255).required(),
});


const validateUser = (req, res, next) => {
    // validate req.body then call next() if everything is ok
    const { firstname, lastname, email } = req.body;

    const { error } = usersSchema.validate(
        { firstname, lastname, email },
        { abortEarly: false }
      );

      if (error) {
        res.status(422).json({ validationErrors: error.details });
      } else {
        next();
      }
  };
  
  module.exports = {
    validateMovie,
    validateUser
  };