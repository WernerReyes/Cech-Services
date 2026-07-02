import { DatePipe, NgClass } from "@angular/common";
import { Component, computed, effect, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";
import { ArrowLeft } from "@primeicons/angular/arrow-left";
import { Box } from "@primeicons/angular/box";
import { Calendar } from "@primeicons/angular/calendar";
import { Hashtag } from "@primeicons/angular/hashtag";
import { MapMarker } from "@primeicons/angular/map-marker";
import { Microchip } from "@primeicons/angular/microchip";
import { Plus } from "@primeicons/angular/plus";
import { Shield } from "@primeicons/angular/shield";
import { Ticket } from "@primeicons/angular/ticket";
import { ButtonModule } from "primeng/button";

import type { MachineTicketHistory } from "../../machine.model";
import { MachineService } from "../../machine.service";

@Component({
  selector: "app-machine-details-page",
  imports: [
    AppBlankComponent,
    RouterLink,
    ButtonModule,
    DatePipe,
    NgClass,
    ArrowLeft,
    Box,
    Calendar,
    Hashtag,
    MapMarker,
    Microchip,
    Plus,
    Shield,
    Ticket,
  ],
  templateUrl: "./machine-details-page.component.html",
  styleUrl: "./machine-details-page.component.css",
})
export default class MachineDetailsPageComponent {
  private readonly machineService = inject(MachineService);

  id = input<string | null>(null);

  protected readonly machine = computed(() => this.machineService.machineSelect());

  protected readonly title = computed<string>(
    () => this.machine()?.equipo || "Detalles del Equipo",
  );

  protected readonly machines = this.machineService.machines;
  protected readonly tickets = this.machineService.machineTickets;

  private readonly setMachineById = effect(() => {
    const machineId = this.id();
    const currentMachine = this.machineService.machineSelect();

    if (!machineId || currentMachine?.idEquipo.toString() === machineId) {
      return;
    }

    const selectedMachine = this.machines
      .value()
      .find((machine) => machine.idEquipo.toString() === machineId);

    if (selectedMachine || !this.machines.isLoading()) {
      this.machineService.machineSelect.set(selectedMachine || null);
    }
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

  protected ticketAuthor(ticket: MachineTicketHistory): string {
    return ticket.creadoPor ? `Por ${ticket.creadoPor}` : "Origen: sistema";
  }
}
