import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/authApi";

const AuthContext = createContext();

function readStoredJson(key, fallbackValue) {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue || storedValue === "undefined" || storedValue === "null") {
      return fallbackValue;
    }
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    localStorage.removeItem(key);
    return fallbackValue;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readStoredJson("currentUser", null));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("currentUser");
      }
    } catch (error) {
      console.error("Error saving currentUser:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) setIsAuthLoading(false);
        return;
      }

      try {
        const result = await authApi.me();
        if (isMounted) {
          setCurrentUser(result.user);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }
    };

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  const register = async (newUser) => {
    try {
      const result = await authApi.register(newUser);
      localStorage.setItem("token", result.token);
      setCurrentUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authApi.login({ email, password });
      localStorage.setItem("token", result.token);
      setCurrentUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // logout should still clear local auth state
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout,
        isAuthLoading,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
