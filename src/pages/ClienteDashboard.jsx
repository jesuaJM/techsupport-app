import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../context/TicketsContext";
import { ticketService } from "../services/ticketService";
import Sidebar from "../components/Sidebar";

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

export default function ClienteDashboard() {
  const { user } = useAuth();
  const { tickets, dispatch, loading, error } = useTickets();

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

  const misTickets = tickets.filter((t) => t.cliente === user?.email);

  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <h2>Mis Solicitudes</h2>
          <p>Gestiona tus tickets de soporte</p>
        </header>

        {loading && <div className="loading-state">Cargando...</div>}
        {error && <div className="error-state">Error: {error}</div>}

        {!loading && !error && (
          <div className="tickets-section">
            <div className="section-header">
              <h3>Tus Tickets ({misTickets.length})</h3>
            </div>

            {misTickets.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                  No tienes solicitudes aún.
                </p>
                <Link to="/tickets/nuevo" className="btn-primary">
                  Crear nueva solicitud
                </Link>
              </div>
            ) : (
              <div style={{ overflow: "auto" }}>
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
                    {misTickets.map((ticket) => (
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
        )}
      </main>
    </div>
  );
}
