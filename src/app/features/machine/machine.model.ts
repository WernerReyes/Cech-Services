import type { CatalogValue } from "../client/client.model";

export interface Machine {
  idEquipo: number;
  serie: string;
  equipo: string;
  agencia: CatalogValue;
  fechaInstalacion: string | null;
  mesGarantia: number;
  modelo: {
    idModelo: number;
    descripcion: string;
    tipoMoneda: string;
  };
  codigoInventario: string | null;
}

export interface MachineTicketHistory {
  ticketId: number;
  number: string;
  subject: string;
  fechaSolicitud: string;
  creadoPor: string | null;
  status: CatalogValue;
}
