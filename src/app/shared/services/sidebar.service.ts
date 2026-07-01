import { Service, signal } from '@angular/core';

@Service()
export class SidebarService {
  private readonly isExpandedSignal = signal(true);
  private readonly isMobileOpenSignal = signal(false);
  private readonly isHoveredSignal = signal(false);

  readonly isExpanded = this.isExpandedSignal.asReadonly();
  readonly isMobileOpen = this.isMobileOpenSignal.asReadonly();
  readonly isHovered = this.isHoveredSignal.asReadonly();

  setExpanded(val: boolean) {
    this.isExpandedSignal.set(val);
  }

  toggleExpanded() {
    this.isExpandedSignal.update(value => !value);
  }

  setMobileOpen(val: boolean) {
    this.isMobileOpenSignal.set(val);
  }

  toggleMobileOpen() {
    this.isMobileOpenSignal.update(value => !value);
  }

  setHovered(val: boolean) {
    this.isHoveredSignal.set(val);
  }
}
