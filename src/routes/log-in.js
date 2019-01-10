const UserModel = require("../models/users.model");
const express = require("express");
const router = express.Router();
var passwordHash = require("password-hash");

// POST create new Account
router.post("/logIn", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is empty");
  }

  UserModel.findOne({
    email: req.body.email
  })
    .then(doc => {
      if (passwordHash.verify(req.body.password, doc.password)) {
        return res.status(200).send(doc.email);
      } else {
        res.status(400).send(`Incorrect password`);
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
