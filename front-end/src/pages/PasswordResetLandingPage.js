import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PasswordResetSuccess } from "./PasswordResetSuccess";
import { PasswordResetFail } from "./PasswordResetFail";

export const PasswordResetLandingPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);

  const { passwordResetCode } = useParams();

  const onResetPasswordClicked = async () => {
    try {
      const response = await axios.put(
        `/api/users/${passwordResetCode}/reset-password`,
        {
          newPassword: password,
        }
      );
      if (response.status === 200) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setIsFailure(true);
    }
  };

  if (isSuccess || isFailure) {
    return isSuccess ? <PasswordResetSuccess /> : <PasswordResetFail />;
  }

  //   if (isSuccess) return <PasswordResetSuccess />;
  //   if (isFailure) return <PasswordResetFail />;

  return (
    <div className="content-container">
      <h1>Reset Password</h1>
      <p>Please enter a new password</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
      />
      <button
        disabled={!password || !confirmPassword || password !== confirmPassword}
        onClick={onResetPasswordClicked}
      >
        Reset Password
      </button>
    </div>
  );
};
