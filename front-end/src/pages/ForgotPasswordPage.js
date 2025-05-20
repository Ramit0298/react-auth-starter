import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const onSubmitClicked = async () => {
    setError("");
    setSuccess(false);
    try {
      const response = await axios.put(`/api/forgot-password/${email}`);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  return success ? (
    <div className="content-container">
      <h1>Success</h1>
      <p>Check your email for a reset password link</p>
    </div>
  ) : (
    <div className="content-container">
      <h1>Forgot Password</h1>
      <p>
        Enter your email address and we will send you a link to reset your
        password
      </p>
      {error && <div className="fail">{error}</div>}
      <input
        type="email"
        placeholder="Please enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button disabled={!email} onClick={onSubmitClicked}>
        Send Reset Link
      </button>
    </div>
  );
};
