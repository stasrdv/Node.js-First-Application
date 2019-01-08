let CustomerModel = require("../models/customer.model");
let express = require("express");
let router = express.Router();

// Create a new customer
router.post("/customer", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is empty");
  }
  let model = new CustomerModel(req.body);
  model
    .save()
    .then(doc => {
      if (!doc || doc.length == 0) {
        return res.status(500).send(doc);
      } else {
        return res
          .status(201)
          .send(
            `You have created an account for ${doc.name}, e-mail address ${
              doc.email
            }.`
          );
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// GET customer
router.get("/customer", (req, res) => {
  if (!req.query.email) {
    res.status(400).send("Missing url parameter: email");
  } else {
    CustomerModel.findOne({
      email: req.query.email
    })
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

//UPDATE
router.put("/customer", (req, res) => {
  if (!req.query.email) {
    res.status(400).send("Missing url parameter: email");
  } else {
    CustomerModel.findOneAndUpdate(
      {
        email: req.query.email
      },
      req.body,
      {
        new: true
      }
    )
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

// DELETE
router.delete("/customer", (req, res) => {
  if (!req.query.email) {
    res.status(400).send("Missing url parameter: email");
  } else {
    CustomerModel.findOneAndRemove({ email: req.query.email })
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

module.exports = router;
