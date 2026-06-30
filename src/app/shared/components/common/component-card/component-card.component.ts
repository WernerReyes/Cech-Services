
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-component-card',
  imports: [],
  templateUrl: './component-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class ComponentCardComponent {

  title = input.required<string>();
  desc = input('');
  className = input('');
}
