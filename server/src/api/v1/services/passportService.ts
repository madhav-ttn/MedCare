import passport from "passport";
import { Strategy as jwtStrategy } from "passport-jwt";
import { config } from "../config/passport";
import authModel from "../models/authModel";

passport.use(
  new jwtStrategy(config, async (jwt_payload, done) => {
    try {
      const response = await authModel.findUserByEmail(jwt_payload.email);
      if (!response?.success) {
        return done(null, false);
      }
      return done(null, response.user);
    } catch (error) {
      console.log("Error", error);
      return done(error, false);
    }
  })
);

export default passport;
