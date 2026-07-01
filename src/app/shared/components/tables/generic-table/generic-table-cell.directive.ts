import { Directive, TemplateRef, input } from '@angular/core';

@Directive({
  selector: 'ng-template[appTableCell]',
  standalone: true,
})
export class GenericTableCellDirective {
  appTableCell = input.required<string>();

  constructor(public templateRef: TemplateRef<any>) {}
}