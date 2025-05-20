import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useToken } from "../auth/useToken";
import { EmailVerificationFail } from "./EmailVerificationFail";
import { EmailVerificationSuccess } from "./EmailVerificationSuccess";

export const EmailVerificationLandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const { verificationString } = useParams();
  const [, setToken] = useToken();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.put("/api/verify-email", {
          verificationString,
        });
        setToken(response.data.token);
        setIsSuccess(true);
      } catch (error) {
        console.error("Error verifying email:", error);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [verificationString, setToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isSuccess) {
    return <EmailVerificationFail />;
  }
  return <EmailVerificationSuccess />;
};
