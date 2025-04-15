// frontend/src/tests/pages/Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Login';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mockea axios para evitar llamadas HTTP reales
jest.mock('axios');
// Mockea react-router-dom y retorna una función mock de Jest para poder hacer assertions sobre las navegaciones
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock para los componentes hijos
// Mockea el componente navbar con una implementación simplificada
jest.mock('../../components/navbar/Navbar', () => () => <nav>Mock Navbar</nav>);
//Mockea los componentes boton y los reemplaza
jest.mock('../../components/buttons/PrimaryButton', () => ({ texto, onClick }) => 
  <button onClick={onClick}>{texto}</button>);
jest.mock('../../components/buttons/SecondaryButton', () => ({ texto, onClick }) => 
  <button onClick={onClick}>{texto}</button>);

//Bloque principal de tests para la página
describe('Login Page', () => {
    // se ejecuta antes de cada tests, limpiando el storage y los mocks
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // Renderiza el componente Login en el entorno de test, verifivca que cada uno de los componentes estén presentes
  test('1. Renderiza correctamente todos los elementos', () => {
    render(<Login />);
    
    expect(screen.getByText('Mock Navbar')).toBeInTheDocument();
    expect(screen.getByText('Sportify')).toBeInTheDocument();
    expect(screen.getByText('Inicia sesión')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });
});