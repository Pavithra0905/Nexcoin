// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  // Get initial photo from localStorage
  const getInitialPhoto = () => {
    return localStorage.getItem("profilePhoto") || "";
  };

  const [photo, setPhoto] = useState(getInitialPhoto);

  // Sync with localStorage changes across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const newPhoto = localStorage.getItem("profilePhoto") || "";
      setPhoto(newPhoto);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Also update localStorage whenever photo state changes
  useEffect(() => {
    if (photo) {
      localStorage.setItem("profilePhoto", photo);
    }
  }, [photo]);

  return (
    <UserContext.Provider value={{ photo, setPhoto }}>
      {children}
    </UserContext.Provider>
  );
};
