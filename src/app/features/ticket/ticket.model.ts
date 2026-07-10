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

export interface TicketTechnician {
  staffId: number;
  username: string;
  lastname: string;
}

export interface TicketDetail {
  ticketId: number;
  number: string;
  subject: string;
  estado: CatalogValue;
  tipoMantenimiento: CatalogValue;
  fechaSolicitud: string;
  agencia: CatalogValue;
  cliente: CatalogValue;
  equipo: CatalogValue;
  fechaProgramada: string | null;
  fechaEjecucion: string | null;
  modelo: CatalogValue;
  zona: CatalogValue;
  ubicacion: CatalogValue;
  tecnicoEjecutante: TicketTechnician | null;
  departamento: CatalogValue;
  provincia: CatalogValue;
  fileContador: string | null;
  fileVersion: string | null;
  informeTecnico: string | null;
}
