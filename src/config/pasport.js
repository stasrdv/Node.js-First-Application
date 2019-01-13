const LocalStrategy = require("passport-local").Strategy;
let mongoose = require("mongoose");
let passwordHash = require("password-hash");

const User = require("../models/users.model");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({
        email: email
      })
        .then(user => {
          if (!user) {
            return done(null, false, { message: `${email} is not registered` });
          }
          //   Match Password
          else {
            passwordHash.verify(password, user.password, (err, isMatch) => {});
          }
        })
        .catch(err => {
          res.status(500).json(err);
        });
    })
  );
};
