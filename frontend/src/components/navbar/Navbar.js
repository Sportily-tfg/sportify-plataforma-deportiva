import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/Logo-Primary-on-Transparent.png';

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    // Verificar autenticación al cargar
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Nav scroll={scroll}>
      {/* Logo y enlaces principales (izquierda) */}
      <LeftSection>
        <Logo src={logo} alt="Logo Sportify" onClick={() => navigate('/')} />
        <NavList>
          <NavItem>
            <NavLink to="/">Inicio</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contacto">Contacto</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/actividades">Actividades</NavLink>
          </NavItem>
        </NavList>
      </LeftSection>

      {/* Sección de usuario (derecha) */}
      <RightSection>
        {user ? (
          <>
            <UserMenu>
              <UserGreeting>Hola, {user.nombre}</UserGreeting>
              <DropdownMenu>
                <DropdownItem onClick={() => navigate('/usuario')}>
                  Mi perfil
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </UserMenu>
          </>
        ) : (
          <NavItem>
            <NavLink to="/login">Iniciar sesión</NavLink>
          </NavItem>
        )}
      </RightSection>
    </Nav>
  );
};

// Estilos mejorados (agregamos nuevos componentes)
const Nav = styled.nav`
  background-color: #212121;
  padding: 1rem 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  opacity: ${({ scroll }) => (scroll ? '0.7' : '1')};
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px; /* Añade margen al contenedor derecho */
`;

const Logo = styled.img`
  height: 70px;
  margin-right: 20px;
  cursor: pointer;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #FAFAFA;
  text-decoration: none;
  font-size: 1.1rem;
  font-family: 'Arial', sans-serif;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #FF8000;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 50px;  /* ← Añade este margen */
`;

const UserGreeting = styled.span`
  color: #FAFAFA;
  margin-right: 10px;
  font-size: 1.1rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0px;  /* ← Ajustado para mover más a la izquierda */
  background-color: #333;
  border-radius: 4px;
  padding: 10px 0;
  min-width: 180px;  /* ← Aumentado para mejor visualización */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: none;
  z-index: 1001;
  
  ${UserMenu}:hover & {
    display: block;
  }
`;

const DropdownItem = styled.div`
  color: #FAFAFA;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #FF8000;
    color: #212121;
  }
`;

export default Navbar;