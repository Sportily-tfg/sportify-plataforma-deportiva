import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importamos React Router
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Register from './pages/Register'; 
import ActividadesPanel from './pages/ActividadesPanel';

function App() {
  return (
    <Router>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;