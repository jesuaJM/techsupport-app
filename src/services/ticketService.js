import axios from "axios";

// Instancia de Axios con configuración base
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // API mock pública para demostración
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request: agrega token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// ── Endpoints de tickets (mapeados sobre /todos de JSONPlaceholder) ──────────

// Normaliza el formato de JSONPlaceholder al formato del sistema de tickets
function normalizarTicket(item) {
  const prioridades = ["baja", "media", "alta", "critica"];
  const estados = ["abierto", "en_proceso", "resuelto", "cerrado"];
  const categorias = ["hardware", "software", "red", "seguridad", "otro"];

  return {
    id: item.id,
    titulo: item.title,
    descripcion: `Solicitud de soporte técnico #${item.id}. ${item.title}.`,
    estado: estados[item.id % 4],
    prioridad: prioridades[item.id % 4],
    categoria: categorias[item.id % 5],
    cliente: `cliente${item.userId}@techsupport.com`,
    tecnico: item.completed ? `tecnico${(item.id % 3) + 1}@techsupport.com` : null,
    fechaCreacion: new Date(Date.now() - item.id * 86400000).toISOString(),
    fechaActualizacion: new Date(Date.now() - item.id * 43200000).toISOString(),
  };
}

export const ticketService = {
  // GET todos los tickets
  getAll: async () => {
    const { data } = await api.get("/todos?_limit=20");
    return data.map(normalizarTicket);
  },

  // GET ticket por ID
  getById: async (id) => {
    const { data } = await api.get(`/todos/${id}`);
    return normalizarTicket(data);
  },

  // POST crear nuevo ticket
  create: async (ticketData) => {
    const { data } = await api.post("/todos", ticketData);
    return {
      ...ticketData,
      id: data.id || Math.floor(Math.random() * 1000) + 100,
      estado: "abierto",
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };
  },

  // PATCH actualizar estado de ticket
  updateEstado: async (id, estado) => {
    const { data } = await api.patch(`/todos/${id}`, { completed: estado === "resuelto" });
    return data;
  },
};

export default api;
