import { CommonModule } from '@angular/common';
import { Component, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports:[CommonModule]
})
export class DropdownComponent implements AfterViewInit, OnDestroy {
  isOpen = input(false);
  close = output<void>();
  className = input('');

  readonly dropdownRef = viewChild<ElementRef<HTMLDivElement>>('dropdownRef');

  private handleClickOutside = (event: MouseEvent) => {
    const dropdownRef = this.dropdownRef();
    if (
      this.isOpen() &&
      dropdownRef &&
      !dropdownRef.nativeElement.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest('.dropdown-toggle')
    ) {
      this.close.emit();
    }
  };

  ngAfterViewInit() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
}
