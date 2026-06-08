import { useEffect } from "react";
import { useTickets } from "../context/TicketsContext";
import { ticketService } from "../services/ticketService";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function GestionPage() {
  const { tickets, loading, error, dispatch } = useTickets();
  const { user } = useAuth();
  useEffect(() => {
    dispatch({ type: "FETCH_START" });
    ticketService
      .getAll()
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((err) => dispatch({ type: "FETCH_ERROR", payload: err.message }));
  }, []);
  const marcarResuelto = async (id) => {
    try {
      await ticketService.updateEstado(id, "resuelto", user?.email || user?.nombre);
      const actualizado = await ticketService.getById(id);
      dispatch({ type: "UPDATE_TICKET", payload: actualizado });
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };
  return (
    <div className="layout">
      <Sidebar />
n      <main className="main-content">
        <header className="page-header">
          <h2>Gestión de Tickets</h2>
          <p>Área de trabajo para técnicos y administradores</p>
        </header>
n        {loading && <div className="loading-state">Cargando tickets...</div>}
        {error && <div className="error-state">Error: {error}</div>}
n        {!loading && !error && (
          <div className="tickets-table-wrapper">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Cliente</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>#{t.id}</td>
                    <td>{t.titulo}</td>
                    <td>{t.estado}</td>
                    <td>{t.prioridad}</td>
                    <td>{t.cliente}</td>
                    <td>
                      {t.estado !== "resuelto" && (
                        <button className="btn-primary" onClick={() => marcarResuelto(t.id)}>
                          Marcar resuelto
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
