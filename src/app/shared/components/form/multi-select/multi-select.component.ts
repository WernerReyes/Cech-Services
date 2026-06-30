import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface Option {
  value: string;
  text: string;
}

@Component({
  selector: 'app-multi-select',
  imports: [
    CommonModule,
  ],
  templateUrl: './multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class MultiSelectComponent {

  label = input('');
  options = input<Option[]>([]);
  defaultSelected = input<string[]>([]);
  disabled = input(false);
  selectionChange = output<string[]>();

  selectedOptions: string[] = [];
  isOpen = false;

  ngOnInit() {
    this.selectedOptions = [...this.defaultSelected()];
  }

  toggleDropdown() {
    if (!this.disabled()) this.isOpen = !this.isOpen;
  }

  handleSelect(optionValue: string) {
    if (this.selectedOptions.includes(optionValue)) {
      this.selectedOptions = this.selectedOptions.filter(v => v !== optionValue);
    } else {
      this.selectedOptions = [...this.selectedOptions, optionValue];
    }
    this.selectionChange.emit(this.selectedOptions);
  }

  removeOption(value: string) {
    this.selectedOptions = this.selectedOptions.filter(opt => opt !== value);
    this.selectionChange.emit(this.selectedOptions);
  }

  get selectedValuesText(): string[] {
    return this.selectedOptions
      .map(value => this.options().find(option => option.value === value)?.text || '')
      .filter(Boolean);
  }
}
