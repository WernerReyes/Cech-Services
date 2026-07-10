import { Component, computed, inject } from '@angular/core';
import { AppBlankComponent } from '@shared/layout/app-blank/app-blank.component';
import { MachineListTableComponent } from './components/machine-list-table/machine-list-table.component';
import { SelectAgencyComponent } from './components/select-agency/select-agency.component';
import { PageBreadcrumbComponent } from '@shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { AgencyService } from '@features/agency/agency.service';

@Component({
  selector: 'app-machine-list-page',
  imports: [AppBlankComponent, PageBreadcrumbComponent, MachineListTableComponent, SelectAgencyComponent],
  templateUrl: './machine-list-page.component.html',
  styleUrl: './machine-list-page.component.css',
})
export default class MachineListPageComponent {
  private readonly agencyService = inject(AgencyService);
  
  title = computed(() => {
    const selectedAgency = this.agencyService.selectedAgency();
    return selectedAgency ? `Equipos de ${selectedAgency.valor}` : 'Equipos';
  });

}
