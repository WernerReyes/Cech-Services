import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { RadioComponent } from '../../input/radio.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-buttons',
  imports: [
    ComponentCardComponent,
    RadioComponent,
    FormsModule
  ],
  templateUrl: './radio-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class RadioButtonsComponent {

  selectedValue: string = 'option2';

  handleRadioChange(value: string) {
    console.log(value,'value')
    this.selectedValue = value;
  }
}
