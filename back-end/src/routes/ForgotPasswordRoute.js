import { v4 as uuid } from "uuid";
import { sendEmail } from "../util/sendEmail";
import { getDbConnection } from "../db";

export const forgotPasswordRoute = {
  path: "/api/forgot-password/:email",
  method: "put",
  handler: async (req, res) => {
    const { email } = req.params;
    const db = getDbConnection("react-auth-db");

    const passwordResetCode = uuid();
    // const user = await db.collection("users").findOne({ email });
    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    const result = await db
      .collection("users")
      .updateOne({ email }, { $set: { passwordResetCode } });

    if (result.modifiedCount > 0) {
      try {
        await sendEmail({
          to: email,
          from: "raj.linklearn@gmail.com",
          subject: "Password Reset",
          text: `Click the link to reset your password: http://localhost:3000/reset-password/${passwordResetCode}`,
        });
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email" });
      }
    }

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  },
};
