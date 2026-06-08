import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../context/TicketsContext";
import { ticketService } from "../services/ticketService";
import Sidebar from "../components/Sidebar";
import ClienteDashboard from "./ClienteDashboard";

const ESTADO_LABELS = {
  abierto: "Abierto",
  en_proceso: "En proceso",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
};

const PRIORIDAD_LABELS = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

export default function DashboardPage() {
  const { user, role } = useAuth();
  const { tickets, loading, error, filtro, dispatch } = useTickets();
  const [stats, setStats] = useState(null);

  // useEffect para cargar tickets al montar el componente
  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    ticketService
      .getAll()
      .then((data) => {
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      })
      .catch((err) => {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      });
  }, []);

  // useEffect para calcular estadísticas cuando cambian los tickets
  useEffect(() => {
    if (tickets.length === 0) return;
    const conteo = tickets.reduce(
      (acc, t) => ({ ...acc, [t.estado]: (acc[t.estado] || 0) + 1 }),
      {}
    );
    setStats(conteo);
  }, [tickets]);

  const ticketsFiltrados =
    filtro === "todos" ? tickets : tickets.filter((t) => t.estado === filtro);

  if (role === 'cliente') return <ClienteDashboard />;

  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <h2>Panel de Control</h2>
          <p>Bienvenido, {user?.nombre}</p>
        </header>

        {stats && (
          <div className="stats-grid">
            {Object.entries(ESTADO_LABELS).map(([key, label]) => (
              <div key={key} className={`stat-card stat-${key}`}>
                <span className="stat-number">{stats[key] || 0}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="tickets-section">
          <div className="section-header">
            <h3>Solicitudes de Soporte</h3>
            <div className="filtros">
              {["todos", ...Object.keys(ESTADO_LABELS)].map((f) => (
                <button
                  key={f}
                  className={`filtro-btn ${filtro === f ? "active" : ""}`}
                  onClick={() => dispatch({ type: "SET_FILTRO", payload: f })}
                >
                  {ESTADO_LABELS[f] || "Todos"}
                </button>
              ))}
            </div>
          </div>

          {loading && <div className="loading-state">Cargando tickets...</div>}
          {error && <div className="error-state">Error: {error}</div>}

          {!loading && !error && (
            <div className="tickets-table-wrapper">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Fecha</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsFiltrados.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="ticket-id">#{ticket.id}</td>
                      <td className="ticket-titulo">{ticket.titulo}</td>
                      <td>
                        <span className="badge badge-cat">{ticket.categoria}</span>
                      </td>
                      <td>
                        <span className={`badge badge-estado estado-${ticket.estado}`}>
                          {ESTADO_LABELS[ticket.estado]}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-prio prio-${ticket.prioridad}`}>
                          {PRIORIDAD_LABELS[ticket.prioridad]}
                        </span>
                      </td>
                      <td className="ticket-fecha">
                        {new Date(ticket.fechaCreacion).toLocaleDateString("es-CO")}
                      </td>
                      <td>
                        <Link to={`/tickets/${ticket.id}`} className="btn-ver">
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
