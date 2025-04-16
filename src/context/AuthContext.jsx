// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";

const API_BASE = "https://v2.api.noroff.dev";
const HOLIDAZE_BASE = "https://v2.api.noroff.dev/holidaze";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { data } = res.data;
      const accessToken = data.accessToken;
      localStorage.setItem("accessToken", accessToken);

      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
      };

      const profileRes = await axios.get(
        `${HOLIDAZE_BASE}/profiles/${data.name}`,
        options
      );

      setUser(profileRes.data.data);
    } catch (err) {
      throw new Error(err.response?.data?.errors?.[0]?.message || "Login failed");
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
      });

      const { data } = res.data;
      setUser(data);
    } catch (err) {
      throw new Error(err.response?.data?.errors?.[0]?.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
