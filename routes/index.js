"use strict"
const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

// Redirect the user to the Google signin page 
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
// Retrieve user data using the access token received
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
      jwt.sign(
        { user: req.user },
        process.env.SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            return res.json({
              token: null,
            });
          }
          return res.json({
            token,
          });
        }
    );
  }
);
// profile route after successful sign in 
router.get(
    "/profile",
      passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      return res.send("Welcome");
    }
  );


module.exports = router

