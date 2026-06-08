import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const loc = useLocation();
  const isActive = (path) => loc.pathname === path;
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo-icon-sm">⚙</span>
        <span>TechSupport</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
          📋 Dashboard
        </Link>
        <Link to="/tickets/nuevo" className={`nav-item ${isActive('/tickets/nuevo') ? 'active' : ''}`}>
          ➕ Nuevo Ticket
        </Link>
        {(role === "tecnico" || role === "admin") && (
          <Link to="/tickets" className={`nav-item ${isActive('/tickets') ? 'active' : ''}`}>
            🔧 Gestión
          </Link>
        )}

        {role === "admin" && (
          <Link to="/admin/logs" className={`nav-item ${isActive('/admin/logs') ? 'active' : ''}`}>
            📜 Logs
          </Link>
        )}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className={`user-avatar role-${role}`}>{user?.nombre?.[0]}</div>
          <div>
            <p className="user-name">{user?.nombre}</p>
            <p className="user-role">{role}</p>
          </div>
        </div>
        <button className="btn-logout" onClick={logout}>Salir</button>
      </div>
    </aside>
  );
}
