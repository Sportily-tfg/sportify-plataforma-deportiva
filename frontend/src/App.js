import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Register from './pages/Register'; 
import ActividadesPanel from './pages/ActividadesPanel';
import UserPanel from './pages/UserPanel';
import CalendarPage from './pages/CalendarPage';
import AdminPanel from './pages/Admin/AdminPanel';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/navbar/Navbar';

export const AuthContext = createContext();

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setAuth(JSON.parse(storedUser));

    const handleAuthChange = (e) => {
      setAuth(e?.detail?.user || JSON.parse(localStorage.getItem('user')) || null);
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  return (
    <AuthContext.Provider value={{ auth }}>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            {/* Ruta para la página de inicio */}
            <Route path="/" element={<HomePage />} />
            
            {/* Ruta para la página de contacto */}
            <Route path="/contacto" element={<ContactPage />} />

            {/* Ruta para la página de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Ruta para la página de registro */}
            <Route path="/register" element={<Register />} />

            {/* Ruta para el panel de actividades */}
            <Route path="/actividades" element={<ActividadesPanel />} />

            {/* Ruta para el panel de usuario (protegida) */}
            <Route path="/usuario" element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserPanel />
              </ProtectedRoute>
            } />

            {/* Ruta para el calendario */}
            <Route path="/calendar" element={<CalendarPage />} />

            {/* Ruta para el panel de administrador (protegida) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            {/* Ruta para la página Sobre Nosotros */}
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;