import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, redirectPath = '/login', message = '' }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    
    if (loading) {
        return <div>Cargando...</div>;
    }
    
    if (!user) {
        return <Navigate to={redirectPath} state={{ from: location, message }} replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <Navigate to={redirectPath} state={{ from: location, message }} replace />;
    }
    
    return children;
};

export default ProtectedRoute;