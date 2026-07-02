import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  computed,
} from "@angular/core";
import { DropdownComponent } from "../../ui/dropdown/dropdown.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DropdownItemTwoComponent } from "../../ui/dropdown/dropdown-item/dropdown-item.component-two";
import { AuthService } from "@app/core/services/auth.service";
import { ButtonModule } from "primeng/button";
import { AvatarModule } from "primeng/avatar";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
  imports: [
    ButtonModule,
    AvatarModule,
    CommonModule,
    RouterModule,
    DropdownComponent,
   
  ],
})
export class UserDropdownComponent {
  protected readonly authService = inject(AuthService);

  protected userData = computed(() => {
    return {
      fullname: this.authService.authState()?.nombreCompleto,
      username: this.authService.authState()?.username,
      letters: this.getLetters(this.authService.authState()?.nombreCompleto || ""),
    };
  });


  getLetters(fullname: string): string {
    if (!fullname) return "";
    const names = fullname.split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (
        names[0].charAt(0).toUpperCase() +
        names[names.length - 1].charAt(0).toUpperCase()
      );
    }
  }

  isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.update((prev) => !prev);
  }

  closeDropdown() {
    this.isOpen.update(() => false);
  }
}
