const UserModel = require("../models/users.model");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// POST create new Account
router.post("/logIn", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is empty");
  }

  UserModel.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        return res
          .status(400)
          .send(`Couldn't find your account ${req.body.email}`);
      } else {
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          return isMatch
            ? res.status(200).json(user.email)
            : res.status(400).send(`Incorrect password`);
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
