// ✅ Updated passport.js using custom queries
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import db from "../config/db.js"; 
import { findUserByEmail, createUser } from "../models/userModel.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        // 🔍 Try to find user by email
        let user = await findUserByEmail(email);

        if (!user) {
          // 🧑‍🎓 Create new user with default role "student"
          const newUser = {
            name,
            email,
            password: null, // since it's Google login
            role: "student",
            isProfileComplete: false,
          };
          const result = await createUser(newUser);
          user = { id: result.insertId, ...newUser };
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.username;

        let user = await findUserByEmail(email);

        if (!user) {
          const newUser = {
            name,
            email,
            password: null, // GitHub login
            role: "student",
            isProfileComplete: false,
          };
          const result = await createUser(newUser);
          user = { id: result.insertId, ...newUser };
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

