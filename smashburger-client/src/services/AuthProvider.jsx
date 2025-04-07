import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { userLogout } from "./userLogout";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth-check", {
        method: "GET",
        credentials: "include", // Ensure cookies are included with the request
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await userLogout();
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthProvider };

/* import { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import { userLogout } from "./userLogout";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch("http://localhost:3000/auth-check", {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Not authenticated");

            const data = await res.json();
            setUser(data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await userLogout();
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider }; */
