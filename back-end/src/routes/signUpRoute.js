import { getDbConnection } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../util/sendEmail";

export const signUpRoute = {
  path: "/api/signup",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;

    const db = getDbConnection("react-auth-db");
    const user = await db.collection("users").findOne({ email });
    if (user) {
      return res.sendStatus(409).json({
        error: "User already exists",
      });
    }

    const salt = uuid();
    const pepper = process.env.PEPPER_STRING;
    const passwordHash = await bcrypt.hash(salt + password + pepper, 10);
    const verificationString = uuid();
    const startingInfo = {
      hairColor: "",
      favoriteFood: "",
      bio: "",
    };

    const result = await db.collection("users").insertOne({
      email,
      passwordHash,
      salt,
      info: startingInfo,
      isVerified: false,
      verificationString,
    });

    const { insertedId } = result;

    try {
      await sendEmail({
        to: email,
        from: "raj.linklearn@gmail.com",
        subject: "Verify your email",
        text: `Thank you for signing up! Please verify your email by clicking the link below: http://localhost:3000/verify-email/${verificationString}`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Error sending email", error });
    }

    jwt.sign(
      {
        id: insertedId,
        email,
        info: startingInfo,
        isVerified: false,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).json({ token });
      }
    );
  },
};
