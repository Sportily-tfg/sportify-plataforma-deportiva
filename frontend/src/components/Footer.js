import React from "react";
import "../styles/Footer.css";
import RRSS from "./RRSS";
import logo from '../assets/Logo-Primary-on-Transparent.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo a la izquierda */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logo} alt="Sportify Logo" className="footer-logo-img" />
          </div>
        </div>

        {/* Enlaces y legal al centro */}
        <div className="footer-center">
          <div className="footer-links">
            <a href="/about" className="footer-link">
              Sobre Nosotros
            </a>
            <a href="/contacto" className="footer-link">
              Contacto
            </a>
            <a href="/privacy" className="footer-link">
              Privacidad
            </a>
            <a href="/terms" className="footer-link">
              Términos
            </a>
          </div>
          <div className="footer-legal">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Sportify. Todos los derechos
              reservados.
            </p>
          </div>
        </div>

        {/* Redes sociales a la derecha */}
        <div className="footer-right">
          <div className="footer-social">
            <RRSS />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
