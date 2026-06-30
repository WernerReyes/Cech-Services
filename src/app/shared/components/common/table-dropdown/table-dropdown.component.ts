import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  input,
  viewChild,
  TemplateRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { createPopper, Instance } from '@popperjs/core';


@Component({
  selector: 'app-table-dropdown',
  imports: [CommonModule],
  templateUrl: './table-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class TableDropdownComponent {

  dropdownButton = input<TemplateRef<unknown> | null>(null);
  dropdownContent = input<TemplateRef<unknown> | null>(null);
  readonly buttonRef = viewChild.required<ElementRef<HTMLDivElement>>('buttonRef');
  readonly contentRef = viewChild.required<ElementRef<HTMLDivElement>>('contentRef');
  
  isOpen = false;
  private popperInstance: Instance | null = null;
  private readonly closeOnDocumentClick = (event: MouseEvent) => this.close(event);

  constructor() {}

  ngAfterViewInit() {
    document.addEventListener('click', this.closeOnDocumentClick);

    this.popperInstance = createPopper(
      this.buttonRef().nativeElement,
      this.contentRef().nativeElement,
      {
        placement: 'bottom-end',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
        ],
      }
    );
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeOnDocumentClick);
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.popperInstance) {
      this.popperInstance.update();
    }
  }

  close(event: MouseEvent) {
    const target = event.target as Node;
    const dropdown = this.buttonRef().nativeElement.closest('div');
    if (dropdown && !dropdown.contains(target)) {
      this.isOpen = false;
    }
  }
}
