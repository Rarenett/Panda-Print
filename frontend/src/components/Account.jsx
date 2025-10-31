import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";


import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "151808131440-2mbq1163sb3i49fkao08225v2ea0rg5p.apps.googleusercontent.com"; // Replace with your Google client ID

const Account = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  // State for active form and form fields
  const [activeForm, setActiveForm] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Register user handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/register/`, formData);
      alert("User registered successfully!");
      setActiveForm("login"); // Switch to login after registration
    } catch (error) {
      alert("Registration failed. Check details.");
    }
  };

  // Login user handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login/`, {
        email: formData.email,
        password: formData.password,
      });
      // Instead of directly setting localStorage, call the context login
      login(res.data.access, res.data.refresh, formData.email);
      alert("Login Successful");
      navigate("/profile");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  // similar change for handleGoogleSuccess
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/google-login/`,
        { credential: credentialResponse.credential }
      );
      login(res.data.access, res.data.refresh, res.data.user.email);
      alert("Google login successful");
      navigate("/profile");
    } catch (err) {
      alert("Google login failed.");
    }
  };

  const handleGoogleError = () => {
    alert("Google login failed.");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <section className="account-wrapper">
        {/* Animated Background */}
        <div className="auth-background">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
        </div>

        <div className="account-content">
          <div className={`container container-sm ${activeForm === "register" ? "wider" : ""}`}>
            {/* Removed toggle buttons section */}

            {/* Form Container */}
            <div className="form-card">
              <div className={`form-container ${activeForm === "register" ? "register-active" : ""}`}>

                {/* Login Form */}
                {activeForm === "login" && (
                  <div className="form-section login-form active">
                    <h4 className="form-title">Welcome Back!</h4>
                    <p className="form-subtitle">Login to your account</p>
                    <form className="auth-form" onSubmit={handleLogin}>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-wrapper">
                          <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-input"
                            placeholder="Create password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                          <span
                            className="show-password-icon"
                            onClick={() => setShowPassword((v) => !v)}
                            style={{ position: "absolute", right: 18, cursor: "pointer", zIndex: 2 }}
                            tabIndex={0}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </div>
                   

                      <div className="form-options">
                        <label className="checkbox-wrapper">
                          <input type="checkbox" />
                          <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-link">Forgot Password?</a>
                      </div>
                      <button type="submit" className="submit-btn">
                        Login Now
                      </button>
                    </form>
                    <div className="google-login-container">
                      <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                    </div>
                    <p className="switch-form-text">
                      Don't have an account?{" "}
                      <button className="switch-form-btn" onClick={() => setActiveForm("register")}>Sign up</button>
                    </p>
                  </div>
                )}

                {/* Register Form */}
                {activeForm === "register" && (
                  <div className="form-section register-form active">
                    <h4 className="form-title">Create Account</h4>
                    <p className="form-subtitle">Sign up to get started</p>
                    <form className="auth-form" onSubmit={handleRegister}>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <div className="input-wrapper">
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter your name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Email Address</label>
                          <div className="input-wrapper">
                            <input
                              type="email"
                              className="form-input"
                              placeholder="Enter your email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Phone Number</label>
                          <div className="input-wrapper">
                            <input
                              type="tel"
                              className="form-input"
                              placeholder="Enter your phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Password</label>
                          <div className="input-wrapper">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-input"
                              placeholder="Create password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                            <span
                              className="show-password-icon"
                              onClick={() => setShowPassword((prev) => !prev)}
                              tabIndex={0}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-wrapper">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-input"
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                          <span
                            className="show-password-icon"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            tabIndex={0}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </div>
                      <div className="form-options">
                        <label className="checkbox-wrapper">
                          <input type="checkbox" required />
                          <span>I agree to the Terms & Conditions</span>
                        </label>
                      </div>
                      <button type="submit" className="submit-btn">
                        Create Account
                      </button>
                    </form>
                    <p className="switch-form-text">
                      Already have an account?{" "}
                      <button className="switch-form-btn" onClick={() => setActiveForm("login")}>Login</button>
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </GoogleOAuthProvider>
  );
};

export default Account;
