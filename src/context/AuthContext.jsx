import { createContext, useContext, useReducer } from "react";

// Estado inicial del contexto de autenticación
const initialState = {
  user: null,
  isAuthenticated: false,
  role: null, // 'cliente' | 'tecnico' | 'admin'
};

// Reducer que maneja las acciones de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        role: action.payload.role,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
}

// Creación del contexto
export const AuthContext = createContext(null);

// Provider que envuelve la aplicación
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user, role) => {
    dispatch({ type: "LOGIN", payload: { user, role } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
