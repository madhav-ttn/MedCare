import { ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleAuthConfig } from "./googleAuth";
import authModel from "../models/authModel";
import bcrypt from "bcrypt";

console.log(googleAuthConfig);
passport.use(
  new GoogleStrategy(
    googleAuthConfig,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const email = emails?.[0]?.value;
        if (!email) {
          return done(new Error("Email not found in profile"));
        }
        let response = await authModel.findUserByEmail(email);
        if (response?.success) {
          return done(null, response.user);
        }
        const hashedPassword = await bcrypt.hash(id, 10);
        if (!response?.success) {
          await authModel.createUser(displayName, email, hashedPassword);
        }
        return done(null, response?.user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
  try {
    const user = await authModel.findUserByEmail(email);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const config = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "my-default-secret",
};

export { passport, config };
