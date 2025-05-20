import { useNavigate } from "react-router-dom";

export const PasswordResetFail = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="content-container">
      <h1>Uh oh...</h1>
      <p>Something went wrong while trying to reset your password.</p>
      <button onClick={handleClick}>Back to Log In</button>
    </div>
  );
};
