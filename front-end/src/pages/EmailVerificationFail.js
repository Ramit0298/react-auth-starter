import { useNavigate } from "react-router-dom";

export const EmailVerificationFail = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <div className="content-container">
      <h1>Uh oh...</h1>
      <p>Something went wrong while trying to verify your email.</p>
      <button onClick={handleClick}>Back to Sign Up</button>
    </div>
  );
};
