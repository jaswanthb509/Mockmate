import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data.data;

    localStorage.setItem("token", token);
    setUser(user);

    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await API.post("/auth/register", {
      name,
      email,
      password,
    });

    const { token, user } = response.data.data;

    localStorage.setItem("token", token);
    setUser(user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await API.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);