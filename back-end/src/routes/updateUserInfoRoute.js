import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDbConnection } from "../db";

export const updateUserInfoRoute = {
  path: "/api/users/:userId",
  method: "put",
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    const updates = (({ favoriteFood, hairColor, bio }) => ({
      favoriteFood,
      hairColor,
      bio,
    }))(req.body);

    if (!authorization) {
      return res.status(401).json({ error: "No authorization headers sent" });
    }

    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      const { id, isVerified } = decoded;
      if (id !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this user" });
      }
      if (!isVerified) {
        return res
          .status(403)
          .json({ error: "You need to verify your email before updating" });
      }

      const db = getDbConnection("react-auth-db");

      const result = await db.collection("users").findOneAndUpdate(
        { _id: ObjectId.createFromHexString(userId) }, // alternative to new ObjectId(userId)
        { $set: { info: updates } },
        { returnDocument: "after" } // Use this instead of returnOriginal
      );

      const { email, isVerified: userIsVerified, info } = result;
      jwt.sign(
        {
          id,
          email,
          isVerified: userIsVerified,
          info,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) {
            return res.status(500).json({ error: "Error signing token" });
          }
          return res.status(200).json({
            token,
          });
        }
      );
    });
  },
};
