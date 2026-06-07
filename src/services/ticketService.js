import axios from "axios";

// Instancia de Axios con configuración base
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
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
    if (error.response?.status === 401) localStorage.removeItem("token");
    return Promise.reject(error);
  }
);

// ── Data local de tickets con contenido coherente ────────────────────────────
const TICKETS_BASE = [
  {
    id: 1,
    titulo: "Computador no enciende después de corte de luz",
    descripcion: "El equipo del área contable no enciende luego de un corte de energía eléctrica ocurrido ayer. Se intentó conectar a otro tomacorriente sin éxito. La fuente de poder podría estar dañada.",
    estado: "en_proceso",
    prioridad: "alta",
    categoria: "hardware",
    cliente: "cliente1@techsupport.com",
    tecnico: "tecnico1@techsupport.com",
  },
  {
    id: 2,
    titulo: "Error al abrir archivos de Excel — 'formato no compatible'",
    descripcion: "Varios usuarios del área de ventas reportan que al intentar abrir archivos .xlsx reciben el mensaje 'El formato del archivo no es compatible'. El problema comenzó tras la última actualización de Office.",
    estado: "resuelto",
    prioridad: "media",
    categoria: "software",
    cliente: "cliente2@techsupport.com",
    tecnico: "tecnico2@techsupport.com",
  },
  {
    id: 3,
    titulo: "Sin acceso a internet en piso 3",
    descripcion: "Todos los equipos del tercer piso perdieron conexión a internet desde las 8 am. El switch del rack parece estar operativo pero los puertos no tienen actividad. Se requiere revisión urgente.",
    estado: "cerrado",
    prioridad: "critica",
    categoria: "red",
    cliente: "cliente3@techsupport.com",
    tecnico: "tecnico1@techsupport.com",
  },
  {
    id: 4,
    titulo: "Solicitud de instalación de software de diseño",
    descripcion: "El área de marketing requiere la instalación de Adobe Illustrator en dos equipos nuevos. Se adjunta número de licencia corporativa. No hay urgencia, se puede programar para esta semana.",
    estado: "abierto",
    prioridad: "baja",
    categoria: "software",
    cliente: "cliente4@techsupport.com",
    tecnico: null,
  },
  {
    id: 5,
    titulo: "Impresora de gerencia no imprime en color",
    descripcion: "La impresora HP LaserJet del piso ejecutivo imprime correctamente en blanco y negro pero falla en color. Ya se reemplazaron los cartuchos de tinta y el problema persiste. Se necesita diagnóstico.",
    estado: "en_proceso",
    prioridad: "media",
    categoria: "hardware",
    cliente: "cliente5@techsupport.com",
    tecnico: "tecnico3@techsupport.com",
  },
  {
    id: 6,
    titulo: "Cuenta de correo corporativo bloqueada",
    descripcion: "El usuario reporta que su cuenta de correo fue bloqueada tras varios intentos fallidos de inicio de sesión. Solicita restablecimiento de acceso y revisión de posible acceso no autorizado.",
    estado: "resuelto",
    prioridad: "alta",
    categoria: "seguridad",
    cliente: "cliente6@techsupport.com",
    tecnico: "tecnico2@techsupport.com",
  },
  {
    id: 7,
    titulo: "Wifi muy lento en sala de reuniones",
    descripcion: "La sala de juntas del segundo piso tiene señal wifi extremadamente lenta, lo que interrumpe las videollamadas con clientes. El problema se presenta especialmente en horas pico (10am-12pm).",
    estado: "cerrado",
    prioridad: "critica",
    categoria: "red",
    cliente: "cliente7@techsupport.com",
    tecnico: "tecnico1@techsupport.com",
  },
  {
    id: 8,
    titulo: "Pantalla de laptop muestra líneas horizontales",
    descripcion: "La pantalla del portátil asignado al coordinador de logística presenta líneas horizontales intermitentes. El problema empeora cuando el equipo lleva más de una hora encendido. Posible falla de GPU o cable de pantalla.",
    estado: "abierto",
    prioridad: "media",
    categoria: "hardware",
    cliente: "cliente8@techsupport.com",
    tecnico: null,
  },
  {
    id: 9,
    titulo: "Sistema de facturación no carga módulo de reportes",
    descripcion: "El módulo de reportes del ERP interno no carga desde ayer. El error en consola indica 'timeout de conexión con el servidor de base de datos'. El resto del sistema funciona con normalidad.",
    estado: "en_proceso",
    prioridad: "alta",
    categoria: "software",
    cliente: "cliente9@techsupport.com",
    tecnico: "tecnico3@techsupport.com",
  },
  {
    id: 10,
    titulo: "Actualización de antivirus en equipos de recepción",
    descripcion: "Se solicita actualizar el antivirus corporativo a la versión 2026 en los tres equipos de recepción. La licencia fue renovada la semana pasada. Puede realizarse en cualquier momento del día.",
    estado: "resuelto",
    prioridad: "baja",
    categoria: "seguridad",
    cliente: "cliente10@techsupport.com",
    tecnico: "tecnico2@techsupport.com",
  },
  {
    id: 11,
    titulo: "Teclado con teclas pegadas — equipo de bodega",
    descripcion: "El teclado del equipo principal de bodega tiene varias teclas que no responden correctamente, al parecer por derrame de líquido. Se requiere reemplazo del periférico.",
    estado: "cerrado",
    prioridad: "baja",
    categoria: "hardware",
    cliente: "cliente11@techsupport.com",
    tecnico: "tecnico1@techsupport.com",
  },
  {
    id: 12,
    titulo: "Acceso remoto VPN no conecta desde casa",
    descripcion: "Desde el lunes el usuario no puede conectarse a la VPN corporativa para trabajo remoto. Recibe el error 'Authentication failed' aunque la contraseña es correcta. Requiere verificación del perfil VPN.",
    estado: "abierto",
    prioridad: "alta",
    categoria: "red",
    cliente: "cliente12@techsupport.com",
    tecnico: null,
  },
  {
    id: 13,
    titulo: "Solicitud de creación de usuario en sistema CRM",
    descripcion: "Se solicita crear un nuevo usuario en el CRM para la vendedora que ingresó esta semana. Se debe asignar perfil de 'Asesor Comercial' con acceso solo a los clientes de la regional Bogotá.",
    estado: "abierto",
    prioridad: "media",
    categoria: "software",
    cliente: "cliente13@techsupport.com",
    tecnico: null,
  },
  {
    id: 14,
    titulo: "Monitor del puesto 14 parpadea constantemente",
    descripcion: "El monitor del puesto de trabajo 14 (área de cartera) presenta parpadeo constante desde esta mañana. Se cambió el cable HDMI sin resultado. Puede ser falla del monitor o de la tarjeta gráfica.",
    estado: "en_proceso",
    prioridad: "media",
    categoria: "hardware",
    cliente: "cliente14@techsupport.com",
    tecnico: "tecnico3@techsupport.com",
  },
  {
    id: 15,
    titulo: "Correos de clientes llegan a spam — dominio corporativo",
    descripcion: "Varios clientes reportan que los correos enviados desde el dominio @empresa.com están llegando a su carpeta de spam. Se sospecha problema con registros SPF/DKIM del servidor de correo.",
    estado: "en_proceso",
    prioridad: "critica",
    categoria: "seguridad",
    cliente: "cliente15@techsupport.com",
    tecnico: "tecnico2@techsupport.com",
  },
];

// Agrega fechas calculadas a cada ticket base
const TICKETS_CON_FECHAS = TICKETS_BASE.map((t) => ({
  ...t,
  fechaCreacion: new Date(Date.now() - t.id * 86400000).toISOString(),
  fechaActualizacion: new Date(Date.now() - t.id * 43200000).toISOString(),
}));

// ── Endpoints de tickets ─────────────────────────────────────────────────────

export const ticketService = {
  // GET todos los tickets — devuelve data local
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 400)); // simula latencia
    return [...TICKETS_CON_FECHAS];
  },

  // GET ticket por ID — busca en data local
  getById: async (id) => {
    await new Promise((r) => setTimeout(r, 300));
    const ticket = TICKETS_CON_FECHAS.find((t) => t.id === Number(id));
    if (!ticket) throw new Error("Ticket no encontrado");
    return { ...ticket };
  },

  // POST crear nuevo ticket — simula respuesta del servidor
  create: async (ticketData) => {
    await api.post("/todos", ticketData); // mantiene la llamada HTTP real para Axios
    return {
      ...ticketData,
      id: Date.now(), // ID único basado en timestamp
      estado: "abierto",
      tecnico: null,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };
  },

  // PATCH actualizar estado de ticket
  updateEstado: async (id, estado) => {
    await api.patch(`/todos/${id}`, { completed: estado === "resuelto" });
    return { id, estado };
  },
};

export default api;
