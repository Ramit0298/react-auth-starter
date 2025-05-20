import { getDbConnection } from "../db";
import jwt from "jsonwebtoken";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { awsUserPool } from "../util/awsUserPool";

export const signUpRoute = {
  path: "/api/signup",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;
    const attributes = [
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
    ];

    awsUserPool.signUp(
      email,
      password,
      attributes,
      null,
      async (err, awsResult) => {
        if (err) {
          console.error("Error signing up:", err);
          return res.status(500).json({ error: "Error signing up" });
        }

        const db = await getDbConnection("react-auth-db");

        const startingInfo = {
          hairColor: "",
          favoriteFood: "",
          bio: "",
        };

        const result = await db.collection("users").insertOne({
          email,
          info: startingInfo,
        });

        const userId = result.insertedId;

        jwt.sign(
          { id: userId, isVerified: false, email, info: startingInfo },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          },
          (err, token) => {
            if (err) {
              console.error("Error signing token:", err);
              return res.status(500).json({ error: "Error signing token" });
            }
            res.status(200).json({ token });
          }
        );
      }
    );
  },
};
