import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Navbar from '../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <AboutContainer>
        <Navbar />
      <ContentSection>
        <Title>¿Qué es Sportify?</Title>
        <Description>
          Sportify es una plataforma innovadora que conecta a amantes del deporte con actividades 
          locales. Ofrecemos un sistema de reservas integrado para que puedas encontrar y participar 
          en tus actividades favoritas de manera sencilla.
        </Description>
        
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Diversidad de Actividades</FeatureTitle>
            <FeatureText>
              Desde pádel hasta yoga, encuentra el deporte que más te guste
            </FeatureText>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Reservas Fáciles</FeatureTitle>
            <FeatureText>
              Reserva tu plaza en pocos clics, cuando y donde quieras
            </FeatureText>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>Recompensas</FeatureTitle>
            <FeatureText>
              Gana puntos por participar y canjéalos por beneficios
            </FeatureText>
          </FeatureCard>
        </FeaturesGrid>

        <ButtonContainer>
          <PrimaryButton 
            texto="Explorar Actividades" 
            onClick={() => navigate('/actividades')} 
            lightText={ true }
          />
        </ButtonContainer>
      </ContentSection>
    </AboutContainer>
  );
};

// Estilos
const AboutContainer = styled.div`
  padding: 7rem 2rem;
  background-color: #121212;
  color: #FAFAFA;
  min-height: 100vh;
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #FF8000;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: #1e1e1e;
  padding: 2rem;
  border-radius: 10px;
  border-left: 4px solid #FF8000;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  color: #FF8000;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const FeatureText = styled.p`
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export default AboutPage;