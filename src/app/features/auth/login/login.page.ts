import {
  Component,
  computed,
  inject,
  signal
} from "@angular/core";
import {
  email,
  form,
  FormField,
  minLength,
  required,
  submit,
} from "@angular/forms/signals";
import { RouterModule } from "@angular/router";

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
import { Spinner } from '@primeicons/angular/spinner';

import { MessageService } from "primeng/api";

const baseFormData = {
  email: "",
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
  ],
  templateUrl: "./login.page.html",
})
export class LoginPage {
  private readonly messageService = inject(MessageService);

   mask = signal(true);
  readonly model = signal({ ...baseFormData });

  readonly form = form(this.model, (path) => {
    required(path.email, {
      when: ({ state }) => state.touched(),
      message: "El correo electrónico es requerido",
    });
    email(path.email, {
      message: "Ingresa un correo electrónico válido",
    });
    required(path.password, {
      when: ({ state }) => state.touched(),
      message: "La contraseña es requerida",
    });
    minLength(path.password, 6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  });

  readonly emailInvalid = computed(
    () => this.form.email().touched() && this.form.email().invalid()
  );

  readonly passwordInvalid = computed(
    () => this.form.password().touched() && this.form.password().invalid()
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
      this.messageService.add({
        severity: "success",
        summary: "Acceso validado",
        detail: "Tus credenciales fueron verificadas correctamente.",
        life: 3000,
      });
    }).then(() => {
      this.form().reset();
      this.model.set({ ...baseFormData });
    });
  }
}
