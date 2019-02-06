const UserModel = require("../models/users.model");
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const fs = require("fs");
var promisedHandlebars = require("promised-handlebars");
var Q = require("q");
var Handlebars = promisedHandlebars(require("handlebars"), {
  Promise: Q.Promise
});

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "smtnodemailer@gmail.com",
    pass: "fZsMGZXQMx8FCT"
  }
});

Handlebars.registerHelper("helper", function(value) {
  return Q.delay(100).then(function() {
    return value;
  });
});

// read template file
var readHTMLFile = function(path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

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
        let newUser = new UserModel(req.body);
        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(newUser => {
              // Generate confirm email
              host = req.get("host");
              link = "http://" + req.get("host") + "/verify?id=" + newUser._id;
              username = newUser.email.replace(/^(.+)@(.+)$/g, "$1");
              readHTMLFile(
                "./public/assets/templates/confirm.html",
                (err, html) => {
                  if (err) throw err;
                  var template = Handlebars.compile(html);
                  template({
                    user: username,
                    link: link
                  }).then(template => {
                    (mailOptions = {
                      to: req.body.email,
                      subject: "Please confirm your Email adress",
                      html: template
                    }),
                      smtpTransport.sendMail(mailOptions, error => {
                        if (error) {
                          res.end("error");
                        } else {
                          res.json(
                            `Verification email Sent to ${req.body.email}`
                          );
                        }
                      });
                  });
                }
              );
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
    { $set: { isVerified: true } },
    { new: true }
  ).then(updatedDoc => {
    if (updatedDoc) {
      res.redirect("/entry");
    } else {
      res.end("<h1>Bad Request</h1>");
    }
  });
});

module.exports = router;
