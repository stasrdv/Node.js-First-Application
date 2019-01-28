const UserModel = require("../models/users.model");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST
router.post("/auth", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is empty");
  }

  UserModel.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        return res.status(200).json({
          token: "",
          error: `Couldn't find User with email adress  ${req.body.email}`
        });
      } else {
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (err) throw err;
          const token = jwt.sign({ userID: user.id }, "i31GOVwz5K0W", {
            expiresIn: "90d"
          });
          const userName = user.email.replace(/^(.+)@(.+)$/g, "$1");
          return isMatch
            ? res.status(200).json({ token, error: "", userName })
            : res.status(200).json({
                token: "",
                error: `Invalid password for user ${user.email}`
              });
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
