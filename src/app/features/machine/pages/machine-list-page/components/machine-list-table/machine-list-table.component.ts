import { Component, computed, inject, signal } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";

import { Router } from "@angular/router";


import { DatePipe } from "@angular/common";
import { MachineService } from "@app/features/machine/machine.service";
import { Machine } from "@app/features/machine/machine.model";
import { ErrorBoundaryComponent } from "@app/shared/components/error/error-boundary.component";

@Component({
  selector: "machine-list-table",
  imports: [
    TableModule,
    ButtonModule,
    DatePipe,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ErrorBoundaryComponent,
  ],
  templateUrl: "./machine-list-table.component.html",
})
export class MachineListTableComponent {
  private readonly machineService = inject(MachineService);
  private readonly router = inject(Router);

  protected readonly machines = this.machineService.machines;
  protected readonly selectedAgency = this.machineService.selectedAgency;
  protected readonly searchQuery = signal("");

  protected readonly filteredMachines = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const machines = this.machines.value() ?? [];

    if (!query) {
      return machines;
    }

    return machines.filter(
      (machine) =>
        machine.idEquipo?.toString().toLowerCase().includes(query) ||
        machine.equipo?.toLowerCase().includes(query) ||
        machine.serie?.toLowerCase().includes(query) ||
        machine.agencia?.valor?.toLowerCase().includes(query) ||
        machine.modelo?.descripcion?.toLowerCase().includes(query) ||
        machine.codigoInventario?.toLowerCase().includes(query),
    );
  });

  viewMachineDetails(machine: Machine) {
    this.machineService.machineSelect.set(machine);
    this.router.navigate([`/machines/${machine.idEquipo}`]);  
  }


  
}
