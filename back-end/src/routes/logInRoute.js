import jwt from "jsonwebtoken";
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";
import { getDbConnection } from "../db";
import { awsUserPool } from "../util/awsUserPool";

export const logInRoute = {
  path: "/api/login",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;

    new CognitoUser({ Username: email, Pool: awsUserPool }).authenticateUser(
      new AuthenticationDetails({
        Username: email,
        Password: password,
      }),
      {
        onSuccess: async (result) => {
          const db = getDbConnection("react-auth-db");
          const user = await db.collection("users").findOne({ email });
          const { _id: id, info, isVerified } = user;

          jwt.sign(
            {
              id,
              email,
              info,
              isVerified,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            },
            (err, token) => {
              if (err) {
                res.status(500).json(err);
              }

              res.status(200).json({ token });
            }
          );
        },
        onFailure: (err) => {
          res.status(401).json({
            error: "Invalid email or password",
          });
        },
      }
    );
  },
};
