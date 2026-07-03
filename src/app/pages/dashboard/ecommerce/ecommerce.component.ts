import { DatePipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

import type { Agency } from "@features/agency/agency.model";
import type {
  Machine,
  MachineTicketHistory,
} from "@features/machine/machine.model";

import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";
import { PageBreadcrumbComponent } from "@app/shared/components/common/page-breadcrumb/page-breadcrumb.component";

import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexFill,
  ApexTooltip,
  ApexGrid,
  ApexNonAxisChartSeries,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
} from "ng-apexcharts";

import { DashboardService } from "./dashboard.service";

interface SummaryCard {
  title: string;
  value: number | string;
  caption: string;
  icon: string;
  iconClass: string;
  route: string;
}

type TicketTrendChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  colors: string[];
};

type TicketStatusChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  colors: string[];
  responsive: ApexResponsive[];
};

@Component({
  selector: "app-ecommerce",
  imports: [
    AppBlankComponent,
    PageBreadcrumbComponent,
    RouterLink,
    FormsModule,
    ButtonModule,
    SelectModule,
    NgApexchartsModule,
    DatePipe,
    NgClass,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./ecommerce.component.html",
  // styleUrl: "./ecommerce.component.css",
})
export class EcommerceComponent {
  protected readonly dashboard = inject(DashboardService);

  protected readonly agencies = this.dashboard.agencies;
  protected readonly selectedAgency = this.dashboard.selectedAgency;
  protected readonly selectedMachine = this.dashboard.selectedMachine;
  protected readonly machines = this.dashboard.machines;
  protected readonly tickets = this.dashboard.tickets;

  private readonly monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  protected readonly recentMachines = computed(() =>
    this.machines.value().slice(0, 6),
  );

  protected readonly recentTickets = computed(() =>
    [...this.tickets.value()]
      .sort(
        (current, next) =>
          new Date(next.fechaSolicitud).getTime() -
          new Date(current.fechaSolicitud).getTime(),
      )
      .slice(0, 8),
  );

  protected readonly closedTickets = computed(
    () =>
      this.tickets
        .value()
        .filter((ticket) =>
          ticket.status?.valor?.toLowerCase().includes("cerr"),
        ).length,
  );

  protected readonly openTickets = computed(() =>
    Math.max(this.tickets.value().length - this.closedTickets(), 0),
  );

  protected readonly cards = computed<SummaryCard[]>(() => [
    {
      title: "Agencias",
      value: this.agencies().length,
      caption: "Agencias asignadas",
      icon: "pi-building-columns",
      iconClass: "bg-blue-50 text-blue-700",
      route: "/agencies",
    },
    {
      title: "Equipos",
      value: this.machines.value().length,
      caption: this.selectedAgency()
        ? `En ${this.selectedAgency()?.valor}`
        : "Selecciona una agencia",
      icon: "pi-microchip",
      iconClass: "bg-emerald-50 text-emerald-700",
      route: "/machines",
    },
    {
      title: "Tickets",
      value: this.tickets.value().length,
      caption: this.selectedMachine()
        ? `Historial del equipo seleccionado`
        : "Selecciona un equipo",
      icon: "pi-ticket",
      iconClass: "bg-amber-50 text-amber-700",
      route: "/tickets/create",
    },
    {
      title: "Abiertos",
      value: this.openTickets(),
      caption: "Tickets pendientes",
      icon: "pi-chart-line",
      iconClass: "bg-sky-50 text-sky-700",
      route: "/tickets/create",
    },
  ]);

  protected readonly ticketTrendChart = computed<TicketTrendChartOptions>(() => {
    const baseDate = new Date();
    const labels: string[] = [];
    const counts = new Array(6).fill(0);

    for (let i = 5; i >= 0; i--) {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
      labels.push(this.monthNames[date.getMonth()]);
    }

    for (const ticket of this.tickets.value()) {
      const ticketDate = new Date(ticket.fechaSolicitud);

      if (Number.isNaN(ticketDate.getTime())) {
        continue;
      }

      const diffMonths =
        (baseDate.getFullYear() - ticketDate.getFullYear()) * 12 +
        (baseDate.getMonth() - ticketDate.getMonth());

      if (diffMonths >= 0 && diffMonths < 6) {
        counts[5 - diffMonths]++;
      }
    }

    return {
      series: [
        {
          name: "Tickets",
          data: counts,
        },
      ],
      chart: {
        type: "area",
        height: 320,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        fontFamily: "inherit",
      },
      colors: ["#2563eb"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.28,
          opacityTo: 0.04,
          stops: [0, 90, 100],
        },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
        padding: {
          left: 8,
          right: 8,
        },
      },
      xaxis: {
        categories: labels,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontWeight: 600,
          },
        },
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontWeight: 600,
          },
        },
      },
      tooltip: {
        theme: "",
        y: {
          formatter: (value: number) => `${value} tickets`,
        },
      },
    };
  });

  protected readonly ticketStatusChart = computed<TicketStatusChartOptions>(() => {
    return {
      series: [this.closedTickets(), this.openTickets()],
      chart: {
        type: "donut",
        height: 260,
        fontFamily: "inherit",
      },
      labels: ["Cerrados", "Abiertos"],
      colors: ["#10b981", "#3b82f6"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontSize: "13px",
        fontWeight: 600,
        labels: {
          colors: "#475569",
        },
        markers: {
          size: 8,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              name: {
                show: true,
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 700,
              },
              value: {
                show: true,
                color: "#0f172a",
                fontSize: "24px",
                fontWeight: 800,
              },
              total: {
                show: true,
                label: "Total",
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 700,
                formatter: () => `${this.tickets.value().length}`,
              },
            },
          },
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value: number) => `${value} tickets`,
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 240,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  });

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
        !machines.some(
          (machine) => machine.idEquipo === selectedMachine.idEquipo,
        ))
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

    if (status.includes("pend") || status.includes("proceso")) {
      return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    return "bg-slate-100 text-slate-700 ring-slate-200";
  }

  protected formatDateEs(date: string | Date | null | undefined): string {
    if (!date) {
      return "Sin fecha";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Sin fecha";
    }

    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(parsedDate)
      .replace(".", "");
  }

  protected trackByCard(card: SummaryCard): string {
    return card.title;
  }
}