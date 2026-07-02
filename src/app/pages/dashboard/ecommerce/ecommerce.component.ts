import { DatePipe, NgClass } from "@angular/common";
import { Component, computed, effect, inject, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { Agency } from "@features/agency/agency.model";
import type { Machine, MachineTicketHistory } from "@features/machine/machine.model";
import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";
import { ArrowUpRight } from "@primeicons/angular/arrow-up-right";
import { Bolt } from "@primeicons/angular/bolt";
import { BuildingColumns } from "@primeicons/angular/building-columns";
import { ChartLine } from "@primeicons/angular/chart-line";
import { Clock } from "@primeicons/angular/clock";
import { MapMarker } from "@primeicons/angular/map-marker";
import { Microchip } from "@primeicons/angular/microchip";
import { Plus } from "@primeicons/angular/plus";
import { Ticket } from "@primeicons/angular/ticket";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";

import { DashboardService } from "./dashboard.service";

interface SummaryCard {
  title: string;
  value: number | string;
  caption: string;
  icon: string;
  iconClass: string;
  route: string;
}

@Component({
  selector: "app-ecommerce",
  imports: [
    AppBlankComponent,
    RouterLink,
    FormsModule,
    ButtonModule,
    SelectModule,
    DatePipe,
    NgClass,
    ArrowUpRight,
    Bolt,
    BuildingColumns,
    ChartLine,
    Clock,
    MapMarker,
    Microchip,
    Plus,
    Ticket,
  ],
  templateUrl: "./ecommerce.component.html",
})
export class EcommerceComponent {
  protected readonly dashboard = inject(DashboardService);

  protected readonly agencies = this.dashboard.agencies;
  protected readonly selectedAgency = this.dashboard.selectedAgency;
  protected readonly selectedMachine = this.dashboard.selectedMachine;
  protected readonly machines = this.dashboard.machines;
  protected readonly tickets = this.dashboard.tickets;

  protected readonly recentMachines = computed(() =>
    this.machines.value().slice(0, 5),
  );

  protected readonly recentTickets = computed(() =>
    [...this.tickets.value()]
      .sort(
        (current, next) =>
          new Date(next.fechaSolicitud).getTime() -
          new Date(current.fechaSolicitud).getTime(),
      )
      .slice(0, 5),
  );

  protected readonly closedTickets = computed(
    () =>
      this.tickets
        .value()
        .filter((ticket) =>
          ticket.status?.valor?.toLowerCase().includes("cerr"),
        ).length,
  );

  protected readonly openTickets = computed(
    () => Math.max(this.tickets.value().length - this.closedTickets(), 0),
  );

  protected readonly cards = computed<SummaryCard[]>(() => [
    {
      title: "Agencias",
      value: this.agencies().length,
      caption: "Agencias asignadas al usuario",
      icon: "building-columns",
      iconClass: "bg-blue-50 text-blue-700",
      route: "/agencies",
    },
    {
      title: "Equipos",
      value: this.machines.value().length,
      caption: this.selectedAgency()
        ? `En ${this.selectedAgency()?.valor}`
        : "Selecciona una agencia",
      icon: "microchip",
      iconClass: "bg-emerald-50 text-emerald-700",
      route: "/machines",
    },
    {
      title: "Tickets",
      value: this.tickets.value().length,
      caption: this.selectedMachine()
        ? `Historial de ${this.selectedMachine()?.equipo}`
        : "Selecciona un equipo",
      icon: "ticket",
      iconClass: "bg-amber-50 text-amber-700",
      route: "/tickets/create",
    },
    {
      title: "Abiertos",
      value: this.openTickets(),
      caption: "Segun el equipo destacado",
      icon: "chart-line",
      iconClass: "bg-sky-50 text-sky-700",
      route: "/tickets/create",
    },
  ]);

  private readonly setInitialAgency = effect(() => {
    const agencies = this.agencies();

    if (!this.selectedAgency() && agencies.length) {
      untracked(() => this.dashboard.selectedAgency.set(agencies[0]));
    }
  });

  private readonly setInitialMachine = effect(() => {
    const machines = this.machines.value();
    const selectedMachine = this.selectedMachine();

    if (
      machines.length &&
      (!selectedMachine ||
        !machines.some((machine) => machine.idEquipo === selectedMachine.idEquipo))
    ) {
      untracked(() => this.dashboard.selectedMachine.set(machines[0]));
    }
  });

  protected onAgencyChange(agency: Agency | null) {
    this.dashboard.selectedAgency.set(agency);
    this.dashboard.selectedMachine.set(null);
  }

  protected onMachineChange(machine: Machine | null) {
    this.dashboard.selectedMachine.set(machine);
  }

  protected ticketStatusClass(ticket: MachineTicketHistory): string {
    const status = ticket.status?.valor?.toLowerCase() ?? "";

    if (status.includes("cerr") || status.includes("closed")) {
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (status.includes("abiert") || status.includes("open")) {
      return "bg-sky-50 text-sky-700 ring-sky-200";
    }

    return "bg-slate-100 text-slate-700 ring-slate-200";
  }

  protected trackByCard(card: SummaryCard): string {
    return card.title;
  }
}
