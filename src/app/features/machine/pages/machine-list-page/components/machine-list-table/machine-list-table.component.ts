import { Component, inject } from "@angular/core";
import { ClientService } from "@features/client/client.service";

import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";

import { Router } from "@angular/router";


import { DatePipe } from "@angular/common";
import { MachineService } from "@app/features/machine/machine.service";
import { Machine } from "@app/features/machine/machine.model";

@Component({
  selector: "machine-list-table",
  imports: [TableModule, ButtonModule, DatePipe,  InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: "./machine-list-table.component.html",
})
export class MachineListTableComponent {
  private readonly machineService = inject(MachineService);
  private readonly router = inject(Router);

  protected readonly machines = this.machineService.machines;

  viewMachineDetails(machine: Machine) {
    this.machineService.machineSelect.set(machine);
    this.router.navigate([`/machines/${machine.idEquipo}`]);  
  }


  
}
