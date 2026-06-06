import { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import TacticalDashboard from './components/TacticalDashboard.jsx';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  function restoreUserFromToken(token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(normalized);
      const parsed = JSON.parse(decoded);
      return {
        email: parsed.email,
        role: parsed.role,
        isAdmin: parsed.role === 'admin'
      };
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCheckingSession(false);
      return;
    }

    const storedUserJson = localStorage.getItem('user');
    let storedUser = null;

    if (storedUserJson) {
      try {
        storedUser = JSON.parse(storedUserJson);
      } catch {
        localStorage.removeItem('user');
      }
    }

    if (storedUser) {
      setCurrentUser(storedUser);
    } else {
      const restored = restoreUserFromToken(token);
      if (restored) {
        setCurrentUser(restored);
      }
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiBaseUrl}/api/assets`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Token inválido');
        }

        setAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthenticated(false);
        setCurrentUser(null);
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);


  const handleLogin = (user) => {
    setCurrentUser(user);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthenticated(false);
    setCurrentUser(null);
  };

  if (checkingSession) {
    return <div className="min-h-screen bg-[#050505] text-white" />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {authenticated ? (
        <TacticalDashboard currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;

