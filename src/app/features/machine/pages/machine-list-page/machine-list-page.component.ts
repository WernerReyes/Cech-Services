import { Component } from '@angular/core';
import { AppBlankComponent } from '@app/shared/layout/app-blank/app-blank.component';
import { MachineListTableComponent } from './components/machine-list-table/machine-list-table.component';
import { SelectAgencyComponent } from './components/select-agency/select-agency.component';

@Component({
  selector: 'app-machine-list-page',
  imports: [AppBlankComponent, MachineListTableComponent, SelectAgencyComponent],
  templateUrl: './machine-list-page.component.html',
  styleUrl: './machine-list-page.component.css',
})
export default class MachineListPageComponent {
  

}
