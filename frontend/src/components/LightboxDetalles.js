import React from 'react';
import styled from 'styled-components';

const LightDetalles = ({ actividad, onClose }) => {
    return (
        <LightboxOverlay>
            <LightboxContainer>
                <CloseButton onClick={onClose}>×</CloseButton>
                <Titulo>{actividad.nombre_actividad}</Titulo>

                {/* Sección superior con horario y requisitos */}
                <InfoSuperior>
                    <InfoItem>
                        <InfoLabel>Horario:</InfoLabel>
                        <InfoText>Lunes y Miércoles - 18:00 a 20:00</InfoText>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>Requisitos:</InfoLabel>
                        <InfoText>Ropa deportiva y botella de agua</InfoText>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>Dificultad:</InfoLabel>
                        <InfoText>{actividad.nivel_dificultad}</InfoText>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>Participantes:</InfoLabel>
                        <InfoText>{actividad.max_participantes}</InfoText>
                    </InfoItem>
                </InfoSuperior>

                {/* Sección de descripción completa abajo */}
                <DescripcionContainer>
                    <InfoLabel>Descripción completa:</InfoLabel>
                    <DescripcionText>{actividad.descripcion_larga || actividad.descripcion}</DescripcionText>
                </DescripcionContainer>

                <BotonCerrar onClick={onClose}>Cerrar</BotonCerrar>
            </LightboxContainer>
        </LightboxOverlay>
    );
};

export default LightDetalles;

// Estilos mejorados
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  line-height: 1;

  &:hover {
    color: #FF8000;
  }
`;

const Titulo = styled.h2`
  color: white;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const InfoSuperior = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #333;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.h4`
  color: #FF8000;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const InfoText = styled.p`
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0;
`;

const DescripcionContainer = styled.div`
  margin-top: 1rem;
`;

const DescripcionText = styled.p`
  color: #e0e0e0;
  line-height: 1.6;
  margin-top: 0.5rem;
  white-space: pre-line;
`;

const BotonCerrar = styled.button`
  background-color: transparent;
  color: #FF8000;
  border: 1px solid #FF8000;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  align-self: flex-end;
  margin-top: 1rem;
  
  &:hover {
    background-color: rgba(255, 128, 0, 0.1);
  }
`;