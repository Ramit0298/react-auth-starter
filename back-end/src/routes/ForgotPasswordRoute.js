import { CognitoUser } from "amazon-cognito-identity-js";
import { awsUserPool } from "../util/awsUserPool";

export const forgotPasswordRoute = {
  path: "/api/forgot-password/:email",
  method: "put",
  handler: async (req, res) => {
    const { email } = req.params;

    new CognitoUser({
      Username: email,
      Pool: awsUserPool,
    }).forgotPassword({
      onSuccess: (data) => {
        console.log("Code sent to email:", data);
        return res.status(200).json({
          message: "Password reset code sent to email",
          data,
        });
      },
      onFailure: (err) => {
        console.error("Error sending code:", err);
        return res.status(500).json({
          error: "Error sending password reset code",
          details: err,
        });
      },
    });
  },
};
