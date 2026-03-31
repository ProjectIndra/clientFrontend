import { Link } from "react-router-dom";
import { apiCall } from "../Api";
import { useState } from "react";
import Toast from "../components/ToastService";
import { validators } from "../utils/validators";
import {AuthHandler} from "../utils/authHandler";


function Register() {
const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info", visible: false });
  const showToast = (message, type = "info") => {
    setToast({ message, type, visible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };
  

const handleError = (message) => {
  setError(message);
  showToast(message, "error");
};

const handleSubmit = async (event) => {
  event.preventDefault();
  setError(null);

  const { email, username, password, confirmPassword } = event.target;

  const emailValue = email.value.trim();
  const usernameValue = username.value.trim();
  const passwordValue = password.value;
  const confirmPasswordValue = confirmPassword.value;

  // VALIDATION
  const usernameError = validators.username(usernameValue);
  if (usernameError) return handleError(usernameError);

  const emailError = validators.email(emailValue);
  if (emailError) return handleError(emailError);

  const passwordError = validators.password(passwordValue);
  if (passwordError) return handleError(passwordError);

  if (passwordValue !== confirmPasswordValue) {
    return handleError("Passwords do not match");
  }

  try {
    setIsLoading(true);

   const res = await apiCall("post", "/register", {
      email: emailValue,
      username: usernameValue,
      password: passwordValue,
    });

    showToast("Registered successfully! Redirecting to login.", "success");

    AuthHandler.login(res.token);
  } catch (err) {
    const message =
      err ||
      "Registration failed";

    handleError(message);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emeraldLight via-emeraldSemi to-primary px-4">
      <div className="flex flex-col md:flex-row max-w-6xl w-full rounded-3xl overflow-hidden shadow-lg">
        {/* Left - Registration Form */}
        <div className="relative w-full md:w-1/2 bg-pureWhite p-10 flex flex-col justify-center items-center">
          {isLoading && (
            <div className="absolute inset-0 bg-palette-surface bg-opacity-75 flex items-center justify-center z-10">
              <div className="w-10 h-10 border-4 border-lime-400 border-t-lime-200 rounded-full animate-spin"></div>
            </div>
          )}
          <h2 className="text-4xl font-bold text-greenDark mb-6 text-center">
            Register
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 w-full max-w-[320px]"
          >
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="px-4 py-3 border border-grayBorder rounded-full focus:outline-none focus:ring-2 focus:ring-greenFocus"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="bg-emeraldBase text-white font-semibold py-2 rounded-full hover:bg-emeraldSemi transition"
            >
              Register
            </button>
          </form>

          <div className="text-errorRed text-[14px] font-normal min-h-[20px] mt-2">
            {error}
          </div>

          <div className="mt-6 text-sm text-grayText text-center">
            <p>
              Already registered?{" "}
              <Link
                to="/login"
                className="text-greenDark font-semibold underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Right - Image (hidden on mobile) */}
        <div className="w-1/2 hidden md:flex bg-gradient-to-br from-emeraldMid via-emeraldSemi to-primary items-center justify-center relative">
          <img
            src="https://img.freepik.com/free-vector/computer-cloud-network-technology_53876-100678.jpg"
            alt="Register"
            className="h-full w-full object-cover rounded-tr-2xl rounded-br-2xl shadow-md"
          />
        </div>
      </div>
      {/* Toast */}
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
    
  );
}

export default Register;
