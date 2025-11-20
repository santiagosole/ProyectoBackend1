import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.model.js";

export function initPassport() {

  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.jwt]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.initialize();
}