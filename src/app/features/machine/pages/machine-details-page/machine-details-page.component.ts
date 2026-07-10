import { DatePipe, NgClass } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";

import { ButtonModule } from "primeng/button";
import { TimelineModule } from "primeng/timeline";
import { TooltipModule } from "primeng/tooltip";

import type { Machine, MachineTicketHistory } from "@features/machine/machine.model";
import { PageBreadcrumbComponent } from "@shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ErrorBoundaryComponent } from "@shared/components/error/error-boundary.component";
import { MachineService } from "@features/machine/machine.service";
import { DocumentDetailsDialogComponent } from "./components/document-details-dialog/document-details-dialog.component";
import { TicketService } from "@features/ticket/ticket.service";
import { HttpStatusCode } from "@angular/common/http";
import { ErrorPageComponent } from "@shared/components/error/pages/error-page.component";
import { linkedSignal } from '@angular/core';

@Component({
  selector: "app-machine-details-page",
  imports: [
    AppBlankComponent,
    DocumentDetailsDialogComponent,
    RouterLink,
    ButtonModule,
    ErrorBoundaryComponent,
    DatePipe,
    NgClass,
    TooltipModule,
    TimelineModule,
    PageBreadcrumbComponent,
    ErrorPageComponent
  ],
  templateUrl: "./machine-details-page.component.html",
  styleUrl: "./machine-details-page.component.css",
})
export default class MachineDetailsPageComponent {
  readonly machineService = inject(MachineService);
  readonly ticketService = inject(TicketService);

  id = input<string | null>(null);

  url = signal<string | null>(null);

  tickets = signal<MachineTicketHistory[]>([]);
  selectedMachine = signal<Machine | null>(null);

  statusCode = linkedSignal(() => {
       const code = this.machineService.machineSelect.statusCode();
       return code;
  })
  //  signal<HttpStatusCode | null>(null);

  HttpStatusCode = HttpStatusCode;

  protected readonly title = computed<string>(() =>
    this.selectedMachine()
      ? this.selectedMachine()?.equipo || "Detalles del Equipo"
      : "Detalles del Equipo",
  );

  protected readonly allowBackRoutes = computed<string[]>(() => {
    const ticketId = this.ticketService.selectedTicketId();
    const base = ["/machines", "/"];
    if (ticketId) {
      return [...base, `/tickets/${ticketId}`];
    }
    return base;
  });

  private readonly setMachineById = effect(() => {
    const machineId = this.id();
    this.machineService.machineId.set(machineId ? parseInt(machineId) : null);
  });

  formatTickets(tickets: MachineTicketHistory[]) {
    return tickets.map((ticket) => ({
      ticket,
      date: ticket.fechaSolicitud,
      status: ticket.status?.valor ?? "Sin estado",
      number: ticket.number,
      subject: ticket.subject,
      author: this.ticketAuthor(ticket),
    }));
  }

  protected statusClass(ticket: MachineTicketHistory): string {
    const status = ticket.status?.valor?.toLowerCase() ?? "";

    if (status.includes("cerr") || status.includes("closed")) {
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (status.includes("abiert") || status.includes("open")) {
      return "bg-sky-50 text-sky-700 ring-sky-200";
    }

    if (status.includes("pend") || status.includes("proceso")) {
      return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    return "bg-slate-100 text-slate-700 ring-slate-200";
  }

  protected statusDotClass(ticket: MachineTicketHistory): string {
    const status = ticket.status?.valor?.toLowerCase() ?? "";

    if (status.includes("cerr") || status.includes("closed")) {
      return "bg-emerald-500";
    }

    if (status.includes("abiert") || status.includes("open")) {
      return "bg-sky-500";
    }

    if (status.includes("pend") || status.includes("proceso")) {
      return "bg-amber-500";
    }

    return "bg-slate-400";
  }

  protected statusMarkerClass(ticket: MachineTicketHistory): string {
    const status = ticket.status?.valor?.toLowerCase() ?? "";

    if (status.includes("cerr") || status.includes("closed")) {
      return "bg-emerald-50 ring-emerald-100";
    }

    if (status.includes("abiert") || status.includes("open")) {
      return "bg-sky-50 ring-sky-100";
    }

    if (status.includes("pend") || status.includes("proceso")) {
      return "bg-amber-50 ring-amber-100";
    }

    return "bg-slate-100 ring-slate-200";
  }

  protected ticketAuthor(ticket: MachineTicketHistory): string {
    return ticket.creadoPor
      ? `Por ${ticket.creadoPor.valor}`
      : "Origen: sistema";
  }
}
