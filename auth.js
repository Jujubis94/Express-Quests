const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  argon2
    // recupere le password avec les options
    .hash(req.body.hashedPassword, hashingOptions)
    .then((hashedPassword) => {
    //   console.log(hashedPassword);
    //   ajoute un hashPassword a l'objet requete
      req.body.hashedPassword = hashedPassword;
      // supprime le password en clair
      delete req.body.hashedpassword;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  hashPassword,
};