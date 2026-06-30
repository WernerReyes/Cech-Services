import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [
    CommonModule,
  ],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class ModalComponent {

  isOpen = input(false);
  close = output<void>();
  className = input('');
  showCloseButton = input(true);
  isFullscreen = input(false);

  constructor() {
    effect(() => {
      document.body.style.overflow = this.isOpen() ? 'hidden' : 'unset';
    });
  }

  ngOnDestroy() {
    document.body.style.overflow = 'unset';
  }

  onBackdropClick(event: MouseEvent) {
    if (!this.isFullscreen()) {
      this.close.emit();
    }
  }

  onContentClick(event: MouseEvent) {
    event.stopPropagation();
  }

 @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close.emit();
    }
  }
}
