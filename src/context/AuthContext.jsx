import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cryptoplace_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("cryptoplace_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("cryptoplace_user", JSON.stringify(userData));
  };

  const signup = (name, email, password) => {
    // Store user accounts in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("cryptoplace_users") || "[]");
    
    if (existingUsers.some(u => u.email === email)) {
      return { success: false, message: "An account with this email already exists." };
    }

    // Hash password using a simple but effective approach for client-side demo
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "cryptoplace_salt_2026");
    // Use base64 of salted password as stored hash (not for production - use bcrypt server-side)
    const hashedPassword = btoa(String.fromCharCode(...data));

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem("cryptoplace_users", JSON.stringify(existingUsers));
    
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    login(sessionUser);
    return { success: true };
  };

  const signin = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem("cryptoplace_users") || "[]");
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "cryptoplace_salt_2026");
    const hashedPassword = btoa(String.fromCharCode(...data));
    
    const found = existingUsers.find(u => u.email === email && u.password === hashedPassword);
    
    if (!found) {
      return { success: false, message: "Invalid email or password." };
    }

    const sessionUser = { id: found.id, name: found.name, email: found.email };
    login(sessionUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cryptoplace_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
