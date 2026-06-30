import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-row',
  imports: [CommonModule],
  template: `
   <tr [ngClass]="className()"><ng-content></ng-content></tr>
  `,
})
export class TableRowComponent {
  className = input('');
}
