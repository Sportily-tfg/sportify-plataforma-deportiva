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
import UsersManagement from './pages/Admin/UsersManagement';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/navbar/Navbar';

export const AuthContext = createContext();

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      setAuth({ user: JSON.parse(user), token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/actividades" element={<ActividadesPanel />} />
            
            <Route path="/usuario" element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserPanel />
              </ProtectedRoute>
            } />

            <Route path="/calendar" element={<CalendarPage />} />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UsersManagement />
              </ProtectedRoute>
            } />

            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;