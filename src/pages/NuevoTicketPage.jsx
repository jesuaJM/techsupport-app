import { useReducer, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../context/TicketsContext";
import { ticketService } from "../services/ticketService";
import Sidebar from "../components/Sidebar";

// Estado inicial del formulario
const formInicial = {
  titulo: "",
  descripcion: "",
  categoria: "software",
  prioridad: "media",
};

// useReducer para manejar el estado del formulario
function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return formInicial;
    default:
      return state;
  }
}

export default function NuevoTicketPage() {
  const [formState, formDispatch] = useReducer(formReducer, formInicial);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const { user } = useAuth();
  const { dispatch } = useTickets();
  const navigate = useNavigate();

  const handleChange = (e) => {
    formDispatch({ type: "SET_FIELD", field: e.target.name, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const nuevoTicket = await ticketService.create({
        ...formState,
        cliente: user?.email,
        estado: "abierto",
        tecnico: null,
      });

      dispatch({ type: "ADD_TICKET", payload: nuevoTicket });
      setExito(true);

      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      console.error("Error al crear ticket:", err);
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="layout">
        <div className="exito-container">
          <div className="exito-card">
            <span className="exito-icon">✓</span>
            <h2>Ticket creado exitosamente</h2>
            <p>Redirigiendo al dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <h2>Nueva Solicitud de Soporte</h2>
          <p>Complete el formulario para registrar su requerimiento</p>
        </header>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="ticket-form">
            <div className="field-group">
              <label htmlFor="titulo">Título del problema *</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                value={formState.titulo}
                onChange={handleChange}
                placeholder="Ej: El equipo no enciende correctamente"
                required
                maxLength={100}
              />
              <span className="char-count">{formState.titulo.length}/100</span>
            </div>

            <div className="field-group">
              <label htmlFor="descripcion">Descripción detallada *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formState.descripcion}
                onChange={handleChange}
                placeholder="Describa el problema con el mayor detalle posible..."
                required
                rows={5}
              />
            </div>

            <div className="form-row">
              <div className="field-group">
                <label htmlFor="categoria">Categoría</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formState.categoria}
                  onChange={handleChange}
                >
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="red">Red / Conectividad</option>
                  <option value="seguridad">Seguridad</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="prioridad">Prioridad</label>
                <select
                  id="prioridad"
                  name="prioridad"
                  value={formState.prioridad}
                  onChange={handleChange}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <Link to="/dashboard" className="btn-secondary">Cancelar</Link>
              <button type="submit" className="btn-primary" disabled={enviando}>
                {enviando ? "Enviando..." : "Registrar Solicitud"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
