import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-header',
  imports: [CommonModule],
  template: `
    <thead [ngClass]="className()"><ng-content></ng-content></thead>
  `,
  styles: ``
})
export class TableHeaderComponent {
  className = input('');
}
