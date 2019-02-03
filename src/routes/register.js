const UserModel = require("../models/users.model");
const express = require("express");
const router = express.Router();
let path = require("path");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "smtnodemailer@gmail.com",
    pass: "fZsMGZXQMx8FCT"
  }
});

// Register
router.post("/register", (req, res) => {
  if (!req.body) {
    return res.status(400).send("Request body is empty");
  }
  // Check if user already exists
  UserModel.findOne({
    email: req.body.email
  })
    .then(doc => {
      if (doc) {
        res.status(200).json({
          token: "",
          error: `The email adress ${doc.email} is already in use.`
        });
      } else {
        // Create new user (isVerified will be false till verification email confirmed)
        const newUser = new UserModel(req.body);
        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(newUser => {
              host = req.get("host");
              link = "http://" + req.get("host") + "/verify?id=" + newUser._id;
              mailOptions = {
                to: req.body.email,
                subject: "Please confirm your Email adress",
                html:
                  "Hello,<br> Please click on the link to verify your email adress.<br><a href=" +
                  link +
                  ">Click here to verify</a>"
              };
              smtpTransport.sendMail(mailOptions, error => {
                if (error) {
                  res.end("error");
                } else {
                  res.json(`Verification email Sent to ${req.body.email}`);
                }
              });
            });
          });
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Verify
router.get("/verify", (req, res) => {
  UserModel.findOneAndUpdate(
    { _id: req.query.id },
    { $set: { isVerified: true } }
  ).then(updatedDoc => {
    if (updatedDoc) {
      res.redirect("/entry");
    } else {
      res.end("<h1>Bad Request</h1>");
    }
  });
});
module.exports = router;

function sendeVerification(req, userID) {}
