const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/users.model");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new localStrategy((username, password, done) => {
      console.log(username);
    })
  );
};

// passport.use(
//   new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//     // Match User
//     User.findOne({
//       email: email
//     })
//       .then(user => {
//         if (!user) {
//           return done(null, false, { message: `${email} is not registered` });
//         }
//         //   Match Password
//         else {
//           bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
//             if (err) throw err;
//             return isMatch
//               ? done(null, user)
//               : done(null, false, { message: "Password incorrect" });
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).json(err);
//       });
//   })
// );
