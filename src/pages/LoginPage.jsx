import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Usuarios de demostración
const USUARIOS_DEMO = [
  { email: "cliente@demo.com", password: "123456", role: "cliente", nombre: "Carlos Mendoza" },
  { email: "tecnico@demo.com", password: "123456", role: "tecnico", nombre: "Laura Gómez" },
  { email: "admin@demo.com", password: "123456", role: "admin", nombre: "Diego Ramírez" },
];

export default function LoginPage() {
  // useState para manejar el formulario
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simula latencia de red
    await new Promise((r) => setTimeout(r, 600));

    const usuario = USUARIOS_DEMO.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (usuario) {
      login({ nombre: usuario.nombre, email: usuario.email }, usuario.role);
      navigate("/dashboard");
    } else {
      setError("Correo o contraseña incorrectos.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">⚙</span>
          <h1>TechSupport</h1>
          <p>Sistema de Gestión de Soporte Técnico</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@empresa.com"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar al sistema"}
          </button>
        </form>

        <div className="demo-hints">
          <p className="demo-title">Cuentas de demostración</p>
          <div className="demo-accounts">
            {USUARIOS_DEMO.map((u) => (
              <button
                key={u.email}
                className="demo-btn"
                onClick={() => setFormData({ email: u.email, password: u.password })}
              >
                <span className={`role-badge role-${u.role}`}>{u.role}</span>
                {u.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
