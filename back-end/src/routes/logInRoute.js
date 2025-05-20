import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDbConnection } from "../db";

export const logInRoute = {
  path: "/api/login",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;

    const db = getDbConnection("react-auth-db");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const { _id: id, passwordHash, salt, info, isVerified } = user;
    const pepper = process.env.PEPPER_STRING;
    const isPasswordValid = await bcrypt.compare(
      salt + password + pepper,
      passwordHash
    );

    if (isPasswordValid) {
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
            res.sendStatus(500);
          }

          res.status(200).json({ token });
        }
      );
    } else {
      res.status(401).json({
        error: "Invalid email or password",
      });
    }
  },
};
