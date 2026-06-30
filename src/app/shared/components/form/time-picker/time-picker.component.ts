
import { Component, ElementRef, ChangeDetectionStrategy, input, output, viewChild } from '@angular/core';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-time-picker',
  imports: [],
  templateUrl: './time-picker.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class TimePickerComponent {

  id = input.required<string>();
  label = input('Time Select Input');
  placeholder = input('Select time');
  defaultTime = input<string | Date>();

  timeChange = output<string>();

  readonly timeInput = viewChild.required<ElementRef<HTMLInputElement>>('timeInput');

  private flatpickrInstance: flatpickr.Instance | undefined;

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.timeInput().nativeElement, {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',   // time format HH:mm
      time_24hr: false,    // set true for 24hr clock
      minuteIncrement: 1,
      defaultDate: this.defaultTime(),
      onChange: (selectedDates, dateStr) => {
        this.timeChange.emit(dateStr); // emit "HH:mm"
      }
    });
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
