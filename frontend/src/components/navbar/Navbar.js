import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación
import styled from 'styled-components'; // Importamos styled-components


const Navbar = () => {
    const [scroll, setScroll] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    return (
      <Nav scroll={scroll}>
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

// Estilos para el Navbar
const Nav = styled.nav`
  background-color: #212121; /* Fondo oscuro */
  padding: 1rem 5%; /* Usamos porcentaje para el padding horizontal */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed; /* Fija el Navbar en la parte superior */
  top: 0; /* Lo coloca en la parte superior */
  left: 0; /* Lo coloca a la izquierda */
  width: 100%; /* Ocupa todo el ancho de la pantalla */
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
  opacity: ${({ scroll }) => (scroll ? '0.7' : '1')}; /* Cambia la opacidad al hacer scroll */
  transition: opacity 0.3s ease; /* Añade una transición suave */
  overflow: visible; /* Asegura que el contenido no se corte */
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: flex-end; /* Alinea los elementos a la derecha */
  margin: 0;
  padding: 0;
  max-width: 85vw; /* Usamos un porcentaje del ancho de la ventana */
  width: 90%; /* Usamos un porcentaje para el ancho */
  margin: 0 auto; /* Centra el contenido */
`;

const NavItem = styled.li`
  margin-left: 1.5rem; /* Usamos rem para el margen */
`;

const NavLink = styled(Link)`
  color: #FAFAFA; /* Texto claro */
  text-decoration: none;
  font-size: 1.1rem; /* Usamos rem para el tamaño de la fuente */
  font-family: 'Arial', sans-serif; /* Define la fuente */
  transition: color 0.3s ease;

  &:hover {
    color: #47C7FC; /* Color de enlace al hacer hover */
  }
`;