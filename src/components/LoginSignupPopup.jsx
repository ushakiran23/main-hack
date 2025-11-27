import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginSignupPopup.css";
import { login, register } from "../services/authService";

const LoginSignupPopup = ({ onClose, onLogin, initialMode = "login" }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Close animation
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose();
      }, 300); // match CSS animation duration
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  const handleClose = () => {
    setIsClosing(true);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setResetEmail("");
    setMessage("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        // REAL login via backend
        const res = await login(email, password);
        console.log("Login response:", res);

        if (res.token) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("userEmail", email);
          setMessage("Login successful! 🎉");

          setTimeout(() => {
            onLogin && onLogin();
            handleClose();
            navigate("/");
          }, 800);
        } else {
          // Backend sends plain string on error (e.g. "Invalid email or password")
          setMessage(typeof res === "string" ? res : "Invalid email or password");
        }
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          setMessage("Passwords do not match!");
          return;
        }

        // REAL signup via backend
        const res = await register(email, password);
        console.log("Register response:", res);

        if (res.token) {
          // Auto-login on successful signup
          localStorage.setItem("token", res.token);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", name);
          localStorage.setItem("memberSince", new Date().toLocaleDateString());

          setMessage("Account created successfully! 🎉");

          setTimeout(() => {
            onLogin && onLogin();
            handleClose();
            navigate("/");
          }, 800);
        } else {
          // e.g. "Email already registered"
          setMessage(typeof res === "string" ? res : "Could not create account.");
        }
      } else if (mode === "forgot") {
        // You don't have backend for forgot yet, so just show info
        setMessage("Password reset link (demo) sent to your email!");
        setTimeout(() => {
          setMode("login");
          setMessage("");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
      <div className={`modal-content ${isClosing ? "closing" : ""}`}>
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>

        {mode === "login" && (
          <>
            <h2>Welcome Back</h2>
            <p className="modal-subtitle">Sign in to your TravelEase account</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="form-options">
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() => switchMode("forgot")}
                >
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className="switch-text">
              Don't have an account?
              <button
                className="switch-btn"
                type="button"
                onClick={() => switchMode("signup")}
              >
                Sign Up
              </button>
            </p>
          </>
        )}

        {mode === "signup" && (
          <>
            <h2>Create Account</h2>
            <p className="modal-subtitle">
              Join TravelEase for amazing travel experiences
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
            <p className="switch-text">
              Already have an account?
              <button
                className="switch-btn"
                type="button"
                onClick={() => switchMode("login")}
              >
                Sign In
              </button>
            </p>
          </>
        )}

        {mode === "forgot" && (
          <>
            <h2>Reset Password</h2>
            <p className="modal-subtitle">
              Enter your email to receive reset instructions
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <p className="switch-text">
              Remember your password?
              <button
                className="switch-btn"
                type="button"
                onClick={() => switchMode("login")}
              >
                Back to Sign In
              </button>
            </p>
          </>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default LoginSignupPopup;
