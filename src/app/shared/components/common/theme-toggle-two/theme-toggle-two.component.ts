import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';


@Component({
  selector: 'app-theme-toggle-two',
  imports: [],
  templateUrl: './theme-toggle-two.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class ThemeToggleTwoComponent {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
