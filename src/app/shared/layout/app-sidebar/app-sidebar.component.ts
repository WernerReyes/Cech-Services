import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, effect, inject } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { SidebarService } from "../../services/sidebar.service";

import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith } from "rxjs";

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

  // Main nav items
  navItems: NavItem[] = [
    {
      icon: "pi-th-large",
      name: "Dashboard",
      path: "/",
      // subItems: [{ name: "Ecommerce", path: "/" }],
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
      icon: `pi-ticket`,
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

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};

  readonly isExpanded = this.sidebarService.isExpanded;
  readonly isMobileOpen = this.sidebarService.isMobileOpen;
  readonly isHovered = this.sidebarService.isHovered;

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split("?")[0].split("#")[0]),
      startWith(this.router.url.split("?")[0].split("#")[0]),
    ),
    { initialValue: this.router.url.split("?")[0].split("#")[0] },
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
    const currentUrl = this.currentUrl();

    if (!path) {
      return false;
    }

    // Dashboard: solo activo cuando la ruta es exactamente "/"
    if (path === "/") {
      return currentUrl === "/";
    }

    // Otras rutas: activo si coincide exactamente o si está dentro de una ruta hija
    return currentUrl === path || currentUrl.startsWith(path + "/");
  }

  isExactActive(path: string): boolean {
    const currentUrl = this.currentUrl();

    return !!path && currentUrl === path;
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges(); // Ensure UI updates
        }
      });
    }
  }

  onSidebarMouseEnter() {
    if (!this.isExpanded()) {
      this.sidebarService.setHovered(true);
    }
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups = [{ items: this.navItems, prefix: "main" }];

    menuGroups.forEach((group) => {
      group.items.forEach((nav, i) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (currentUrl === subItem.path) {
              const key = `${group.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges(); // Ensure UI updates
                }
              });
            }
          });
        }
      });
    });
  }

  isSubmenuOpened(section: string, index: number): boolean {
    return this.openSubmenu === `${section}-${index}`;
  }

  isSubmenuActive(nav: any): boolean {
    if (!nav?.subItems?.length) {
      return false;
    }

    return nav.subItems.some((subItem: any) => this.isExactActive(subItem.path));
  }

  onSubmenuClick() {
    if (this.isMobileOpen()) {
      this.sidebarService.setMobileOpen(false);
    }
  }
}
