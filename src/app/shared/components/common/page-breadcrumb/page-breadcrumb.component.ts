import {
  Component,
  TemplateRef,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-page-breadcrumb',
  standalone: true,
  imports: [RouterModule, NgTemplateOutlet, ButtonModule, TooltipModule],
  templateUrl: './page-breadcrumb.component.html',
})
export class PageBreadcrumbComponent {
  private readonly router = inject(Router);

  private readonly CURRENT_URL_KEY = 'app_current_url';
  private readonly PREVIOUS_URL_KEY = 'app_previous_url';

  icon = input<string>();

  iconTemplate = contentChild<TemplateRef<any>>('icon');

  allowBackRoutes = input<string[]>([]);

  back = input<boolean>(false);

  pageTitle = input('');

  constructor() {
    this.saveNavigationHistory();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const newUrl = this.cleanUrl(event.urlAfterRedirects);

        const currentUrl =
          sessionStorage.getItem(this.CURRENT_URL_KEY) ?? this.cleanUrl(this.router.url);

        if (newUrl !== currentUrl) {
          sessionStorage.setItem(this.PREVIOUS_URL_KEY, currentUrl);
          sessionStorage.setItem(this.CURRENT_URL_KEY, newUrl);
        }
      });
  }

  onBackClick() {
    const allowedRoutes = this.allowBackRoutes();

    const fallbackRoute = allowedRoutes.length > 0 ? allowedRoutes[0] : '/';

    const previousUrl = sessionStorage.getItem(this.PREVIOUS_URL_KEY);

    if (
      previousUrl &&
      this.isAllowedBackRoute(previousUrl, allowedRoutes)
    ) {
      this.router.navigateByUrl(previousUrl);
      return;
    }

    this.router.navigateByUrl(fallbackRoute);
  }

  private saveNavigationHistory() {
    const currentRouterUrl = this.cleanUrl(this.router.url);

    const storedCurrentUrl = sessionStorage.getItem(this.CURRENT_URL_KEY);

    if (!storedCurrentUrl) {
      sessionStorage.setItem(this.CURRENT_URL_KEY, currentRouterUrl);
      return;
    }

    if (storedCurrentUrl !== currentRouterUrl) {
      sessionStorage.setItem(this.PREVIOUS_URL_KEY, storedCurrentUrl);
      sessionStorage.setItem(this.CURRENT_URL_KEY, currentRouterUrl);
    }
  }

  private isAllowedBackRoute(previousUrl: string, allowedRoutes: string[]): boolean {
    const cleanPreviousUrl = this.cleanUrl(previousUrl);

    return allowedRoutes.some((route) => {
      const cleanRoute = this.cleanUrl(route);

      /**
       * Importante:
       * '/' solo debe coincidir con '/'
       * No debe permitir cualquier ruta.
       */
      if (cleanRoute === '/') {
        return cleanPreviousUrl === '/';
      }

      return (
        cleanPreviousUrl === cleanRoute ||
        cleanPreviousUrl.startsWith(cleanRoute + '/')
      );
    });
  }

  private cleanUrl(url: string): string {
    if (!url) {
      return '/';
    }

    const cleanUrl = url.split('?')[0].split('#')[0];

    if (cleanUrl.length > 1 && cleanUrl.endsWith('/')) {
      return cleanUrl.slice(0, -1);
    }

    return cleanUrl || '/';
  }
}