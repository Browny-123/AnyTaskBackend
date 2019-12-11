const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("./../models/UserModel");

passport.serializeUser((user, done) => {
  // console.log("@serializeUser", user);
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  // console.log("@deserializeUser", id);
  userModel
    .findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, function(email, passwd, next) {
    // console.log("local strategy", email, passwd);
    userModel
      .findOne({ email: email })
      .then(user => {
        if (!user) return next(null, false, "Incorrect signin infos");

        if (!bcrypt.compareSync(passwd, user.password)) {
          return next(null, false, "Incorrect signin infos");
        } else {
          next(null, user);
        }
      })
      .catch(dbErr => next(dbErr, null));
  })
);
