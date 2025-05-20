import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToken } from "../auth/useToken";
import { useQueryParams } from "../util/useQueryParams";

export const LogInPage = () => {
  const [, setToken] = useToken();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [googleOauthUrl, setGoogleOauthUrl] = useState("");
  const { token: oauthToken } = useQueryParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (oauthToken) {
      setToken(oauthToken);
      navigate("/");
    }
  }, [oauthToken, setToken, navigate]);

  useEffect(() => {
    const fetchGoogleOauthUrl = async () => {
      try {
        const response = await axios.get("/auth/google/url");
        setGoogleOauthUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching Google OAuth URL:", error);
      }
    };

    fetchGoogleOauthUrl();
  }, []);

  const onLoginClicked = async () => {
    setError("");
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      setToken(response.data.token);
      navigate("/");
    } catch (err) {
      if (err) {
        setError(err.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };
  return (
    <div className="content-container">
      <h1>Log In</h1>
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
      <hr />
      <button disabled={!email || !password} onClick={onLoginClicked}>
        Log In
      </button>
      <button onClick={() => navigate("/forgot-password")}>
        Forgot your password?
      </button>
      <button onClick={() => navigate("/signup")}>
        Don't have an account? Sign Up
      </button>
      <button
        disabled={!googleOauthUrl}
        onClick={() => {
          window.location.href = googleOauthUrl;
        }}
      >
        Log in with Google
      </button>
    </div>
  );
};
