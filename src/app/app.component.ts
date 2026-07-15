

import {
  AfterViewInit,
  Component,
  computed,
  DOCUMENT,
  inject,
  signal
} from "@angular/core";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterModule } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, ToastModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements AfterViewInit {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected isLoading = signal(false);
  protected loadingLogo = computed(() => this.authService.branding()?.logoPequenoUrl || null);

  ngAfterViewInit(): void {
    setTimeout(() => {
      const license = this.document.getElementById("p-license-host");
      if (license) {
        license.remove();
      }
    }, 0);
  }


   ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      } 
      
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading.set(false);
      }
    });
  }
}
