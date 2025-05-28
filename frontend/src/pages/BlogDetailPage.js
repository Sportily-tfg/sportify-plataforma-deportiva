import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

// Datos de ejemplo (en un caso real vendrían de una API)
const blogPosts = [
  {
    id: '1',
    title: "5 Consejos para Mejorar tu Pádel",
    content: `
      <p>El pádel es un deporte que combina técnica, estrategia y diversión. Aquí tienes consejos clave:</p>
      <ol>
        <li><strong>Posición de espera</strong>: Mantén las rodillas flexionadas y el peso sobre las puntas de los pies</li>
        <li><strong>Uso de las paredes</strong>: Aprovecha los rebotes para sorprender a tus rivales</li>
        <li><strong>Comunicación con tu pareja</strong>: Coordinación es clave en los partidos de dobles</li>
      </ol>
      <p>¡Practica estos consejos y verás mejora en tus partidos!</p>
    `,
    image: require('../assets/blog/PadelBlog.jpg'),
    category: "Pádel",
    date: "15 Mar 2023",
    author: "Carlos Rivera"
  },
  // ... otros artículos
];

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(post => post.id === id);

  if (!post) {
    return <div>Artículo no encontrado</div>;
  }

  return (
    <BlogDetailContainer>
      <BackButton onClick={() => navigate(-1)}>← Volver al blog</BackButton>
      
      <ArticleHeader>
        <CategoryTag>{post.category}</CategoryTag>
        <ArticleTitle>{post.title}</ArticleTitle>
        <ArticleMeta>
          Por {post.author} | {post.date}
        </ArticleMeta>
      </ArticleHeader>

      <ArticleImage src={post.image} alt={post.title} />

      <ArticleContent dangerouslySetInnerHTML={{ __html: post.content }} />

      <ShareSection>
        <h4>Comparte este artículo:</h4>
        <ShareButtons>
          <SocialButton>Twitter</SocialButton>
          <SocialButton>Facebook</SocialButton>
          <SocialButton>LinkedIn</SocialButton>
        </ShareButtons>
      </ShareSection>

      <RelatedArticles>
        <h3>Artículos relacionados</h3>
        {/* Componente de artículos relacionados */}
      </RelatedArticles>
    </BlogDetailContainer>
  );
};

// Estilos
const BlogDetailContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: #fafafa;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #47c7fc;
  cursor: pointer;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const ArticleHeader = styled.header`
  margin-bottom: 2rem;
`;

const CategoryTag = styled.span`
  background: #47c7fc;
  color: #121212;
  padding: 0.3rem 1rem;
  border-radius: 50px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ArticleTitle = styled.h1`
  color: #ff8000;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ArticleMeta = styled.p`
  color: #aaaaaa;
  font-size: 0.9rem;
`;

const ArticleImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin: 2rem 0;
`;

const ArticleContent = styled.div`
  line-height: 1.8;
  
  ol, ul {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.8rem;
  }
  
  strong {
    color: #ff8000;
  }
`;

const ShareSection = styled.div`
  margin: 3rem 0;
  padding: 2rem 0;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialButton = styled.button`
  background: #1e1e1e;
  border: 1px solid #333;
  color: #fafafa;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #ff8000;
    border-color: #ff8000;
  }
`;

const RelatedArticles = styled.section`
  margin: 3rem 0;
`;

export default BlogDetailPage;