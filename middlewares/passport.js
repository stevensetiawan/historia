'use strict';
// const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const {
  User
} = require("../models")

// Setup work and export for the JWT passport strategy


module.exports = (passport) => {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

    passport.use(new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback : true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile, 'ini profile')
        let existingUser = await User.findOne({
          where: { 
            email: profile.emails[0].value
          }
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        console.log('Creating new user...');
        const newUserPayload = {
            email: profile.emails[0].value,
            password: 'testing'
        };
        let newUser = await User.create(newUserPayload);
        return done(null, newUser);
      } catch (error) {
        return done(error, false)
      }
    }
  ));
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("authorization"),
        secretOrKey: process.env.SECRET,
      },
        async (jwtPayload, done) => {
          try {
            // Extract user 
            const user = jwtPayload.user;
            return done(null, user); 
          } catch (error) {
            return done(error, false);
          }
      }
    )
  );
}