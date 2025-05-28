import React from "react";
import styled from "styled-components";
import SecundaryButton from "../components/buttons/SecondaryButton";
import { useNavigate } from "react-router-dom";
import CarlosPhoto from "../assets/CarlosRivera.jpg";
import AnaPhoto from "../assets/AnaMarmolejo.jpg";
import Gym1 from "../assets/gym1.png";
import Gym2 from "../assets/gym2.png";
import Gym3 from "../assets/gym3.png";
import adidas from "../assets/adidas.png";
import Nike from "../assets/Nike.png";
import head from "../assets/head.png";
import PadelBlog from "../assets/PadelBlog.jpg";
import YogaBlog from "../assets/YogaBlog.jpg";
import EquipoBlog from "../assets/EquipoBlog.jpg";

const AboutPage = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      title: "5 Consejos para Mejorar tu Pádel",
      excerpt: "Descubre técnicas clave para dominar la pista.",
      image: PadelBlog,
      category: "Pádel",
      date: "15 Mar 2023"
    },
    {
      title: "Beneficios del Yoga para Deportistas",
      excerpt: "Cómo el yoga puede complementar tu entrenamiento.",
      image: YogaBlog,
      category: "Yoga",
      date: "22 Feb 2023"
    },
    {
      title: "Equipo Esencial para tus Entrenamientos",
      excerpt: "Lo que necesitas para sacar el máximo provecho.",
      image: EquipoBlog,
      category: "Consejos",
      date: "10 Ene 2023"
    }
  ];

  return (
    <AboutContainer>
      <ContentSection>
        <Title>¿Qué es Sportify?</Title>
        <Description>
          Sportify es una plataforma innovadora que conecta a amantes del
          deporte con actividades locales. Ofrecemos un sistema de reservas
          integrado para que puedas encontrar y participar en tus actividades
          favoritas de manera sencilla.
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
          <SecundaryButton
            texto="Explorar Actividades"
            onClick={() => navigate("/actividades")}
            lightText={true}
          />
        </ButtonContainer>

        <TeamSection>
          <SectionTitle>Nuestro Equipo</SectionTitle>
          <TeamGrid>
            <TeamMember>
              <MemberPhoto src={CarlosPhoto} alt="miembro del equipo" />
              <MemberName>Carlos Rivera</MemberName>
              <MemberRole>CEO y Fundador</MemberRole>
            </TeamMember>
            <TeamMember>
              <MemberPhoto src={AnaPhoto} alt="miembro del equipo" />
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

        <BlogSection>
          <SectionTitle>Nuestro Blog</SectionTitle>
          <BlogGrid>
            {blogPosts.map((post, index) => (
              <BlogCard key={index} onClick={() => navigate('/blog-detalle')}>
                <BlogImage src={post.image} alt={post.title} />
                <BlogContent>
                  <BlogCategory>{post.category}</BlogCategory>
                  <BlogTitle>{post.title}</BlogTitle>
                  <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                  <BlogMeta>
                    <BlogDate>{post.date}</BlogDate>
                    <BlogReadMore>Leer más</BlogReadMore>
                  </BlogMeta>
                </BlogContent>
              </BlogCard>
            ))}
          </BlogGrid>
          <ViewAllContainer>
            <SecundaryButton 
              texto="Ver todos los artículos" 
              onClick={() => navigate('/blog')} 
              lightText={true}
            />
          </ViewAllContainer>
        </BlogSection>

        <PartnersSection>
          <SectionTitle>Colaboradores</SectionTitle>
          <PartnersGrid>
            <PartnerLogo src={Gym1} alt="Gimnasio 1" />
            <PartnerLogo src={Gym2} alt="Gimnasio 2" />
            <PartnerLogo src={Gym3} alt="Gimnasio 3" />
            <PartnerLogo src={head} alt="Logo Head" />
            <PartnerLogo src={adidas} alt="Logo Adidas" />
            <PartnerLogo src={Nike} alt="Logo Nike" />
          </PartnersGrid>
        </PartnersSection>

        <TestimonialsSection>
          <SectionTitle>Lo que dicen nuestros usuarios</SectionTitle>
          <TestimonialsGrid>
            <TestimonialCard>
              <TestimonialText>
                "Sportify ha cambiado cómo hago deporte!"
              </TestimonialText>
              <TestimonialAuthor>- Lucía J., Cádiz</TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                "Sportify me ha ayudado a encontrar compañeros para jugar al
                pádel regularmente."
              </TestimonialText>
              <TestimonialAuthor>- Juan P., Madrid</TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                "Gracias a Sportify descubrí clases de boxeo cerca de casa.
                ¡Ahora entreno cada semana!"
              </TestimonialText>
              <TestimonialAuthor>- Laura M., Barcelona</TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                "Una app muy intuitiva y con muchas opciones para reservar
                actividades. ¡La recomiendo!"
              </TestimonialText>
              <TestimonialAuthor>- Diego R., Valencia</TestimonialAuthor>
            </TestimonialCard>
          </TestimonialsGrid>
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

        <CTASection>
          <CTATitle>¡Únete a la comunidad Sportify!</CTATitle>
          <SecundaryButton
            texto="Regístrate Gratis"
            lightText={true}
            onClick={() => navigate("/register")}
          />
        </CTASection>
      </ContentSection>
    </AboutContainer>
  );
};

// Estilos
const AboutContainer = styled.div`
  padding: 7rem 2rem;
  background-color: #121212;
  color: #fafafa;
  min-height: 100vh;
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #ff8000;
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
  border-left: 4px solid #47c7fc;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  color: #ff8000;
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
  color: #ff8000;
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
  border: 3px solid #47c7fc;
`;

const MemberName = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: #aaaaaa;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 4rem 0;
  padding: 2rem;
  background: #1e1e1e;
  border-radius: 10px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  color: #ff8000;
  font-weight: bold;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #cccccc;
`;

const BlogSection = styled.section`
  margin: 5rem 0;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled.div`
  background: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
  border-left: 4px solid #47c7fc;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogCategory = styled.span`
  display: inline-block;
  background: #47c7fc;
  color: #121212;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
`;

const BlogTitle = styled.h3`
  color: #fafafa;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
`;

const BlogExcerpt = styled.p`
  color: #cccccc;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const BlogDate = styled.span`
  color: #ff8000;
  font-size: 0.8rem;
`;

const BlogReadMore = styled.span`
  color: #47c7fc;
  font-size: 0.9rem;
  font-weight: bold;
  transition: color 0.3s;

  ${BlogCard}:hover & {
    color: #ff8000;
  }
`;

const ViewAllContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

const PartnersSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PartnersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const PartnerLogo = styled.img`
  height: 10rem;
  filter: grayscale(100%);
  transition: filter 0.3s;

  &:hover {
    filter: grayscale(0%);
  }
`;

const TestimonialsSection = styled.section`
  margin: 5rem 0;
  padding: 0 1rem; /* Padding para móvil */
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* 1 columna por defecto (móvil) */
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en desktop */
  }
`;

const TestimonialCard = styled.div`
  background: #1e1e1e;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  border-left: 4px solid #47c7fc;
`;

const TestimonialText = styled.p`
  font-style: italic;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const TestimonialAuthor = styled.p`
  color: #ff8000;
  font-weight: bold;
  margin-top: 1rem;
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
  background: #1e1e1e;
  padding: 1.5rem;
  border-radius: 10px;
`;

const StepIcon = styled.div`
  width: 50px;
  height: 50px;
  background: #47c7fc;
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

/* CTA */
const CTASection = styled.section`
  margin: 5rem 0;
  text-align: center;
  padding: 3rem;
  background: #1e1e1e;
  border-radius: 10px;
`;

const CTATitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #ff8000;
`;

export default AboutPage;
