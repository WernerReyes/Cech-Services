import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-label',
  imports: [CommonModule],
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class LabelComponent {
  for = input<string>();
  className = input('');
}
