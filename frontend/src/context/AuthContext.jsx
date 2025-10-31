import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Logout function - defined before being used in useEffect
  const logout = () => {
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("email");
  };

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (!token) return; // Only set inactivity timeout if logged in

    const SESSION_LIMIT = 1800 * 1000; // 30 minutes
    let lastActivity = Date.now();
    const updateActivity = () => { lastActivity = Date.now(); };
    const events = ["mousemove", "mousedown", "click", "scroll", "keypress"];
    
    events.forEach(evt => window.addEventListener(evt, updateActivity));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_LIMIT) {
        logout();
        clearInterval(interval);
        events.forEach(evt => window.removeEventListener(evt, updateActivity));
      }
    }, 60 * 1000); // Check every minute

    return () => {
      clearInterval(interval);
      events.forEach(evt => window.removeEventListener(evt, updateActivity));
    };
  }, [token]); // Re-run when token changes

  const login = (accessToken, refreshToken, email) => {
    setToken(accessToken);
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("email", email);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
