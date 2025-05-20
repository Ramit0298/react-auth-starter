import { CognitoUser } from "amazon-cognito-identity-js";
import { awsUserPool } from "../util/awsUserPool";

export const resetPasswordRoute = {
  path: "/api/users/:passwordResetCode/reset-password",
  method: "put",
  handler: async (req, res) => {
    const { passwordResetCode } = req.params;
    const { email, newPassword } = req.body;

    new CognitoUser({
      Username: email,
      Pool: awsUserPool,
    }).confirmPassword(passwordResetCode, newPassword, {
      onSuccess: () => {
        console.log("Password reset successful");
        return res.status(200).json({
          message: "Password reset successful",
        });
      },
      onFailure: (err) => {
        console.error("Error resetting password:", err);
        return res.status(500).json({
          error: "Error resetting password",
          details: err,
        });
      },
    });
  },
};
