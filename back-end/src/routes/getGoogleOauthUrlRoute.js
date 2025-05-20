import { getGoogleOauthUrl } from "../util/getGoogleOauthUrl";

export const getGoogleOauthUrlRoute = {
  path: "/auth/google/url",
  method: "get",
  handler: (req, res) => {
    try {
      const url = getGoogleOauthUrl();
      res.status(200).json({ url });
    } catch (error) {
      console.error("Error generating Google OAuth URL:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
