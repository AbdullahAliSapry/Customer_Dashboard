import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Ticket,
  ticketStatus,
  ticketPriority,
} from "../../interfaces/ticketInterface";
import { ErrorInfo } from "../../Api/ApiRepository";

interface TicketState {
  tickets: Ticket[];
  currentTicket: Ticket | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: ticketStatus;
    priority?: ticketPriority;
    assignedToAdminId?: string;
  };
}

const initialState: TicketState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  filters: {},
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<ErrorInfo | null>) => {
      state.error = action.payload?.message || null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // GET - Set all tickets
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },

    // GET - Set current ticket
    setCurrentTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.currentTicket = action.payload;
    },

    // CREATE - Add new ticket
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.push(action.payload);
    },

    // UPDATE - Update existing ticket
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(
        (ticket) => ticket.id === action.payload.id
      );
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
      // Update current ticket if it's the same one
      if (state.currentTicket?.id === action.payload.id) {
        state.currentTicket = action.payload;
      }
    },

    // DELETE - Remove ticket
    removeTicket: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter(
        (ticket) => ticket.id !== action.payload
      );
      // Clear current ticket if it's the deleted one
      if (state.currentTicket?.id === action.payload) {
        state.currentTicket = null;
      }
    },

    // Update ticket status
    updateTicketStatus: (
      state,
      action: PayloadAction<{ id: string; status: ticketStatus }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.status = action.payload.status;
        ticket.updatedAt = new Date().toISOString();
      }
      if (state.currentTicket?.id === action.payload.id) {
        state.currentTicket.status = action.payload.status;
        state.currentTicket.updatedAt = new Date().toISOString();
      }
    },

    // Update ticket priority
    updateTicketPriority: (
      state,
      action: PayloadAction<{ id: string; priority: ticketPriority }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.priority = action.payload.priority;
        ticket.updatedAt = new Date().toISOString();
      }
      if (state.currentTicket?.id === action.payload.id) {
        state.currentTicket.priority = action.payload.priority;
        state.currentTicket.updatedAt = new Date().toISOString();
      }
    },

    // Assign ticket to admin
    assignTicketToAdmin: (
      state,
      action: PayloadAction<{ id: string; adminId: string }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.assignedToAdminId = action.payload.adminId;
        ticket.updatedAt = new Date().toISOString();
      }
      if (state.currentTicket?.id === action.payload.id) {
        state.currentTicket.assignedToAdminId = action.payload.adminId;
        state.currentTicket.updatedAt = new Date().toISOString();
      }
    },

    // Set filters
    setFilters: (
      state,
      action: PayloadAction<{
        status?: ticketStatus;
        priority?: ticketPriority;
        assignedToAdminId?: string;
      }>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {};
    },

    // Clear all tickets
    clearTickets: (state) => {
      state.tickets = [];
      state.currentTicket = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setTickets,
  setCurrentTicket,
  addTicket,
  updateTicket,
  removeTicket,
  updateTicketStatus,
  updateTicketPriority,
  assignTicketToAdmin,
  setFilters,
  clearFilters,
  clearTickets,
} = ticketSlice.actions;

export default ticketSlice.reducer;
