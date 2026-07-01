import { Component, inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme.service';
import { Moon } from '@primeicons/angular/moon';
import { Sun } from '@primeicons/angular/sun';

@Component({
  selector: 'app-theme-toggle-two',
  imports: [Moon, Sun],
  templateUrl: './theme-toggle-two.html',
})
export class ThemeToggleTwo {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
