
import { Component, ElementRef, ChangeDetectionStrategy, input, output, viewChild } from '@angular/core';
import flatpickr from 'flatpickr';
import { LabelComponent } from '../label/label.component';
// import "flatpickr/dist/flatpickr.css";

@Component({
  selector: 'app-date-picker',
  imports: [LabelComponent],
  templateUrl: './date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class DatePickerComponent {

  id = input.required<string>();
  mode = input<'single' | 'multiple' | 'range' | 'time'>('single');
  defaultDate = input<string | Date | string[] | Date[]>();
  label = input<string>();
  placeholder = input<string>();
  dateChange = output<any>();

  readonly dateInput = viewChild.required<ElementRef<HTMLInputElement>>('dateInput');

  private flatpickrInstance: flatpickr.Instance | undefined;

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.dateInput().nativeElement, {
      mode: this.mode(),
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'Y-m-d',
      defaultDate: this.defaultDate(),
      onChange: (selectedDates, dateStr, instance) => {
        this.dateChange.emit({ selectedDates, dateStr, instance });
      }
    });
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
