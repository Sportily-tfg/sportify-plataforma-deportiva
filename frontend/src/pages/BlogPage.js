import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Datos de ejemplo
const blogPosts = [
  {
    id: "1",
    title: "5 Consejos para Mejorar tu Pádel",
    excerpt: "Descubre técnicas clave para dominar la pista.",
    image: require("../assets/blog/PadelBlog.jpg"),
    category: "Pádel",
    date: "15 Mar 2023",
  },
  {
    id: "2",
    title: "Beneficios del Yoga para Deportistas",
    excerpt: "Cómo el yoga puede complementar tu entrenamiento.",
    image: require("../assets/blog/YogaBlog.jpg"),
    category: "Yoga",
    date: "22 Feb 2023",
  },
  {
    id: "3",
    title: "Equipo Esencial para tus Entrenamientos",
    excerpt: "Lo que necesitas para sacar el máximo provecho.",
    image: require("../assets/blog/EquipoBlog.jpg"),
    category: "Consejos",
    date: "10 Ene 2023",
  },
  {
    id: "4",
    title: "Alimentación Antes y Después del Entrenamiento",
    excerpt:
      "Potencia tu rendimiento con una nutrición adecuada en cada fase del entrenamiento.",
    image: require("../assets/blog/NutricionBlog.jpg"),
    category: "Nutrición",
    date: "05 Mar 2023",
  },
  {
  id: "5",
  title: "Rutinas de Cardio para Principiantes",
  excerpt: "Empieza a quemar grasa y mejorar tu resistencia con ejercicios accesibles.",
  image: require("../assets/blog/CardioBlog.jpg"),
  category: "Entrenamiento",
  date: "18 Feb 2023",
},
{
  id: "6",
  title: "Cómo Mantener la Motivación para Entrenar",
  excerpt: "Descubre cómo mantenerte enfocado y constante en tus entrenamientos.",
  image: require("../assets/blog/MotivacionBlog.jpg"),
  category: "Consejos",
  date: "28 Ene 2023",
},
{
  id: "7",
  title: "Importancia del Descanso en el Progreso Deportivo",
  excerpt: "El descanso es clave para evitar lesiones y mejorar tu rendimiento.",
  image: require("../assets/blog/DescansoBlog.jpg"),
  category: "Salud",
  date: "12 Feb 2023",
},
{
  id: "8",
  title: "Errores Comunes al Levantar Pesas",
  excerpt: "Evita lesiones y mejora tu técnica con estos consejos prácticos.",
  image: require("../assets/blog/PesasBlog.jpg"),
  category: "Entrenamiento",
  date: "03 Feb 2023",
},
{
  id: "9",
  title: "Beneficios de Entrenar al Aire Libre",
  excerpt: "Conecta con la naturaleza y entrena en un entorno revitalizante.",
  image: require("../assets/blog/AireLibreBlog.jpg"),
  category: "Bienestar",
  date: "20 Feb 2023",
},

];

const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <BlogContainer>
      <BlogHeader>
        <BlogTitle>Blog Sportify</BlogTitle>
        <BlogSubtitle>
          Consejos, noticias y guías para amantes del deporte
        </BlogSubtitle>
      </BlogHeader>

      <CategoryFilters>
        <CategoryButton active>Todos</CategoryButton>
        <CategoryButton>Pádel</CategoryButton>
        <CategoryButton>Yoga</CategoryButton>
        <CategoryButton>Consejos</CategoryButton>
        <CategoryButton>Entrenamiento</CategoryButton>
        <CategoryButton>Nutrición</CategoryButton>
        <CategoryButton>Salud</CategoryButton>
        <CategoryButton>Bienestar</CategoryButton>
      </CategoryFilters>

      <BlogGrid>
        {blogPosts.map((post) => (
          <BlogCard key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
            <BlogImage src={post.image} alt={post.title} />
            <BlogContent>
              <BlogCategory>{post.category}</BlogCategory>
              <BlogTitle>{post.title}</BlogTitle>
              <BlogExcerpt>{post.excerpt}</BlogExcerpt>
              <BlogDate>{post.date}</BlogDate>
            </BlogContent>
          </BlogCard>
        ))}
      </BlogGrid>

      <Pagination>
        <PageButton>1</PageButton>
        <PageButton>2</PageButton>
        <PageButton>3</PageButton>
      </Pagination>
    </BlogContainer>
  );
};

// Estilos
const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const BlogHeader = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const BlogTitle = styled.h1`
  color: #ff8000;
  font-size: 2.5rem;
`;

const BlogSubtitle = styled.p`
  color: #aaaaaa;
  font-size: 1.2rem;
`;

const CategoryFilters = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button`
  background: ${(props) => (props.active ? "#47c7fc" : "#1e1e1e")};
  color: ${(props) => (props.active ? "#121212" : "#fafafa")};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #47c7fc;
    color: #121212;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const BlogCard = styled.div`
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
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
  background: #47c7fc;
  color: #121212;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 0.8rem;
`;

const BlogExcerpt = styled.p`
  color: #cccccc;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const BlogDate = styled.span`
  color: #ff8000;
  font-size: 0.8rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 3rem 0;
`;

const PageButton = styled.button`
  background: #1e1e1e;
  border: none;
  color: #fafafa;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #ff8000;
  }
`;

export default BlogPage;
