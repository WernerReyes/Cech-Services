import { DatePipe, NgClass } from "@angular/common";
import { Component, computed, effect, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";

import { ButtonModule } from "primeng/button";
import { TimelineModule } from "primeng/timeline";

import type { MachineTicketHistory } from "../../machine.model";
import { MachineService } from "../../machine.service";
import { PageBreadcrumbComponent } from "@app/shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { GenericTableCellDirective } from "@app/shared/components/tables/generic-table/generic-table-cell.directive";

@Component({
  selector: "app-machine-details-page",
  imports: [
    AppBlankComponent,
    RouterLink,
    ButtonModule,
    DatePipe,
    NgClass,
    TimelineModule,
    PageBreadcrumbComponent,
    GenericTableCellDirective,
  ],
  templateUrl: "./machine-details-page.component.html",
  styleUrl: "./machine-details-page.component.css",
})
export default class MachineDetailsPageComponent {
  private readonly machineService = inject(MachineService);

  id = input<string | null>(null);

  protected readonly machine = computed(() => this.machineService.machineSelect.value());

  protected readonly title = computed<string>(
    () => this.machine()?.equipo || "Detalles del Equipo",
  );

  protected readonly machines = this.machineService.machines;
  protected readonly tickets = this.machineService.machineTickets;

  protected readonly ticketEvents = computed(() => {
    return this.tickets.value().map((ticket) => ({
      ticket,
      date: ticket.fechaSolicitud,
      status: ticket.status?.valor ?? "Sin estado",
      number: ticket.number,
      subject: ticket.subject,
      author: this.ticketAuthor(ticket),
    }));
  });

  private readonly setMachineById = effect(() => {
    const machineId = this.id();
    this.machineService.machineId.set(machineId ? parseInt(machineId) : null);
    // const currentMachine = this.machineService.machineSelect();
    // console.log("Machine ID from route:", machineId, currentMachine);
    // if (!machineId || currentMachine?.idEquipo.toString() === machineId) {
    //   return;
    // }

    // const selectedMachine = this.machines
    //   .value()
    //   .find((machine) => machine.idEquipo.toString() === machineId);

    //   console.log("Selected Machine:", this.machines
    //   .value());

    // if (selectedMachine || !this.machines.isLoading()) {
    //   this.machineService.machineSelect.set(selectedMachine || null);
    // }
  });

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
    return ticket.creadoPor ? `Por ${ticket.creadoPor}` : "Origen: sistema";
  }
}