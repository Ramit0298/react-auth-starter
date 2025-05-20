import { useState } from "react";
import axios from "axios";
import { EmailVerificationFail } from "./EmailVerificationFail";
import { EmailVerificationSuccess } from "./EmailVerificationSuccess";
import { useToken } from "../auth/useToken";
import { useQueryParams } from "../util/useQueryParams";

export const EmailVerificationCodePage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);

  const [verificationString, setVerificationString] = useState("");
  const { email } = useQueryParams();
  const [, setToken] = useToken();

  const onSubmitVerificationString = async () => {
    try {
      const response = await axios.put("/api/verify-email", {
        email,
        verificationString,
      });
      setToken(response.data.token);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error verifying email:", error);
      setIsFailure(true);
    }
  };

  if (isSuccess) {
    return <EmailVerificationSuccess />;
  }
  if (isFailure) {
    return <EmailVerificationFail />;
  }

  return (
    <div className="content-container">
      <h1>Please verify your Email</h1>
      <p>
        You should have received a verification code at your email address.
        Please enter the code to verify your email.
      </p>
      <input
        placeholder="e.g. 123456"
        value={verificationString}
        onChange={(e) => setVerificationString(e.target.value)}
      />
      <button onClick={onSubmitVerificationString}>Submit</button>
    </div>
  );
};
