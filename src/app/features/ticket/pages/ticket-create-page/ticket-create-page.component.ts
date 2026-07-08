import { NgTemplateOutlet } from "@angular/common";
import { Component, computed, effect, inject, input, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  form,
  FormField,
  minLength,
  required,
  submit,
} from "@angular/forms/signals";
import { Router, RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";

import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";
import { AgencyService } from "@features/agency/agency.service";
import type { Agency } from "@features/agency/agency.model";
import type { Machine } from "@features/machine/machine.model";
import { MachineService } from "@features/machine/machine.service";

import { ButtonModule } from "primeng/button";
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
import { SelectModule } from "primeng/select";

import type { CreateTicketResult, TicketCreateForm } from "../../ticket.model";
import { TicketService } from "../../ticket.service";
import { PageBreadcrumbComponent } from "@app/shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ErrorBoundaryComponent } from "@app/shared/components/error/error-boundary.component";

const baseFormData: TicketCreateForm = {
  idAgencia: "",
  idEquipo: "",
  fallaReportada: "",
};

@Component({
  selector: "app-ticket-create-page",
  imports: [
    AppBlankComponent,
    RouterLink,
    ButtonModule,
    FormsModule,
    MessageModule,
    SelectModule,
    PageBreadcrumbComponent,
    ErrorBoundaryComponent,
    NgTemplateOutlet,
   
    FormField,
   
  ],
  templateUrl: "./ticket-create-page.component.html",
  styleUrl: "./ticket-create-page.component.css",
})
export default class TicketCreatePageComponent {
  private readonly agencyService = inject(AgencyService);
  private readonly machineService = inject(MachineService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly ticketService = inject(TicketService);

  idAgencia = input<string | null>(null);
  idEquipo = input<string | null>(null);

  protected readonly model = signal<TicketCreateForm>({ ...baseFormData });
  protected readonly createdTicket = signal<CreateTicketResult | null>(null);
  protected readonly agencies = this.agencyService.agencies;
  protected readonly machines = this.machineService.machines;
  protected readonly machine = computed(() => this.machineService.machineSelect.hasValue() ? this.machineService.machineSelect.value() : null);
  protected readonly selectedAgency = signal<Agency | null>(null);
  protected readonly selectedMachine = signal<Machine | null>(null);

  protected readonly ticketRoutes = computed(() => {
    const machineId = this.model().idEquipo || this.idEquipo();
    return machineId ? [`/machines/${machineId}`] : ["/tickets"];
  });

  protected readonly form = form(this.model, (path) => {
    required(path.idAgencia, {
      when: ({ state }) => state.touched(),
      message: "Selecciona una agencia",
    });
    required(path.idEquipo, {
      when: ({ state }) => state.touched(),
      message: "Selecciona un equipo",
    });
    required(path.fallaReportada, {
      when: ({ state }) => state.touched(),
      message: "Describe la falla reportada",
    });
    minLength(path.fallaReportada, 12, {
      message: "La falla debe tener al menos 12 caracteres",
    });
  });

  protected readonly agencyIdInvalid = computed(
    () =>
      this.form.idAgencia().touched() &&
      !this.isPositiveInteger(this.model().idAgencia),
  );

  protected readonly machineIdInvalid = computed(
    () =>
      this.form.idEquipo().touched() &&
      !this.isPositiveInteger(this.model().idEquipo),
  );

  protected readonly hasInvalidIds = computed(
    () =>
      !this.isPositiveInteger(this.model().idAgencia) ||
      !this.isPositiveInteger(this.model().idEquipo),
  );

  protected readonly backRoute = computed(() => {
    const idEquipo = this.model().idEquipo || this.idEquipo();
    return idEquipo ? ["/machines", idEquipo] : ["/machines"];
  });

  private readonly hydrateForm = effect(() => {
    const selectedMachine = this.machine();
    const agencies = this.agencies();
    const machines = this.machines.value();
    const idAgencia =
      selectedMachine?.agencia?.id?.toString() ?? this.idAgencia() ?? "";
    const idEquipo = selectedMachine?.idEquipo?.toString() ?? this.idEquipo() ?? "";

    untracked(() => {
      if (!this.selectedAgency() && idAgencia) {
        const selectedAgency = agencies.find(
          (agency) => agency.id.toString() === idAgencia,
        );

        if (selectedAgency) {
          this.selectedAgency.set(selectedAgency);
          this.machineService.selectedAgency.set(selectedAgency);
        }
      }

      if (!this.selectedMachine() && idEquipo) {
        const selectedMachineOption =
          selectedMachine?.idEquipo.toString() === idEquipo
            ? selectedMachine
            : machines.find((machine) => machine.idEquipo.toString() === idEquipo);

        if (selectedMachineOption) {
          this.selectedMachine.set(selectedMachineOption);
          this.machineService.machineSelect.set(selectedMachineOption);
        }
      }

      this.model.update((current) => ({
        ...current,
        idAgencia: current.idAgencia || idAgencia,
        idEquipo: current.idEquipo || idEquipo,
      }));
    });
  });

  protected onAgencyChange(agency: Agency | null) {
    this.selectedAgency.set(agency);
    this.selectedMachine.set(null);
    this.machineService.selectedAgency.set(agency);
    this.machineService.machineSelect.set(null);

    this.model.update((current) => ({
      ...current,
      idAgencia: agency?.id.toString() ?? "",
      idEquipo: "",
    }));
  }

  protected onMachineChange(machine: Machine | null) {
    this.selectedMachine.set(machine);
    this.machineService.machineSelect.set(machine);

    this.model.update((current) => ({
      ...current,
      idEquipo: machine?.idEquipo.toString() ?? "",
    }));
  }

  protected async onCreateTicket(event: Event) {
    event.preventDefault();
    this.form().markAsTouched();
    this.createdTicket.set(null);

    if (!this.form().valid() || this.hasInvalidIds()) {
      return;
    }

    const payload = {
      idAgencia: Number(this.model().idAgencia),
      idEquipo: Number(this.model().idEquipo),
      fallaReportada: this.model().fallaReportada.trim(),
    };

    await submit(this.form, async () => {
      const response = await firstValueFrom(
        this.ticketService.createTicket(payload),
      );

      this.createdTicket.set(response.data);
      this.machineService.machineTickets.reload();

      this.messageService.add({
        severity: "success",
        summary: "Ticket creado",
        detail:
          response.message ||
          `Ticket ${response.data.ticketNumber} creado exitosamente.`,
        life: 3500,
      });

      setTimeout(() => {
        this.router.navigate(["/machines", payload.idEquipo]);
      }, 900);
    }).catch((error) => {
      this.messageService.add({
        severity: "error",
        summary: "No se pudo crear el ticket",
        detail:
          error?.error?.message ||
          error?.message ||
          "Ocurrió un error al registrar el ticket.",
        life: 5000,
      });
    });
  }

  private isPositiveInteger(value: string): boolean {
    return /^[1-9]\d*$/.test(value.trim());
  }
}
