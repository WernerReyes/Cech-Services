export interface CreateTicketRequest {
  idAgencia: number;
  idEquipo: number;
  fallaReportada: string;
}

export interface CreateTicketResult {
  ticketId: number;
  ticketNumber: string;
}

export interface TicketCreateForm {
  idAgencia: string;
  idEquipo: string;
  fallaReportada: string;
}
