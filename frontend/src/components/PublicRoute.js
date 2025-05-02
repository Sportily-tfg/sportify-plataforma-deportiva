import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Cargando...</div>;
    }
    
    if (user) {
        return <Navigate to="/about" replace />;
    }
    
    return children;
};

export default PublicRoute;