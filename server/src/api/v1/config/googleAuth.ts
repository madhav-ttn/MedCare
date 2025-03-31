import { config } from "./config";

export const googleAuthConfig = {
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
};
