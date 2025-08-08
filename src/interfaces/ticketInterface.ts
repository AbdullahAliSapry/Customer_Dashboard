

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: ticketStatus;
  priority: ticketPriority;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  assignedToAdminId?: string;
  messages: TicketMessage[];
  attachments: TicketAttachment[];
}

export interface TicketMessage {
  id: number;
  content: string;
  sentAt: string;
  ticketId: string;
}

export interface TicketAttachment {
  id: number;
  fileName: string;
  filePath: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  ticketId: string;
}


export enum ticketStatus {
  Pending = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
}
export enum ticketPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: ticketPriority;
  createdByUserId: string;
}