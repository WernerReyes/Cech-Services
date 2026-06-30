
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

export interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './select.component.html',
})
export class SelectComponent {
  options = input<Option[]>([]);
  placeholder = input('Select an option');
  className = input('');
  defaultValue = input('');
  value = input('');
  selectedValue = signal('');

  valueChange = output<string>();

  ngOnInit() {
    this.selectedValue.set(this.value() || this.defaultValue());
  }

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedValue.set(value);
    this.valueChange.emit(value);
  }
}
