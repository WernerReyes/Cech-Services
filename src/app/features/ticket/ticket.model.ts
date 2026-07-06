import { CatalogValue } from "../agency/agency.model";

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

export interface Ticket {
  ticketId: number;
  number: string;
  subject: string;
  fechaSolicitud: string;
  creadoPor: CatalogValue | null;
  status: CatalogValue;
  agencia: CatalogValue;
}
