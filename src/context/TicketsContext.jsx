import { createContext, useContext, useReducer } from "react";

const initialState = {
  tickets: [],
  loading: false,
  error: null,
  filtro: "todos",
};

function ticketsReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, tickets: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_TICKET":
      return { ...state, tickets: [action.payload, ...state.tickets] };
    case "UPDATE_TICKET":
      return {
        ...state,
        tickets: state.tickets.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "SET_FILTRO":
      return { ...state, filtro: action.payload };
    default:
      return state;
  }
}

export const TicketsContext = createContext(null);

export function TicketsProvider({ children }) {
  const [state, dispatch] = useReducer(ticketsReducer, initialState);

  return (
    <TicketsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (!context) throw new Error("useTickets debe usarse dentro de TicketsProvider");
  return context;
}
