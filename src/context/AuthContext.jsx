// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://v2.api.noroff.dev';
const HOLIDAZE_BASE = 'https://v2.api.noroff.dev/holidaze';
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    try {
      // Step 1: Log in the user
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { data } = res.data;
      const accessToken = data.accessToken;
      const userName = data.name;

      // Step 2: Save token for future API requests
      localStorage.setItem('accessToken', accessToken);

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'X-Noroff-API-Key': API_KEY,
      };

      // Step 3: Fetch complete user profile with venues and bookings
      const profileRes = await axios.get(
        `${HOLIDAZE_BASE}/profiles/${userName}?_bookings=true&_venues=true`,
        { headers }
      );

      // Step 4: Update context with user data
      const fetchedUser = profileRes.data.data;
      setUser(fetchedUser);
      return fetchedUser;
    } catch (err) {
      throw new Error(
        err.response?.data?.errors?.[0]?.message || 'Login failed'
      );
    }
  };

  const register = async ({ name, email, password, venueManager }) => {
    try {
      // Step 1: Register user
      await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
      });

      // Step 2: Login immediately
      const loginRes = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      const { data } = loginRes.data;
      const accessToken = data.accessToken;
      localStorage.setItem('accessToken', accessToken);

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'X-Noroff-API-Key': API_KEY,
      };

      // Step 3: Update profile to set venueManager
      await axios.put(
        `${HOLIDAZE_BASE}/profiles/${data.name}`,
        {
          venueManager,
        },
        { headers }
      );

      // Step 4: Fetch full profile
      const profileRes = await axios.get(
        `${HOLIDAZE_BASE}/profiles/${data.name}`,
        { headers }
      );
      setUser(profileRes.data.data);
    } catch (err) {
      throw new Error(
        err.response?.data?.errors?.[0]?.message || 'Registration failed'
      );
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
