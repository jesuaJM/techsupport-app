import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import Sidebar from "../components/Sidebar";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const data = ticketService.getLogs();
    setLogs(data);
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <h2>Registro de Cambios (Logs)</h2>
          <p>Acciones realizadas sobre tickets — solo admins</p>
        </header>

        <div className="logs-container">
          {logs.length === 0 ? (
            <p>No hay entradas en el registro.</p>
          ) : (
            <ul className="logs-list">
              {logs.map((l, idx) => (
                <li key={idx} className="log-entry"><pre>{l}</pre></li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
