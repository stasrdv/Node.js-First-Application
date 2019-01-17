const UserModel = require("../models/users.model");
const express = require("express");
const router = express.Router();
let path = require("path");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const rand = Math.floor(Math.random() * 100 + 54);
var model;

var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "smtnodemailer@gmail.com",
    pass: "fZsMGZXQMx8FCT"
  }
});

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
        res.status(200).json({
          token: "",
          error: `The email adress ${doc.email} is already in use.`
        });
        // Create new user
      } else {
        // VerifyEmail
        host = req.get("host");
        link = "http://" + req.get("host") + "/verify?id=" + rand;
        mailOptions = {
          to: req.body.email,
          subject: "Please confirm your Email adress",
          html:
            "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
            link +
            ">Click here to verify</a>"
        };
        smtpTransport.sendMail(mailOptions, (error, response) => {
          if (error) {
            res.end("error");
          } else {
            // Create user's model
            model = new UserModel(req.body);
            res.json(`Verification email Sent to ${req.body.email}`);
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/verify", (req, res) => {
  if (req.protocol + "://" + req.get("host") == "http://" + host) {
    if (req.query.id == rand) {
      // Hash Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(model.password, salt, (err, hash) => {
          if (err) throw err;
          model.password = hash;
          model.save().then(user => {
            if (!user || user.length == 0) {
              return res.status(500).send(user);
            } else {
              if (err) throw err;
              const token = jwt.sign({ userID: user.id }, "i31GOVwz5K0W", {
                expiresIn: "90d"
              });
              return res.sendFile(
                path.join(__dirname, "../../public/index.html")
              );
            }
          });
        });
      });
    } else {
      res.end("<h1>Bad Request</h1>");
    }
  } else {
    res.end("<h1>Request is from unknown source");
  }
});
module.exports = router;
