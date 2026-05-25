import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Componente de ruta protegida: redirige al login si no está autenticado
export default function RutaProtegida({ children, roles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
