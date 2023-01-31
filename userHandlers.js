const database = require("./database");

const getUsers = (req, res) => {
  let sql = "select id, firstname, lastname, email, city, language from users";
  const array = [];

  if (req.query.language != null) {
    sql += " where language = ?";
    array.push(req.query.language);
  
    if (req.query.city != null) {
      sql += " and city = ?";
      array.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += " where city = ?";
    array.push(req.query.city);
  }
    database
      .query(sql, array)
      .then(([users]) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("select id, firstname, lastname, email, city, language from users where id = ?", [id])
      .then(([users]) => {
        if (users[0] == null) {
          res.status(404).send("Not Found");
        }
        else {
          res.json(users[0])
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  const postUser = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;
  
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language, hashedPassword]
      )
      .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the user");
      });
  };

  const putUser = (req, res) => {
    const id = Number(req.params.id);
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;
    database
      .query(
        "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? where id = ?",
        [firstname, lastname, email, city, language, hashedPassword, id]
      )
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error editing the user");
      });
  };

  const deleteUser = (req, res) => {
    const id = Number(req.params.id);
    database
      .query("delete from users where id = ?", [id])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the user");
      });
  };

module.exports = {
    getUsers,
    getUsersById,
    postUser,
    putUser,
    deleteUser
  };
