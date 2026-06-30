import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dropdown-item-two',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <a
      [routerLink]="to()"
      [ngClass]="combinedClasses"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </a>
  `,
})
export class DropdownItemTwoComponent {
  to = input.required<string>();
  baseClassName = input('block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900');
  className = input('');
  itemClick = output<void>();
  click = output<void>();

  get combinedClasses(): string {
    return `${this.baseClassName()} ${this.className()}`.trim();
  }

  handleClick(event: Event) {
    this.click.emit();
    this.itemClick.emit();
  }
}
