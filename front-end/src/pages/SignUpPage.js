import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToken } from "../auth/useToken";

export const SignUpPage = () => {
  const [token, setToken] = useToken();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSignUpClicked = async () => {
    setError("");
    try {
      const response = await axios.post("/api/signup", {
        email,
        password,
      });
      setToken(response.data.token);
      navigate(`/please-verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };
  return (
    <div className="content-container">
      <h1>Sign Up</h1>
      {error && <div className="fail">{error}</div>}
      <input
        type="text"
        placeholder="someone@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <hr />
      <button
        disabled={!email || !password || password !== confirmPassword}
        onClick={onSignUpClicked}
      >
        Sign Up
      </button>
      <button onClick={() => navigate("/login")}>
        Already have an account? Log In
      </button>
    </div>
  );
};
