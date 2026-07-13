import { NgClass, NgTemplateOutlet } from "@angular/common";
import type { HttpResourceRef } from "@angular/common/http";
import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";

import type { Agency } from "@features/agency/agency.model";
import type {
  Machine,
  MachineTicketHistory,
} from "@features/machine/machine.model";

import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { SelectModule } from "primeng/select";

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from "ng-apexcharts";

import { AgencyService } from "@features/agency/agency.service";
import { MachineService } from "@features/machine/machine.service";
import { TicketService } from "@features/ticket/ticket.service";
import { ErrorBoundaryComponent } from "@shared/components/error/error-boundary.component";
import {
  DashboardService,
  type CorrectiveTicketsByMachine,
} from "./dashboard.service";
import { AuthService } from "@app/core/services/auth.service";

interface SummaryCard {
  title: string;
  value: number | string;
  caption: string;
  icon: string;
  iconClass: string;
  onClick?: () => void;
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

type DashboardTicket = MachineTicketHistory & {
  agencia?: Agency;
};

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    NgApexchartsModule,
    NgClass,
    NgTemplateOutlet,
    ErrorBoundaryComponent,
  ],
  templateUrl: "./dashboard-page.component.html",
})
export default class DashboardComponent {
  private readonly router = inject(Router);

  protected readonly dashboard = inject(DashboardService);
  protected readonly machineService = inject(MachineService);
  protected readonly ticketService = inject(TicketService);
  protected readonly agencyService = inject(AgencyService);
  private readonly authService = inject(AuthService);

  protected readonly agencies = this.dashboard.agencies;
  protected readonly selectedAgency = this.dashboard.selectedAgency;
  protected readonly selectedMachine = this.dashboard.selectedMachine;
  private readonly selectedMachineTicketsResource =
    this.dashboard.tickets as unknown as HttpResourceRef<DashboardTicket[]>;
  private readonly allTicketsResource =
    this.ticketService.getAllTickets as unknown as HttpResourceRef<
      DashboardTicket[]
    >;

  public readonly machines = signal<Machine[]>([]);
  protected readonly ticketResource = computed<
    HttpResourceRef<DashboardTicket[]>
  >(() =>
    this.selectedMachine()
      ? this.selectedMachineTicketsResource
      : this.allTicketsResource,
  );

  public readonly tickets = computed<DashboardTicket[]>(() => {
    if (this.selectedMachine()) {
      return this.selectedMachineTicketsResource.hasValue()
        ? this.selectedMachineTicketsResource.value()
        : [];
    }

    const selectedAgency = this.selectedAgency();
    const allTickets = this.allTicketsResource.hasValue()
      ? this.allTicketsResource.value()
      : [];

    if (!selectedAgency) {
      return [];
    }

    return allTickets.filter(
      (ticket) => ticket.agencia?.id === selectedAgency.id,
    );
  });

  protected readonly ticketMonthRange = signal<Date[] | null>(null);

  private readonly chartPrimaryColor = computed(() => this.authService.branding()?.colorPrimario || "#0ea5e9");
  private readonly chartSuccessColor = "#10b981";
  private readonly chartMutedColor = "#64748b";
  private readonly chartGridColor = "#e5e7eb";
  private readonly chartLabelColor = "#64748b";
  private readonly chartTitleColor = "#0f172a";

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

  protected readonly featuredCorrectiveMachines = computed<
    CorrectiveTicketsByMachine[]
  >(() => {
    const selectedAgency = this.selectedAgency();

    if (!selectedAgency) {
      return [];
    }

    return [...this.dashboard.correctivesByMachine.value()]
      .filter((item) => item.agencia.id === selectedAgency.id)
      .sort(
        (current, next) =>
          next.numeroCorrectivos - current.numeroCorrectivos,
      )
      .slice(0, 6);
  });

  protected readonly recentTickets = computed(() =>
    [...this.tickets()]
      .sort(
        (current, next) =>
          new Date(next.fechaSolicitud).getTime() -
          new Date(current.fechaSolicitud).getTime(),
      )
      .slice(0, 8),
  );

  protected readonly closedTickets = computed(
    () =>
      this.tickets().filter((ticket) =>
        ticket.status?.valor?.toLowerCase().includes("cerr"),
      ).length,
  );

  protected readonly openTickets = computed(() =>
    Math.max(this.tickets().length - this.closedTickets(), 0),
  );

  protected readonly cards = computed<SummaryCard[]>(() => [
    {
      title: "Agencias",
      value: this.agencies().length,
      caption: "Agencias asignadas",
      icon: "pi-building-columns",
      iconClass: "bg-primary-50 text-primary",
      onClick: () => {
        this.router.navigate(["/agencies"]);
      },
    },
    {
      title: "Equipos",
      value: this.machines().length,
      caption: this.selectedAgency()
        ? `En ${this.selectedAgency()?.valor}`
        : "Selecciona una agencia",
      icon: "pi-desktop",
      iconClass: "bg-primary-50 text-primary",
      onClick: () => {
        if (!this.selectedAgency()) {
          return;
        }

        this.machineService.selectedAgency.set(this.selectedAgency());
        this.router.navigate(["/machines"]);
      },
    },
    {
      title: "Tickets",
      value: this.tickets().length,
      caption: this.selectedMachine()
        ? "Historial del equipo seleccionado"
        : this.selectedAgency()
          ? "Todos los equipos de la agencia"
          : "Selecciona una agencia",
      icon: "pi-ticket",
      iconClass: "bg-amber-50 text-amber-700",
      onClick: () => {
        if (!this.selectedAgency()) {
          return;
        }

        this.ticketService.selectedAgency.set(this.selectedAgency());
        this.router.navigate(["/tickets"]);
      },
    },
    {
      title: "Abiertos",
      value: this.openTickets(),
      caption: "Tickets pendientes",
      icon: "pi-chart-line",
      iconClass: "bg-sky-50 text-sky-700",
      onClick: () => {
        if (!this.selectedAgency()) {
          return;
        }

        this.ticketService.selectedAgency.set(this.selectedAgency());
        this.router.navigate(["/tickets"]);
      },
    },
  ]);

  protected readonly ticketTrendRangeLabel = computed(() => {
    const range = this.ticketMonthRange();

    if (!range || !range[0] || !range[1]) {
      return "Últimos 6 meses";
    }

    return `${this.formatMonthYear(range[0])} - ${this.formatMonthYear(
      range[1],
    )}`;
  });

  protected readonly ticketTrendChart = computed<TicketTrendChartOptions>(() => {
    const selectedRange = this.ticketMonthRange();

    let startDate: Date;
    let endDate: Date;

    if (
      selectedRange &&
      selectedRange.length === 2 &&
      selectedRange[0] &&
      selectedRange[1]
    ) {
      startDate = new Date(
        selectedRange[0].getFullYear(),
        selectedRange[0].getMonth(),
        1,
      );

      endDate = new Date(
        selectedRange[1].getFullYear(),
        selectedRange[1].getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    } else {
      const baseDate = new Date();

      startDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() - 5,
        1,
      );

      endDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
    }

    const labels: string[] = [];
    const counts: number[] = [];

    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (cursor <= endDate) {
      labels.push(
        `${this.monthNames[cursor.getMonth()]} ${cursor.getFullYear()}`,
      );

      counts.push(0);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    for (const ticket of this.tickets()) {
      const ticketDate = new Date(ticket.fechaSolicitud);

      if (Number.isNaN(ticketDate.getTime())) {
        continue;
      }

      if (ticketDate < startDate || ticketDate > endDate) {
        continue;
      }

      const diffMonths =
        (ticketDate.getFullYear() - startDate.getFullYear()) * 12 +
        (ticketDate.getMonth() - startDate.getMonth());

      if (diffMonths >= 0 && diffMonths < counts.length) {
        counts[diffMonths]++;
      }
    }

    return {
      series: [
        {
          name: "Tickets creados",
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
        foreColor: this.chartLabelColor,
        animations: {
          enabled: true,
          speed: 600,
        },
      },
      colors: [this.chartPrimaryColor()],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: [this.chartPrimaryColor()],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.5,
          opacityFrom: 0.24,
          opacityTo: 0.02,
          stops: [0, 90, 100],
        },
      },
      grid: {
        borderColor: this.chartGridColor,
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
            colors: this.chartLabelColor,
            fontSize: "12px",
            fontWeight: 700,
          },
        },
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          style: {
            colors: this.chartLabelColor,
            fontSize: "12px",
            fontWeight: 700,
          },
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (value: number) => `${value} tickets`,
        },
      },
    };
  });

  protected readonly ticketStatusChart = computed<TicketStatusChartOptions>(
    () => {
      return {
        series: [this.closedTickets(), this.openTickets()],
        chart: {
          type: "donut",
          height: 240,
          fontFamily: "inherit",
          foreColor: this.chartLabelColor,
        },
        labels: ["Cerrados", "Abiertos"],
        colors: [this.chartSuccessColor, this.chartPrimaryColor()],
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: "bottom",
          fontSize: "13px",
          fontWeight: 700,
          labels: {
            colors: this.chartLabelColor,
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
                  color: this.chartLabelColor,
                  fontSize: "13px",
                  fontWeight: 700,
                },
                value: {
                  show: true,
                  color: this.chartTitleColor,
                  fontSize: "24px",
                  fontWeight: 800,
                },
                total: {
                  show: true,
                  label: "Total",
                  color: this.chartLabelColor,
                  fontSize: "13px",
                  fontWeight: 700,
                  formatter: () => `${this.tickets().length}`,
                },
              },
            },
          },
        },
        tooltip: {
          theme: "light",
          y: {
            formatter: (value: number) => `${value} tickets`,
          },
        },
        responsive: [
          {
            breakpoint: 640,
            options: {
              chart: {
                height: 220,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
    },
  );

  private readonly setInitialAgency = effect(() => {
    const agencies = this.agencies();

    if (!this.selectedAgency() && agencies.length) {
      untracked(() => this.dashboard.selectedAgency.set(agencies[0]));
    }
  });

  // private readonly setInitialMachine = effect(() => {
  //   const machines = this.machines();
  //   const selectedMachine = this.selectedMachine();

  //   if (
  //     machines.length &&
  //     (!selectedMachine ||
  //       !machines.some(
  //         (machine) => machine.idEquipo === selectedMachine.idEquipo,
  //       ))
  //   ) {
  //     untracked(() => this.dashboard.selectedMachine.set(machines[0]));
  //   }
  // });

  protected onAgencyChange(agency: Agency | null) {
    this.dashboard.selectedAgency.set(agency);
    this.dashboard.selectedMachine.set(null);
    this.machines.set([]);
  }

  protected onMachineChange(machine: Machine | null) {
    this.dashboard.selectedMachine.set(machine);
  }

  protected viewAllMachines() {
    if (!this.selectedAgency()) {
      return;
    }

    this.machineService.selectedAgency.set(this.selectedAgency());
    this.router.navigate(["/machines"]);
  }

  protected clearTicketMonthRange() {
    this.ticketMonthRange.set(null);
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

  private formatMonthYear(date: Date): string {
    return `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
  }
}
