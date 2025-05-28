import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo
const blogPosts = [
  {
    id: '1',
    title: "5 Consejos para Mejorar tu Pádel",
    excerpt: "Descubre técnicas clave para dominar la pista.",
    image: require('../assets/blog/PadelBlog.jpg'),
    category: "Pádel",
    date: "15 Mar 2023"
  },
  // ... otros artículos
];

const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <BlogContainer>
      <BlogHeader>
        <BlogTitle>Blog Sportify</BlogTitle>
        <BlogSubtitle>Consejos, noticias y guías para amantes del deporte</BlogSubtitle>
      </BlogHeader>

      <CategoryFilters>
        <CategoryButton active>Todos</CategoryButton>
        <CategoryButton>Pádel</CategoryButton>
        <CategoryButton>Yoga</CategoryButton>
        <CategoryButton>Consejos</CategoryButton>
      </CategoryFilters>

      <BlogGrid>
        {blogPosts.map(post => (
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
  background: ${props => props.active ? '#47c7fc' : '#1e1e1e'};
  color: ${props => props.active ? '#121212' : '#fafafa'};
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