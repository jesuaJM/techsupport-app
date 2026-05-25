# TechSupport S.A.S. — Sistema Web de Gestión de Soporte Técnico

Aplicación web desarrollada con React 18 + Vite para la gestión centralizada de solicitudes de soporte técnico. Proyecto académico — Actividad 4, Desarrollo de Aplicaciones Web, Iberoamericana 2026.

## Tecnologías implementadas

| Tecnología | Uso en el proyecto |
|---|---|
| **ReactJS** | Componentes funcionales para todas las vistas |
| **useState** | Estado del formulario de login y nuevo ticket |
| **useEffect** | Carga de tickets y cálculo de estadísticas |
| **useReducer** | Estado global de auth, tickets y formulario |
| **useContext** | Consumo de AuthContext y TicketsContext |
| **Context API** | AuthProvider y TicketsProvider globales |
| **Axios** | Peticiones HTTP con interceptores JWT |
| **React Router DOM** | Rutas protegidas y navegación programática |

## Estructura del proyecto

```
src/
├── context/
│   ├── AuthContext.jsx      # Context API + useReducer para autenticación
│   └── TicketsContext.jsx   # Context API + useReducer para tickets
├── pages/
│   ├── LoginPage.jsx        # useState para formulario de login
│   ├── DashboardPage.jsx    # useEffect + Axios para carga de datos
│   ├── NuevoTicketPage.jsx  # useReducer para formulario de ticket
│   └── DetalleTicketPage.jsx
├── components/
│   └── RutaProtegida.jsx    # HOC para protección de rutas
├── services/
│   └── ticketService.js     # Instancia Axios con interceptores
└── App.jsx                  # React Router + Context providers
```

## Instalación

```bash
npm install
npm run dev
```

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Cliente | cliente@demo.com | 123456 |
| Técnico | tecnico@demo.com | 123456 |
| Admin | admin@demo.com | 123456 |
