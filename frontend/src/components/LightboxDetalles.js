import React from 'react';
import styled from 'styled-components';

const LightDetalles = ({ actividad, onClose }) => {
    return (
        <LightboxOverlay>
            <LightboxContainer>
                <CloseButton onClick={onClose}>x</CloseButton>
                <h2 style={{ color: 'white' }}>{actividad.nombre_actividad}</h2>

                <DetallesGrid>
                    <DetalleItem>
                        <h4>Descripción completa: </h4>
                        <p>{actividad.descripcion_larga || actividad.descripcion}</p>
                    </DetalleItem>

                    <DetalleItem>
                        <h4>Horario:</h4>
                        <p>Lunes y Miércoles - 18:00 a 20:00</p>
                    </DetalleItem>

                    <DetalleItem>
                        <h4>Requisitos:</h4>
                        <p>Ropa deportiva y botella de agua</p>
                    </DetalleItem>
                </DetallesGrid>

                <SecondaryButton onClick={onClose}>Cerrar</SecondaryButton>
            </LightboxContainer>
        </LightboxOverlay>
    );
};

export default LightDetalles;

//estilos

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const LightboxContainer = styled.div`
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
  position: relative;
  border: 1px solid #FF8000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
   background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #FF8000;
  }
`;

const DetallesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const DetalleItem = styled.div`
  h4 {
    color: #FF8000;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  p {
    color: #e0e0e0;
    line-height: 1.6;
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: #FF8000;
  border: 1px solid #FF8000;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(255, 128, 0, 0.1);
  }
`;