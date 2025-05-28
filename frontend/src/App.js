import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Añade useAuth aquí
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ActividadesPanel from "./pages/ActividadesPanel";
import CalendarPage from "./pages/CalendarPage";
import AboutPage from "./pages/AboutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/navbar/Navbar";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/Admin/AdminPanel";
import Footer from "./components/Footer";
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';

function App() {
  const { loading } = useAuth(); // Ahora useAuth está definido

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            {/* Páginas accesibles solo si no hay sesión iniciada */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            {/* Páginas accesibles solo si hay sesión iniciada */}
            <Route
              path="/actividades"
              element={
                <ProtectedRoute>
                  <ActividadesPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuario"
              element={
                <ProtectedRoute>
                  <UserPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]} redirectPath="/">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
