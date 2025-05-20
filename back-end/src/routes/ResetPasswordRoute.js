import bcrypt from "bcrypt";
import { getDbConnection } from "../db";

export const resetPasswordRoute = {
  path: "/api/users/:passwordResetCode/reset-password",
  method: "put",
  handler: async (req, res) => {
    const { passwordResetCode } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    try {
      const db = getDbConnection("react-auth-db");
      //   const user = await db.collection("users").findOne({ passwordResetCode });

      //   if (!user) {
      //     return res.status(404).json({ error: "Invalid password reset code" });
      //   }

      const newSalt = uuid();
      const pepper = process.env.PEPPER_STRING;
      const hashedPassword = await bcrypt.hash(salt + newPassword + pepper, 10);
      const result = await db.collection("users").findOneAndUpdate(
        { passwordResetCode },
        {
          $set: { passwordHash: hashedPassword, salt: newSalt },
          $unset: { passwordResetCode: "" },
        },
        { returnDocument: "after" }
      );

      if (!result) {
        return res.status(404).json({ error: "Invalid password reset code" });
      }
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
