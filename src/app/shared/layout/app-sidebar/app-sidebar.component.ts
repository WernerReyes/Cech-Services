import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { AuthService } from "@app/core/services/auth.service";
import { filter, map, startWith } from "rxjs";
import { SidebarService } from "../../services/sidebar.service";

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

@Component({
  selector: "app-sidebar",
  imports: [CommonModule, RouterModule],
  templateUrl: "./app-sidebar.component.html",
})
export class AppSidebarComponent {
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly sidebarService = inject(SidebarService);
  private readonly authService = inject(AuthService);

  protected readonly branding = computed(() => this.authService.branding());

  navItems: NavItem[] = [
    {
      icon: "pi-th-large",
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Agencias",
      icon: "pi-building",
      path: "/agencies",
      new: true,
    },
    {
      name: "Equipos",
      icon: "pi-warehouse",
      path: "/machines",
    },
    {
      name: "Tickets",
      icon: "pi-ticket",
      subItems: [
        {
          name: "Lista de Tickets",
          path: "/tickets",
        },
        {
          name: "Crear Ticket",
          path: "/tickets/create",
        },
      ],
    },
  ];

  openSubmenu: string | null = null;
  subMenuHeights: { [key: string]: number } = {};

  readonly isExpanded = this.sidebarService.isExpanded;
  readonly isMobileOpen = this.sidebarService.isMobileOpen;
  readonly isHovered = this.sidebarService.isHovered;

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.normalizeUrl(event.urlAfterRedirects)),
      startWith(this.normalizeUrl(this.router.url)),
    ),
    { initialValue: this.normalizeUrl(this.router.url) },
  );

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const event = this.navigationEnd();
      if (event) {
        this.setActiveMenuFromRoute(event.urlAfterRedirects);
      }
    });

    effect(() => {
      if (!this.isExpanded() && !this.isMobileOpen() && !this.isHovered()) {
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    this.setActiveMenuFromRoute(this.currentUrl());
  }

  isActive(path: string): boolean {
    return this.isRouteMatch(this.currentUrl(), path);
  }

  isExactActive(path: string): boolean {
    return !!path && this.currentUrl() === path;
  }

  toggleSubmenu(section: string, index: number): void {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
      return;
    }

    this.openSubmenuByKey(key);
  }

  onMenuItemClick(nav: NavItem, section: string, index: number): void {
    if (nav.subItems?.length) {
      this.openSubmenuByKey(`${section}-${index}`);
    }

    if (nav.path) {
      void this.router.navigateByUrl(nav.path);
      this.closeMobileSidebar();
    }
  }

  onMenuLinkClick(): void {
    this.closeMobileSidebar();
  }

  onSidebarMouseEnter() {
    if (!this.isExpanded()) {
      this.sidebarService.setHovered(true);
    }
  }

  isSubmenuOpened(section: string, index: number): boolean {
    return this.openSubmenu === `${section}-${index}`;
  }

  isSubmenuActive(nav: NavItem): boolean {
    if (!nav?.subItems?.length) {
      return false;
    }

    return (
      (nav.path ? this.isActive(nav.path) : false) ||
      nav.subItems.some((subItem) => this.isActive(subItem.path))
    );
  }

  onSubmenuClick() {
    this.closeMobileSidebar();
  }

  private setActiveMenuFromRoute(currentUrl: string): void {
    const normalizedUrl = this.normalizeUrl(currentUrl);
    const menuGroups = [{ items: this.navItems, prefix: "main" }];

    menuGroups.forEach((group) => {
      group.items.forEach((nav, i) => {
        if (!nav.subItems?.length) {
          return;
        }

        const shouldOpen =
          (nav.path && this.isRouteMatch(normalizedUrl, nav.path)) ||
          nav.subItems.some((subItem) =>
            this.isRouteMatch(normalizedUrl, subItem.path),
          );

        if (shouldOpen) {
          this.openSubmenuByKey(`${group.prefix}-${i}`);
        }
      });
    });
  }

  private closeMobileSidebar(): void {
    if (this.isMobileOpen()) {
      this.sidebarService.setMobileOpen(false);
    }
  }

  private openSubmenuByKey(key: string): void {
    this.openSubmenu = key;

    setTimeout(() => {
      const el = document.getElementById(key);
      if (el) {
        this.subMenuHeights[key] = el.scrollHeight;
        this.cdr.detectChanges();
      }
    });
  }

  private normalizeUrl(url: string): string {
    return url.split("?")[0].split("#")[0];
  }

  private isRouteMatch(currentUrl: string, path: string): boolean {
    if (!path) {
      return false;
    }

    const normalizedUrl = this.normalizeUrl(currentUrl);

    if (path === "/") {
      return normalizedUrl === "/";
    }

    return normalizedUrl === path || normalizedUrl.startsWith(path + "/");
  }
}
