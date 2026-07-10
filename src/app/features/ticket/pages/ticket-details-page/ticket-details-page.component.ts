import { DatePipe, NgClass } from "@angular/common";
import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import { PageBreadcrumbComponent } from "@shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ErrorBoundaryComponent } from "@shared/components/error/error-boundary.component";
import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";
import type { CatalogValue } from "@features/agency/agency.model";
import { SafeUrlPipe } from "@shared/pipe/safe-url.pipe";

import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";

import type { TicketDetail } from "@features/ticket/ticket.model";
import { TicketService } from "@features/ticket/ticket.service";
import { MachineService } from "@features/machine/machine.service";

type TicketDocument = {
  label: string;
  description: string;
  fileName: string | null;
  icon: string;
  url: string | null;
};

@Component({
  selector: "app-ticket-details-page",
  imports: [
    AppBlankComponent,
    PageBreadcrumbComponent,
    ErrorBoundaryComponent,
    RouterLink,
    ButtonModule,
    DialogModule,
    TooltipModule,
    DatePipe,
    NgClass,
    SafeUrlPipe,
  ],
  templateUrl: "./ticket-details-page.component.html",
  styleUrl: "./ticket-details-page.component.css",
})
export default class TicketDetailsPageComponent {
  protected readonly ticketService = inject(TicketService);
  protected readonly machineService = inject(MachineService);

  readonly id = input<string | null>(null);

  protected readonly documentPreviewUrl = signal<string | null>(null);
  protected readonly documentPreviewTitle = signal("Documento");

  protected readonly allowBackRoutes = computed(() => {
    const base = ['/tickets', '/'];

    const machineId = this.machineService.machineId();

    if (machineId) {
      return [...base, `/machines/${machineId}`];
    }
    return base;
  });

  protected readonly ticketId = computed(() => this.parseTicketId(this.id()));
  protected readonly hasInvalidId = computed(() => !!this.id() && !this.ticketId());
  protected readonly ticket = computed(() =>
    this.ticketService.ticketDetail.hasValue()
      ? this.ticketService.ticketDetail.value()
      : null,
  );
  protected readonly title = computed(() => {
    const ticket = this.ticket();

    if (ticket?.number) {
      return `Ticket ${ticket.number}`;
    }

    return this.ticketId() ? `Ticket #${this.ticketId()}` : "Detalle de ticket";
  });

  private readonly syncTicketId = effect(() => {
    this.ticketService.selectedTicketId.set(this.ticketId());
  });

  protected documents(ticket: TicketDetail): TicketDocument[] {
    return [
      {
        label: "Contador",
        description: "Archivo de contadores",
        fileName: ticket.fileContador,
        icon: "pi-file-pdf",
        url: this.buildDocumentUrl("file_contador", ticket.fileContador),
      },
      {
        label: "Versión",
        description: "Versión del software",
        fileName: ticket.fileVersion,
        icon: "pi-microchip",
        url: this.buildDocumentUrl("file_version", ticket.fileVersion),
      },
      {
        label: "Informe técnico",
        description: "Reporte de atención",
        fileName: ticket.informeTecnico,
        icon: "pi-address-book",
        url: this.buildDocumentUrl("informe_tecnico", ticket.informeTecnico),
      },
    ];
  }

  protected openDocument(document: TicketDocument) {
    if (!document.url) {
      return;
    }

    this.documentPreviewTitle.set(document.label);
    this.documentPreviewUrl.set(document.url);
  }

  protected closeDocument() {
    this.documentPreviewUrl.set(null);
  }

  protected toDate(value: string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const normalizedValue = value.includes("T") ? value : value.replace(" ", "T");
    const date = new Date(normalizedValue);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  protected technicianName(ticket: TicketDetail): string {
    const technician = ticket.tecnicoEjecutante;

    if (!technician) {
      return "Sin técnico asignado";
    }

    const name = technician.lastname || technician.username;
    const username = technician.username ? `@${technician.username}` : "";

    return [name, username].filter(Boolean).join(" ");
  }

  protected statusClass(status: CatalogValue | null | undefined): string {
    const value = status?.valor?.toLowerCase() ?? "";

    if (value.includes("cerr") || value.includes("closed")) {
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (value.includes("abiert") || value.includes("open")) {
      return "bg-sky-50 text-sky-700 ring-sky-200";
    }

    if (value.includes("pend") || value.includes("proceso")) {
      return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    return "bg-slate-100 text-slate-700 ring-slate-200";
  }

  protected maintenanceClass(value: string | null | undefined): string {
    const normalizedValue = value?.toLowerCase() ?? "";

    if (normalizedValue.includes("correct")) {
      return "bg-rose-50 text-rose-700 ring-rose-200";
    }

    if (normalizedValue.includes("prevent")) {
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    }

    return "bg-slate-100 text-slate-700 ring-slate-200";
  }

  private parseTicketId(value: string | null): number | null {
    if (!value || !/^[1-9]\d*$/.test(value)) {
      return null;
    }

    return Number(value);
  }

  private buildDocumentUrl(folder: string, fileName: string | null): string | null {
    if (!fileName) {
      return null;
    }

    return `https://osticket.cechriza.com/system/vista/ajax/${folder}/${encodeURIComponent(fileName)}`;
  }
}
