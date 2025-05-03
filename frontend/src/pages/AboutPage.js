import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import CarlosPhoto from '../assets/CarlosRivera.jpg';
import AnaPhoto from '../assets/AnaMarmolejo.jpg';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <AboutContainer>
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

        <TeamSection>
          <SectionTitle>Nuestro Equipo</SectionTitle>
          <TeamGrid>
            <TeamMember>
              <MemberPhoto src={CarlosPhoto} alt="miembro del equipo"/>
              <MemberName>Carlos Rivera</MemberName>
              <MemberRole>CEO y Fundador</MemberRole>
            </TeamMember>
            <TeamMember>
              <MemberPhoto src={AnaPhoto} alt="miembro del equipo"/>
              <MemberName>Ana Marmolejo</MemberName>
              <MemberRole>CEO y Fundadora</MemberRole>
            </TeamMember>
          </TeamGrid>
        </TeamSection>

        <StatsSection>
          <StatItem>
            <StatNumber>10,000+</StatNumber>
            <StatLabel>Usuarios</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>500+</StatNumber>
            <StatLabel>Actividades Semanales</StatLabel>
          </StatItem>
        </StatsSection>

        <TestimonialsSection>
          <SectionTitle>Lo que dicen nuestros usuarios</SectionTitle>
          <TestimonialCard>
            <TestimonialText>"Sportify ha cambiado cómo hago deporte!"</TestimonialText>
            <TestimonialAuthor>- María G.</TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsSection>

        <HowItWorks>
          <SectionTitle>¿Cómo funciona?</SectionTitle>
          <StepsContainer>
            <Step>
              <StepIcon>1</StepIcon>
              <StepText>Explora nuestra web</StepText>
            </Step>

            <Step>
              <StepIcon>2</StepIcon>
              <StepText>Date de alta</StepText>
            </Step>

            <Step>
              <StepIcon>3</StepIcon>
              <StepText>Busca actividades cerca de ti</StepText>
            </Step>

            <Step>
              <StepIcon>4</StepIcon>
              <StepText>Reserva y empieza tu nueva etapa!</StepText>
            </Step>
          </StepsContainer>
        </HowItWorks>

        <FAQSection>
          <SectionTitle>Preguntas Frecuentes</SectionTitle>
          <FAQItem>
            <FAQQuestion>¿Cómo cancelo una reserva?</FAQQuestion>
            <FAQAnswer>Puedes cancelar desde tu perfil.</FAQAnswer>
          </FAQItem>
        </FAQSection>

        <CTASection>
          <CTATitle>¡Únete a la comunidad Sportify!</CTATitle>
          <PrimaryButton texto="Regístrate Gratis" lightText={true} onClick={() => navigate('/register')} />
        </CTASection>
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

const SectionTitle = styled.h2`
  color: #FF8000;
  font-size: 2rem;
  text-align: center;
  margin: 4rem 0 2rem;
`;

const TeamSection = styled.section`
  margin: 5rem 0;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMember = styled.div`
  text-align: center;
`;

const MemberPhoto = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
  border: 3px solid #FF8000;
`;

const MemberName = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: #AAAAAA;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 4rem 0;
  padding: 2rem;
  background: #1E1E1E;
  border-radius: 10px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  color: #FF8000;
  font-weight: bold;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #CCCCCC;
`;

const TestimonialsSection = styled.section`
  margin: 5rem 0;
`;

const TestimonialCard = styled.div`
  background: #1E1E1E;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  border-left: 4px solid #FF8000;
`;

const TestimonialText = styled.p`
  font-style: italic;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const TestimonialAuthor = styled.p`
  color: #FF8000;
  font-weight: bold;
`;

/* Cómo funciona */
const HowItWorks = styled.section`
  margin: 5rem 0;
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Step = styled.div`
  text-align: center;
  background: #1E1E1E;
  padding: 1.5rem;
  border-radius: 10px;
`;

const StepIcon = styled.div`
  width: 50px;
  height: 50px;
  background: #FF8000;
  color: #121212;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
`;

const StepText = styled.p`
  font-size: 1.1rem;
`;

/* FAQ */
const FAQSection = styled.section`
  margin: 5rem 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const FAQItem = styled.div`
  margin-bottom: 1rem;
  background: #1E1E1E;
  padding: 1.5rem;
  border-radius: 8px;
`;

const FAQQuestion = styled.h4`
  color: #FF8000;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const FAQAnswer = styled.p`
  color: #CCCCCC;
`;

/* CTA */
const CTASection = styled.section`
  margin: 5rem 0;
  text-align: center;
  padding: 3rem;
  background: #1E1E1E;
  border-radius: 10px;
`;

const CTATitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #FF8000;
`;

export default AboutPage;