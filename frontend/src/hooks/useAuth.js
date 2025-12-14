// frontend/src/hooks/useAuth.js
import { useState, useEffect, useRef } from "react";
import { useCallback } from "react";
import axios from "axios";

const USER_CACHE_KEY = "nexTalk_user_cache";

export const useAuth = () => {
  const apiRef = useRef(axios.create({ baseURL: import.meta.env.VITE_API_URL }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    // Load cached user data immediately for instant display
    try {
      const cached = localStorage.getItem(USER_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [initialLoading, setInitialLoading] = useState(true);

  const storeToken = (token) => {
    localStorage.setItem(import.meta.env.VITE_JWT_KEY, token);
  };

  const getToken = () => localStorage.getItem(import.meta.env.VITE_JWT_KEY);

  const cacheUser = (userData) => {
    if (userData) {
      try {
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData));
      } catch (err) {
        console.error("Failed to cache user data:", err);
      }
    }
  };

  const fetchUser = useCallback(async (showLoading = false) => {
    const token = getToken();
    if (!token) {
      setInitialLoading(false);
      return;
    }
    
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      const { data } = await apiRef.current.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      cacheUser(data); // Cache the user data
    } catch (err) {
      console.error("Failed to fetch user:", err);
      // Clear cache on auth error
      localStorage.removeItem(USER_CACHE_KEY);
      if (err.response?.status === 401) {
        setUser(null);
        localStorage.removeItem(import.meta.env.VITE_JWT_KEY);
        window.location.reload();
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiRef.current.post("/auth/login", { email, password });
      storeToken(data.token);
      await fetchUser(false); // ✅ fetch user profile right after login
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiRef.current.post("/auth/register", {
        username,
        email,
        password,
      });
      storeToken(data.token);
      await fetchUser(false); // ✅ fetch user profile right after register
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(import.meta.env.VITE_JWT_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
    setUser(null);
    window.location.reload();
  };

  // ✅ Load cached user immediately, then fetch fresh data in background
  useEffect(() => {
    const token = getToken();
    const hasCachedUser = user !== null;
    
    if (token && hasCachedUser) {
      // We have cached data, fetch fresh data in background without blocking
      setInitialLoading(false);
      fetchUser(false);
    } else if (token) {
      // No cached data, fetch with loading state
      fetchUser(true);
    } else {
      setInitialLoading(false);
    }
  }, [fetchUser]); // Include fetchUser in dependencies

  return { login, register, logout, getToken, loading, error, user, initialLoading };
};
