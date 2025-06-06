import React from 'react';
import styled from 'styled-components';

const Button = ({ texto, onClick, lightText = false }) => {
  return (
    <StyledWrapper lightText={lightText}>
      <button className="button" onClick={onClick}>
        <span className="actual-text">&nbsp;{texto}&nbsp;</span>
        <span aria-hidden="true" className="hover-text">&nbsp;{texto}&nbsp;</span>
      </button>
    </StyledWrapper>
  );
}

// Estilos del botón (sin cambios)
const StyledWrapper = styled.div`
  .button {
    margin: 0;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
  }

  /* Estilos base del botón */
  .button {
    --border-right: 3px;
    --text-stroke-color:${props => props.lightText ? '#ffffff' : '#000000'};
    --animation-color: #47C7FC;
    --fs-size: 1.2em;
    letter-spacing: 2px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: "Arial";
    position: relative;
    text-transform: uppercase;
    color: ${props => props.lightText ? 'white' : 'black'};
    -webkit-text-stroke: 1px var(--text-stroke-color);
  }

  /* Estilos del texto que se muestra al hacer hover */
  .hover-text {
    position: absolute;
    box-sizing: border-box;
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
    white-space: nowrap; /* Añade esta línea */
    display: inline-block; /* Añade esta línea */
  }

  /* Efecto al hacer hover */
  .button:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }
`;

export default Button;

