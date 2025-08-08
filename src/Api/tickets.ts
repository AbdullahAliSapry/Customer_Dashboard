import axios from 'axios';
import { Ticket, TicketMessage, CreateTicketInput, SendMessageInput } from '../interfaces/ticketInterface';
import { mockTickets } from '../mock/tickets';



export const ticketsApi = {
  // Get all tickets for the current user
  getTickets: async (): Promise<Ticket[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTickets;
  },

  // Get a single ticket by ID
  getTicket: async (ticketId: string): Promise<Ticket> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  },

  // Create a new ticket
  createTicket: async (ticketData: CreateTicketInput): Promise<Ticket> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newTicket: Ticket = {
      id: String(mockTickets.length + 1),
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1',
    };
    mockTickets.push(newTicket);
    return newTicket;
  },

  // Get all messages for a ticket
  getTicketMessages: async (ticketId: string): Promise<TicketMessage[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  },

  // Send a message in a ticket
  sendMessage: async (messageData: SendMessageInput): Promise<TicketMessage> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: String(Date.now()),
      ticketId: messageData.ticketId,
      senderId: 'user1',
      senderType: 'user',
      message: messageData.message,
      createdAt: new Date().toISOString(),
    };
  },

  // Close a ticket
  closeTicket: async (ticketId: string): Promise<Ticket> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');
    ticket.status = 'closed';
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }
}; 