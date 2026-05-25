import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TicketsProvider } from "./context/TicketsContext";
import RutaProtegida from "./components/RutaProtegida";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NuevoTicketPage from "./pages/NuevoTicketPage";
import DetalleTicketPage from "./pages/DetalleTicketPage";
import "./App.css";

export default function App() {
  return (
    // Context API: los providers envuelven toda la app
    <AuthProvider>
      <TicketsProvider>
        {/* BrowserRouter: habilita el sistema de rutas */}
        <BrowserRouter>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas - requieren autenticación */}
            <Route
              path="/dashboard"
              element={
                <RutaProtegida>
                  <DashboardPage />
                </RutaProtegida>
              }
            />
            <Route
              path="/tickets/nuevo"
              element={
                <RutaProtegida>
                  <NuevoTicketPage />
                </RutaProtegida>
              }
            />
            <Route
              path="/tickets/:id"
              element={
                <RutaProtegida>
                  <DetalleTicketPage />
                </RutaProtegida>
              }
            />

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </TicketsProvider>
    </AuthProvider>
  );
}
