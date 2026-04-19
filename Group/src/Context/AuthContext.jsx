import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function safeParse(key, fallbackValue) {
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
  const [users, setUsers] = useState(() => safeParse("users", []));
  const [currentUser, setCurrentUser] = useState(() =>
    safeParse("currentUser", null)
  );

  useEffect(() => {
    try {
      localStorage.setItem("users", JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  }, [users]);

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

  const register = (newUser) => {
    const exists = users.some(
      (user) => user.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (exists) {
      return { success: false, message: "Email already exists" };
    }

    const savedUser = {
      ...newUser,
      role: newUser.email.toLowerCase() === "admin@hotel.com" ? "admin" : "user",
    };

    setUsers((prev) => [...prev, savedUser]);
    setCurrentUser(savedUser);

    return { success: true, user: savedUser };
  };

  const login = (email, password) => {
    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      return { success: false, message: "Invalid email or password" };
    }

    setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        register,
        login,
        logout,
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