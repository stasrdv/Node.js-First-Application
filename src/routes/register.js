const UserModel = require("../models/users.model");
const express = require("express");
const router = express.Router();
var passwordHash = require("password-hash");

// POST create new Account
router.post("/register", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is empty");
  }
  // Check if user already exists
  UserModel.findOne({
    email: req.body.email
  })
    .then(doc => {
      // if user exists return error message
      if (doc) {
        res
          .status(400)
          .send(`The email adress ${doc.email} is already in use. `);
        // create new user
      } else {
        const model = new UserModel(req.body);
        // Hash Password
        model.password = passwordHash.generate(model.password);
        console.log(model);

        model.save().then(doc => {
          if (!doc || doc.length == 0) {
            return res.status(500).send(doc);
          } else {
            return res
              .status(201)
              .send(`You have created a new account ${doc.email}`);
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
