import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/signup.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("https://nested-comment-app.onrender.com/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error("Session restore failed:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const handleAuth = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return <div>Loading session...</div>;
  }

  
  return (
    <div className="app-container">
      {!user ? (
        showSignup ? (
          <Signup
            onSignup={handleAuth}
            switchToLogin={() => setShowSignup(false)}
          />
        ) : (
          <Login
            onLogin={handleAuth}
            switchToSignup={() => setShowSignup(true)}
          />
        )
      ) : (
        <Home user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;





