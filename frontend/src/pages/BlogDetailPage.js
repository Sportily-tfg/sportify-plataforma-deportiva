import React from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

// Datos de ejemplo (en un caso real vendrían de una API)
const blogPosts = [
  {
    id: "1",
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
    image: require("../assets/blog/PadelBlog.jpg"),
    category: "Pádel",
    date: "15 Mar 2023",
    author: "Carlos Rivera",
  },
  {
    id: "2",
    title: "Beneficios del Yoga para Deportistas",
    content: `
    <p>El yoga no es solo una práctica de relajación, también ofrece múltiples beneficios para quienes practican otros deportes:</p>
    <ul>
      <li><strong>Flexibilidad mejorada</strong>: Ayuda a prevenir lesiones y mejora el rango de movimiento.</li>
      <li><strong>Mayor concentración</strong>: La conexión mente-cuerpo optimiza el rendimiento deportivo.</li>
      <li><strong>Recuperación activa</strong>: Reduce tensiones musculares y acelera la recuperación tras el entrenamiento.</li>
    </ul>
    <p>Incluir sesiones de yoga en tu rutina te permitirá entrenar con más equilibrio y consciencia.</p>
  `,
    image: require("../assets/blog/YogaBlog.jpg"),
    category: "Yoga",
    date: "22 Feb 2023",
    author: "Carlos Rivera",
  },
  {
    id: "3",
    title: "Equipo Esencial para tus Entrenamientos",
    content: `
    <p>Contar con el equipo adecuado puede marcar la diferencia en tu progreso y comodidad al entrenar:</p>
    <ol>
      <li><strong>Calzado deportivo</strong>: Elige un calzado adecuado a tu actividad para evitar lesiones.</li>
      <li><strong>Ropa técnica</strong>: Tejidos transpirables mejoran el confort durante el ejercicio.</li>
      <li><strong>Accesorios clave</strong>: Mancuernas, bandas elásticas o esterilla, dependiendo del tipo de entrenamiento.</li>
    </ol>
    <p>Invertir en buen equipo es invertir en tu rendimiento. ¡Equípate bien y entrena con seguridad!</p>
  `,
    image: require("../assets/blog/EquipoBlog.jpg"),
    category: "Consejos",
    date: "10 Ene 2023",
    author: "Carlos Rivera",
  },
  {
    id: "4",
    title: "Alimentación Antes y Después del Entrenamiento",
    content: `
    <p>Una buena nutrición es clave para potenciar tus entrenamientos y facilitar la recuperación:</p>
    <ul>
      <li><strong>Antes:</strong> Consume carbohidratos complejos y algo de proteína para tener energía.</li>
      <li><strong>Después:</strong> Incluye proteína para reparar el músculo y carbohidratos para reponer energía.</li>
      <li><strong>Hidratación:</strong> No olvides beber agua antes, durante y después de entrenar.</li>
    </ul>
    <p>Una alimentación adecuada mejora el rendimiento y te ayuda a alcanzar tus objetivos físicos.</p>
  `,
    image: require("../assets/blog/NutricionBlog.jpg"),
    category: "Nutrición",
    date: "05 Mar 2023",
    author: "Carlos Rivera",
  },
  {
    id: "5",
    title: "Rutinas de Cardio para Principiantes",
    content: `
    <p>El cardio es esencial para quemar grasa y mejorar la salud cardiovascular. Aquí tienes algunas opciones sencillas para empezar:</p>
    <ul>
      <li><strong>Caminatas rápidas</strong>: Perfectas para iniciar con bajo impacto.</li>
      <li><strong>Bicicleta estática</strong>: Trabajas piernas y resistencia sin dañar articulaciones.</li>
      <li><strong>HIIT suave</strong>: Alterna 30 segundos de ejercicio moderado con descanso.</li>
    </ul>
    <p>Comienza con sesiones de 20 a 30 minutos y aumenta progresivamente.</p>
  `,
    image: require("../assets/blog/CardioBlog.jpg"),
    category: "Entrenamiento",
    date: "18 Feb 2023",
    author: "Carlos Rivera",
  },
  {
    id: "6",
    title: "Cómo Mantener la Motivación para Entrenar",
    content: `
    <p>La motivación puede variar, pero con estos consejos lograrás mantenerte constante:</p>
    <ol>
      <li><strong>Define objetivos claros</strong>: Ya sea perder peso o ganar fuerza, ten un propósito.</li>
      <li><strong>Registra tu progreso</strong>: Ver mejoras te animará a seguir.</li>
      <li><strong>Cambia tu rutina</strong>: Evita la monotonía probando nuevos ejercicios.</li>
    </ol>
    <p>Entrenar con regularidad se vuelve más fácil cuando tienes metas y ves resultados.</p>
  `,
    image: require("../assets/blog/MotivacionBlog.jpg"),
    category: "Consejos",
    date: "28 Ene 2023",
    author: "Carlos Rivera",
  },
  {
    id: "7",
    title: "Importancia del Descanso en el Progreso Deportivo",
    content: `
    <p>El descanso es tan importante como el entrenamiento:</p>
    <ul>
      <li><strong>Previene lesiones</strong>: Dar tiempo al cuerpo para recuperarse evita sobrecargas.</li>
      <li><strong>Favorece el crecimiento muscular</strong>: El músculo se repara y fortalece en reposo.</li>
      <li><strong>Mejora el rendimiento</strong>: Dormir bien influye en la energía y coordinación.</li>
    </ul>
    <p>No subestimes el poder del descanso. ¡Tu cuerpo lo necesita para rendir al máximo!</p>
  `,
    image: require("../assets/blog/DescansoBlog.jpg"),
    category: "Salud",
    date: "12 Feb 2023",
    author: "Carlos Rivera",
  },
  {
    id: "8",
    title: "Errores Comunes al Levantar Pesas",
    content: `
    <p>Evita lesiones y mejora tus resultados corrigiendo estos errores frecuentes:</p>
    <ol>
      <li><strong>Usar peso excesivo</strong>: Prioriza la técnica sobre la cantidad de kilos.</li>
      <li><strong>No calentar</strong>: Aumenta el riesgo de desgarros musculares.</li>
      <li><strong>Ejecutar con mala postura</strong>: Puede afectar tu espalda, hombros o rodillas.</li>
    </ol>
    <p>Aprender la técnica correcta desde el inicio te hará más eficiente y seguro en el entrenamiento.</p>
  `,
    image: require("../assets/blog/PesasBlog.jpg"),
    category: "Entrenamiento",
    date: "03 Feb 2023",
    author: "Carlos Rivera",
  },
  {
    id: "9",
    title: "Beneficios de Entrenar al Aire Libre",
    content: `
    <p>Hacer ejercicio al aire libre no solo mejora la salud física, también el bienestar mental:</p>
    <ul>
      <li><strong>Mayor oxigenación</strong>: Respirar aire fresco mejora tu rendimiento.</li>
      <li><strong>Estimulación natural</strong>: La luz solar y el entorno reducen el estrés.</li>
      <li><strong>Variedad de espacios</strong>: Parques, playas, senderos... todo es un gimnasio natural.</li>
    </ul>
    <p>Sal de la rutina y entrena bajo el sol. ¡Tu cuerpo y mente te lo agradecerán!</p>
  `,
    image: require("../assets/blog/AireLibreBlog.jpg"),
    category: "Bienestar",
    date: "20 Feb 2023",
    author: "Carlos Rivera",
  },
];

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find((post) => post.id === id);

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

  ol,
  ul {
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
export default BlogDetailPage;
