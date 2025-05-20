import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../util/useQueryParams";

export const PleaseVerifyEmailPage = () => {
  const navigate = useNavigate();
  const { email } = useQueryParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, email]);

  return (
    <div className="content-container">
      <h1>Thanks for Signing Up!</h1>
      <p>
        A verification email has been sent to your email address. Please check
        your inbox and click the link in the email to verify your account. This
        will unlock all the features of the app.
      </p>
    </div>
  );
};
