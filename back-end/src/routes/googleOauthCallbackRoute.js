import jwt from "jsonwebtoken";
import { getGoogleUser } from "../util/getGoogleUser";
import { updateOrCreateUserFromOauth } from "../util/updateOrCreateUserFromOauth";

export const googleOauthCallbackRoute = {
  path: "/auth/google/callback",
  method: "get",
  handler: async (req, res) => {
    const { code } = req.query;
    console.log("Google OAuth callback received with code:", code);

    try {
      // Get user info from Google
      const oauthUserInfo = await getGoogleUser({ code });
      console.log("Hello");

      // Update or create user in the database
      const user = await updateOrCreateUserFromOauth({ oauthUserInfo });
      console.log("User info from Google:", oauthUserInfo);
      console.log("User info from DB:", user);

      const { _id: id, email, isVerified, info } = user;

      // Create JWT token
      jwt.sign(
        { id, email, isVerified, info },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error("Error signing JWT:", err);
            return res.status(500).json({ error: "Internal server error" });
          }
          res.redirect(`http://localhost:3000/login?token=${token}`);
        }
      );
    } catch (error) {
      console.error("Error during Google OAuth callback:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
