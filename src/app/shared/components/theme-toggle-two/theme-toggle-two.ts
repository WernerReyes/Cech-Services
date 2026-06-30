import { Component, inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme.service';


@Component({
  selector: 'app-theme-toggle-two',
  imports: [],
  templateUrl: './theme-toggle-two.html',
})
export class ThemeToggleTwo {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
