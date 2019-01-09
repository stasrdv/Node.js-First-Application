const LoginModel = require("../models/register.model");
const express = require("express");
const router = express.Router();

// Create a new customer
router.post("/register", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is empty");
  }
  // check if user already exists
  LoginModel.findOne({
    email: req.body.email
  })
    .then(doc => {
      if (doc) {
        res
          .status(400)
          .send(`The email adress ${doc.email} is already in use. `);
      } else {
        let model = new LoginModel(req.body);
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
