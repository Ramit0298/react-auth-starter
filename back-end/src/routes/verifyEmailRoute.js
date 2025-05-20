import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { getDbConnection } from "../db";

export const verifyEmailRoute = {
  path: "/api/verify-email",
  method: "put",
  handler: async (req, res) => {
    const { verificationString } = req.body;
    const db = getDbConnection("react-auth-db");

    const result = await db.collection("users").findOne({
      verificationString,
    });

    console.log(verificationString);
    console.log(result);

    if (!result) {
      return res
        .status(401)
        .json({ error: "The email verification code is incorrect" });
    }

    const { _id: id, email, info } = result;
    await db
      .collection("users")
      .updateOne(
        { _id: id },
        { $set: { isVerified: true } },
        { returnDocument: "after" }
      );

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
  },
};
