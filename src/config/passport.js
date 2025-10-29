import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const initializePassport = () => {
  // ---- Local Strategy ----
  passport.use("local", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "Usuario no encontrado" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return done(null, false, { message: "Contraseña incorrecta" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // ---- GitHub Strategy ----
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = await User.create({
          first_name: profile.username,
          last_name: "",
          email: profile.emails[0].value,
          password: "", // GitHub OAuth, no password local
          role: "user"
        });
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
