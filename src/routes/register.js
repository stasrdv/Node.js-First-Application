const UserModel = require("../models/users.model");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

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
        const response = Object.assign(
          { success: false },
          { payload: `The email adress ${doc.email} is already in use. ` }
        );
        res.status(400).json(response);
        // create new user
      } else {
        const model = new UserModel(req.body);
        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(model.password, salt, (err, hash) => {
            if (err) throw err;

            model.password = hash;
            model.save().then(doc => {
              if (!doc || doc.length == 0) {
                return res.status(500).send(doc);
              } else {
                const response = Object.assign(
                  { success: true },
                  { payload: doc.id }
                );
                return res.status(201).json(response);
              }
            });
          });
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
