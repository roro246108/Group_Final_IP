import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function getStoredUser() {
  try {
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");

    const storedUser = localUser || sessionUser;

    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Error parsing stored user:", error);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);

  useEffect(() => {
    const syncAuthState = () => {
      setCurrentUser(getStoredUser());
      setToken(getStoredToken());
    };

    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setCurrentUser(null);
    setToken(null);
  };

  const refreshAuth = () => {
    setCurrentUser(getStoredUser());
    setToken(getStoredToken());
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        logout,
        refreshAuth,
        isAuthenticated: !!token && !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}