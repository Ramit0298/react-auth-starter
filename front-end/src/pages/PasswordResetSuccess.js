import { useNavigate } from "react-router-dom";

export const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="content-container">
      <h1>Success!</h1>
      <p>
        Your password has been successfully reset! You can now log in with your
        new password.
      </p>
      <button onClick={handleClick}>Back to Login</button>
    </div>
  );
};
