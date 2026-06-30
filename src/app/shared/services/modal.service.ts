import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly isOpenSignal = signal(false);
  readonly isOpen = this.isOpenSignal.asReadonly();

  /** Get current value synchronously */
  get isOpenValue(): boolean {
    return this.isOpen();
  }

  /** Open the modal */
  openModal(): void {
    this.isOpenSignal.set(true);
  }

  /** Close the modal */
  closeModal(): void {
    this.isOpenSignal.set(false);
  }

  /** Toggle the modal */
  toggleModal(): void {
    this.isOpenSignal.update(value => !value);
  }
}
