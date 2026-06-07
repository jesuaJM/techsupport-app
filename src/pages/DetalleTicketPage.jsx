import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../context/TicketsContext";
import { ticketService } from "../services/ticketService";

const ESTADOS      = ["abierto", "en_proceso", "resuelto", "cerrado"];
const ESTADO_LABELS   = { abierto: "Abierto", en_proceso: "En proceso", resuelto: "Resuelto", cerrado: "Cerrado" };
const PRIORIDAD_LABELS = { baja: "Baja", media: "Media", alta: "Alta", critica: "Crítica" };

export default function DetalleTicketPage() {
  const { id }                          = useParams();
  const [ticket, setTicket]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const { user, role, logout } = useAuth();
  const { dispatch }           = useTickets();
  const navigate               = useNavigate();

  // useEffect para cargar el detalle del ticket por ID
  useEffect(() => {
    setLoading(true);
    ticketService
      .getById(id)
      .then((data) => setTicket(data))
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id]);

  const cambiarEstado = async (nuevoEstado) => {
    setActualizando(true);
    try {
      await ticketService.updateEstado(id, nuevoEstado);
      const ticketActualizado = { ...ticket, estado: nuevoEstado };
      setTicket(ticketActualizado);
      dispatch({ type: "UPDATE_TICKET", payload: ticketActualizado });
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
    setActualizando(false);
  };

  if (loading) return <div className="loading-fullpage">Cargando ticket...</div>;
  if (!ticket) return null;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-icon-sm">⚙</span>
          <span>TechSupport</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard"    className="nav-item">📋 Dashboard</Link>
          <Link to="/tickets/nuevo" className="nav-item">➕ Nuevo Ticket</Link>
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

      <main className="main-content">
        <div className="detalle-header">
          <Link to="/dashboard" className="btn-back">← Volver</Link>
          <div className="detalle-title">
            <h2>Ticket #{ticket.id}</h2>
            <span className={`badge badge-estado estado-${ticket.estado}`}>
              {ESTADO_LABELS[ticket.estado]}
            </span>
          </div>
        </div>

        <div className="detalle-grid">
          <div className="detalle-main">
            <div className="info-card">
              <h3>{ticket.titulo}</h3>
              <p className="ticket-desc">{ticket.descripcion}</p>
            </div>

            <div className="meta-card">
              <div className="meta-item">
                <span className="meta-label">Categoría</span>
                <span className="badge badge-cat">{ticket.categoria}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Prioridad</span>
                <span className={`badge badge-prio prio-${ticket.prioridad}`}>
                  {PRIORIDAD_LABELS[ticket.prioridad]}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cliente</span>
                <span>{ticket.cliente}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Técnico asignado</span>
                <span>{ticket.tecnico || "Sin asignar"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Creado</span>
                <span>{new Date(ticket.fechaCreacion).toLocaleString("es-CO")}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Última actualización</span>
                <span>{new Date(ticket.fechaActualizacion).toLocaleString("es-CO")}</span>
              </div>
            </div>
          </div>

          {(role === "tecnico" || role === "admin") && (
            <div className="detalle-acciones">
              <h4>Cambiar Estado</h4>
              <div className="estado-buttons">
                {ESTADOS.map((estado) => (
                  <button
                    key={estado}
                    className={`estado-btn ${ticket.estado === estado ? "current" : ""}`}
                    onClick={() => cambiarEstado(estado)}
                    disabled={ticket.estado === estado || actualizando}
                  >
                    {ESTADO_LABELS[estado]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
