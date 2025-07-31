import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { getRecaptchaSiteKey } from "../../config/recaptcha";
import { getAuthUrl } from "../../config/api";

const Section1 = ({ darkMode }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${getRecaptchaSiteKey()}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="recaptcha"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Execute reCAPTCHA
  const executeRecaptcha = async () => {
    try {
      if (window.grecaptcha) {
        const token = await window.grecaptcha.execute(getRecaptchaSiteKey(), {
          action: "login",
        });
        setRecaptchaToken(token);
        return token;
      }
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      toast.error("reCAPTCHA verification failed");
    }
    return null;
  };

  // Check if user is verified
  const checkUserVerification = async (email) => {
    try {
      const response = await axios.get(
        `${getAuthUrl("CHECK_VERIFICATION")}/${email}`
      );
      setIsVerified(response.data.verified);
      return response.data.verified;
    } catch (error) {
      console.error("Error checking verification status:", error);
      return false;
    }
  };

  // Handle email input change
  const handleEmailChange = async (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (emailValue && emailValue.includes("@")) {
      const verified = await checkUserVerification(emailValue);
      setIsVerified(verified);
      setShowOtpInput(!verified);
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const recaptchaToken = await executeRecaptcha();
    if (!recaptchaToken) {
      return;
    }

    setIsLoading(true);
    try {
      // Determine role based on email domain
      let role = "user";
      if (
        ["kumarprasadaman1234@gmail.com", "drizzle003.ace@gmail.com"].includes(
          email
        )
      ) {
        role = "admin";
      }

      await axios.post(getAuthUrl("SEND_OTP"), {
        email,
        role,
        recaptchaToken,
      });

      setIsOtpSent(true);
      setShowOtpInput(true);
      toast.success("OTP sent successfully to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    const recaptchaToken = await executeRecaptcha();
    if (!recaptchaToken) {
      return;
    }

    setIsLoading(true);
    try {
      // Determine role based on email domain
      let role = "user";
      if (
        ["kumarprasadaman1234@gmail.com", "drizzle003.ace@gmail.com"].includes(
          email
        )
      ) {
        role = "admin";
      }

      const response = await axios.post(getAuthUrl("VERIFY_OTP"), {
        email,
        otp,
        role,
        recaptchaToken,
      });

      const user = response.data.user;
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", true);

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Direct login for verified users
  const handleDirectLogin = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const recaptchaToken = await executeRecaptcha();
    if (!recaptchaToken) {
      return;
    }

    setIsLoading(true);
    try {
      // Determine role based on email domain
      let role = "user";
      if (
        ["kumarprasadaman1234@gmail.com", "drizzle003.ace@gmail.com"].includes(
          email
        )
      ) {
        role = "admin";
      }

      const response = await axios.post(getAuthUrl("DIRECT_LOGIN"), {
        email,
        role,
        recaptchaToken,
      });

      const user = response.data.user;
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", true);

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Error during direct login:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`p-10 rounded-lg shadow-lg text-center max-w-lg w-full ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-3xl mb-6 font-bold">
          Sign in to your Lost & Found - NCU Account
        </h2>

        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-black placeholder-gray-500"
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use @ncuindia.edu for students, specific emails for admins
            </p>
          </div>

          {/* Show appropriate login method based on verification status */}
          {email && (
            <div className="space-y-4">
              {isVerified ? (
                // Direct login for verified users
                <button
                  onClick={handleDirectLogin}
                  disabled={isLoading}
                  className={`w-full p-3 rounded-lg font-medium transition-colors ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Logging in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              ) : (
                // OTP verification for new users
                <div className="space-y-4">
                  {!isOtpSent ? (
                    <button
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className={`w-full p-3 rounded-lg font-medium transition-colors ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <FaSpinner className="animate-spin mr-2" />
                          Sending OTP...
                        </div>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-black placeholder-gray-500"
                          }`}
                        />
                      </div>
                      <button
                        onClick={handleVerifyOtp}
                        disabled={isLoading}
                        className={`w-full p-3 rounded-lg font-medium transition-colors ${
                          isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <FaSpinner className="animate-spin mr-2" />
                            Verifying...
                          </div>
                        ) : (
                          "Verify OTP"
                        )}
                      </button>
                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className={`w-full p-2 text-sm rounded-lg transition-colors ${
                          isLoading
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-700"
                        }`}
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Info text */}
          <div className="text-sm text-gray-500">
            {isVerified
              ? "Welcome back! You can login directly with your email."
              : "First time user? We'll send you an OTP to verify your email."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1;
