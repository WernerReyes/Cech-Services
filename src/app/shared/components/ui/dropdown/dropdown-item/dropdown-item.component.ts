import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, RouterModule]
})
export class DropdownItemComponent {
  to = input<string>();
  baseClassName = input('block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900');
  className = input('');
  itemClick = output<void>();
  click = output<void>();

  get combinedClasses(): string {
    return `${this.baseClassName()} ${this.className()}`.trim();
  }

  handleClick(event: Event) {
    event.preventDefault();
    this.click.emit();
    this.itemClick.emit();
  }
}
