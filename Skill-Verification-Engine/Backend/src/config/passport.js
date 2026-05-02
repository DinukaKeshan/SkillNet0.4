import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID); // debug

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            provider: "google",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
