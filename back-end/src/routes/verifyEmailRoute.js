import jwt from "jsonwebtoken";
import { CognitoUser } from "amazon-cognito-identity-js";
import { getDbConnection } from "../db";
import { awsUserPool } from "../util/awsUserPool";

export const verifyEmailRoute = {
  path: "/api/verify-email",
  method: "put",
  handler: async (req, res) => {
    const { email, verificationString } = req.body;

    new CognitoUser({
      Username: email,
      Pool: awsUserPool,
    }).confirmRegistration(verificationString, true, async (err, result) => {
      if (err) {
        console.error("Error confirming registration:", err);
        return res.status(401).json({ error: "Incorrect verification code" });
      }

      const db = await getDbConnection("react-auth-db");
      const updateResult = await db
        .collection("users")
        .findOneAndUpdate(
          { email },
          { $set: { isVerified: true } },
          { returnDocument: "after" }
        );

      const { _id: id, info } = updateResult;

      jwt.sign(
        {
          id,
          email,
          isVerified: true,
          info,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) {
            return res.status(500).json({ error: "Error signing token" });
          }
          res.status(200).json({ token });
        }
      );

      // if (!user) {
      //   return res.status(404).json({ error: "User not found" });
      // }

      // await verifyUser(db, user._id);
    });
  },
};
