export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  userId: string;
  adminId?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'admin';
  message: string;
  createdAt: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface SendMessageInput {
  ticketId: string;
  message: string;
} 