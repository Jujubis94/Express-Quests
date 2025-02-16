const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  argon2
    // recupere le password avec les options
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      //   console.log(hashedPassword);
      //   ajoute un hashPassword a l'objet requete
      req.body.hashedPassword = hashedPassword;
      // supprime le password en clair
      delete req.body.password;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = (req, res) => {
  argon2
    .verify(req.user.hashedPassword, req.body.password)
    .then((verifiedPassword) => {
      if (verifiedPassword) {
        const payload = { sub: req.user.id };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        res.send({ token, user: req.user });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");
    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }
    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

const testIdSub = (req, res, next) => {
  if (Number(req.params.id) === req.payload.sub) {
    next();
  }
  console.log(req.payload.sub, Number(req.params.id));
  res.status(403).send("Forbidden");
};
module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  testIdSub,
};
