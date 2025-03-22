import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/Logo-Primary-on-Transparent.png';

const Navbar = () => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Nav scroll={scroll}>
      <Logo src={logo} alt="Logo de la aplicación" />
      <NavList>
        <NavItem>
          <NavLink to="/">Inicio</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contacto">Contacto</NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
};

export default Navbar;

// Estilos principales del Navbar
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
  align-items: center;
`;

// Estilos del logo
const Logo = styled.img`
  height: 70px;
  margin-right: 20px;
`;

// Estilos de la lista de enlaces
const NavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
`;

// Estilos de cada elemento de la lista
const NavItem = styled.li``;

// Estilos de los enlaces
const NavLink = styled(Link)`
  color: #FAFAFA;
  text-decoration: none;
  font-size: 1.1rem;
  font-family: 'Arial', sans-serif;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #47C7FC;
  }
`;