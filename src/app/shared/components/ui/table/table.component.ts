import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table',
  imports:[CommonModule],
  template: `<table [ngClass]="'min-w-full ' + className()"><ng-content></ng-content></table>`,
})
export class TableComponent {
  className = input('');
}
