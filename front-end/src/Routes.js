import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserInfoPage } from "./pages/UserInfoPage";
import { LogInPage } from "./pages/LogInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { PrivateRoute } from "./auth/PrivateRoute";
import { PleaseVerifyEmailPage } from "./pages/PleaseVerifyEmailPage";
import { EmailVerificationLandingPage } from "./pages/EmailVerificationLandingPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { PasswordResetLandingPage } from "./pages/PasswordResetLandingPage";
import { EmailVerificationCodePage } from "./pages/EmailVerificationCodePage";

export const RoutesComponent = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<UserInfoPage />} />
        </Route>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/please-verify" element={<PleaseVerifyEmailPage />} />
        <Route path="/verify-email" element={<EmailVerificationCodePage />} />
        <Route
          path="/verify-email/:verificationString"
          element={<EmailVerificationLandingPage />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/" element={<PasswordResetLandingPage />} />
      </Routes>
    </Router>
  );
};
