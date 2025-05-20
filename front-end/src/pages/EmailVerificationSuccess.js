import { useNavigate } from "react-router-dom";

export const EmailVerificationSuccess = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="content-container">
      <h1>Success!</h1>
      <p>
        Your email has been successfully verified! Now you can use all the
        features of the app.
      </p>
      <button onClick={handleClick}>Go to Home Page</button>
    </div>
  );
};
