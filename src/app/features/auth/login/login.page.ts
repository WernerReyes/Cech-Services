import { Component, computed, inject, signal } from "@angular/core";
import {
  form,
  FormField,
  minLength,
  required,
  submit
} from "@angular/forms/signals";
import { Router, RouterModule } from "@angular/router";

import { firstValueFrom } from "rxjs";

import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputPasswordModule } from "primeng/inputpassword";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";

import { Envelope } from "@primeicons/angular/envelope";
import { Eye } from "@primeicons/angular/eye";
import { EyeSlash } from "@primeicons/angular/eye-slash";
import { Lock } from "@primeicons/angular/lock";
import { Spinner } from "@primeicons/angular/spinner";
import { User } from "@primeicons/angular/user";

import { AuthCredentials } from "@core/models/auth.model";
import { AuthService } from "@core/services/auth.service";
import { MessageService } from "primeng/api";

const baseFormData: AuthCredentials = {
  username: "",
  password: "",
};

@Component({
  selector: "app-login-page",
  imports: [
    RouterModule,
    InputPasswordModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    Envelope,
    Eye,
    EyeSlash,
    Lock,
    FormField,
    Spinner,
    User,
  ],
  templateUrl: "./login.page.html",
})
export class LoginPage {
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  mask = signal(true);
  readonly model = signal({ ...baseFormData });

  readonly form = form(this.model, (path) => {
    required(path.username, {
      when: ({ state }) => state.touched(),
      message: "El nombre de usuario es requerido",
    });
    minLength(path.username, 3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    });
    required(path.password, {
      when: ({ state }) => state.touched(),
      message: "La contraseña es requerida",
    });
    minLength(path.password, 6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  });

  readonly usernameInvalid = computed(
    () => this.form.username().touched() && this.form.username().invalid(),
  );

  readonly passwordInvalid = computed(
    () => this.form.password().touched() && this.form.password().invalid(),
  );

  togglePasswordMask() {
    this.mask.update((value) => !value);
  }

  onSignIn(e: Event) {
    e.preventDefault();
    this.form().markAsTouched();

    if (!this.form().valid()) {
      return;
    }

    submit(this.form, async () => {
      const credentials = this.model();
      await firstValueFrom(this.authService.login(credentials));
      this.messageService.add({
        severity: "success",
        summary: "Acceso validado",
        detail: "Tus credenciales fueron verificadas correctamente.",
        life: 3000,
      });

      setTimeout(() => {
      this.router.navigate(["/"]);
      }, 1000);
    })
      .then(() => {
        this.form().reset();
        this.model.set({ ...baseFormData });
      })
      .catch((error) => {
        this.messageService.add({
          severity: "error",
          summary: "Error de autenticación",
          detail:
            error.message || "Ocurrió un error al intentar iniciar sesión.",
          life: 5000,
        });
      });
  }
}
