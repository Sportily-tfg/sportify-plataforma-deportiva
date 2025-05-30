import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/Logo-Primary-on-Transparent.png";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Función para actualizar el estado del usuario
  const updateUserState = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    // Verificar autenticación al cargar
    updateUserState();

    // Escuchar eventos de autenticación
    const handleAuthChange = (e) => {
      const userData =
        e?.detail?.user || JSON.parse(localStorage.getItem("user")) || null;
      setUser(userData);
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", () => {
      setTimeout(updateUserState, 100);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(
      new CustomEvent("authChange", { detail: { user: null } })
    );
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  return (
    <Nav $scroll={scroll}>
      <LeftSection>
        <Logo src={logo} alt="Logo Sportify" onClick={() => navigate("/")} />

        {/* Menú de escritorio */}
        <DesktopNavList>
          <NavItem>
            <NavLink to="/">Inicio</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/actividades">Actividades</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/calendar">Calendario</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/blog">Blog</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/tienda">Tienda</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contacto">Contacto</NavLink>
          </NavItem>
        </DesktopNavList>
      </LeftSection>

      {/* Botón hamburguesa (solo móvil) */}
      <HamburgerButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? (
          <FaTimes className="icon" />
        ) : (
          <FaBars className="icon" />
        )}
      </HamburgerButton>

      {/* Menú móvil */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileNavList>
          <NavItem>
            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
              Inicio
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/actividades"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Actividades
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/calendar" onClick={() => setIsMobileMenuOpen(false)}>
              Calendario
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contacto" onClick={() => setIsMobileMenuOpen(false)}>
              Contacto
            </NavLink>
          </NavItem>

          {user ? (
            <>
              <NavItem>
                <NavLink
                  to="/usuario"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mi perfil
                </NavLink>
              </NavItem>
              {user.rol === "admin" && (
                <NavItem>
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Panel Admin
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <MobileLogoutButton onClick={handleLogout}>
                  Cerrar sesión
                </MobileLogoutButton>
              </NavItem>
            </>
          ) : (
            <NavItem>
              <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                Iniciar sesión
              </NavLink>
            </NavItem>
          )}
        </MobileNavList>
      </MobileMenu>

      {/* Sección derecha (solo escritorio) */}
      <RightSection>
        {user ? (
          <UserMenu>
            <UserGreeting>Hola, {user.nombre}</UserGreeting>
            <DropdownMenu>
              <DropdownItem onClick={() => navigate("/usuario")}>
                Mi perfil
              </DropdownItem>
              {user.rol === "admin" && (
                <DropdownItem onClick={() => navigate("/admin")}>
                  Panel Admin
                </DropdownItem>
              )}
              <DropdownItem onClick={handleLogout}>Cerrar sesión</DropdownItem>
            </DropdownMenu>
          </UserMenu>
        ) : (
          <NavItem>
            <NavLink to="/login">Iniciar sesión</NavLink>
          </NavItem>
        )}
      </RightSection>
    </Nav>
  );
};

// Estilos
const Nav = styled.nav`
  background-color: #212121;
  padding: 1rem 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  opacity: ${({ $scroll }) => ($scroll ? "0.7" : "1")};
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  box-sizing: border-box;
`;


const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 60px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.img`
  height: 70px;
  margin-right: 20px;
  cursor: pointer;
`;

const DesktopNavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #fafafa;
  text-decoration: none;
  font-size: 1.1rem;
  font-family: "Arial", sans-serif;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #ff8000;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 50px;
`;

const UserGreeting = styled.span`
  color: #fafafa;
  margin-right: 10px;
  font-size: 1.1rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0px;
  background-color: #333;
  border-radius: 4px;
  padding: 10px 0;
  min-width: 180px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: none;
  z-index: 1001;

  ${UserMenu}:hover & {
    display: block;
  }
`;

const DropdownItem = styled.div`
  color: #fafafa;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff8000;
    color: #212121;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 1001;
  color: #fafafa;

  @media (max-width: 768px) {
    display: block;
  }

  .icon {
    font-size: 1.5rem;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  background-color: #212121;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease;
  z-index: 999;
  height: calc(100vh - 80px);
  overflow-y: auto;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileLogoutButton = styled.button`
  background: none;
  border: none;
  color: #fafafa;
  font-size: 1.1rem;
  font-family: "Arial", sans-serif;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: #ff8000;
  }
`;

export default Navbar;
