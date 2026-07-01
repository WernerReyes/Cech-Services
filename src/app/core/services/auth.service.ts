import { HttpClient } from "@angular/common/http";
import { computed, inject, Service, signal } from "@angular/core";
import { Router } from "@angular/router";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import { ApiResponse } from "@core/models/api.model";
import type {
  AuthCredentials,
  AuthResponse,
  AuthState,
} from "@core/models/auth.model";
import { tap } from "rxjs";

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(APP_CONFIG);

  private readonly TOKEN_KEY = "auth_token";
  private readonly baseUrl = `${this.config.apiUrl}/auth`;

  // 🚦 Estado reactivo usando Signals
  // Inicializa leyendo el localStorage para mantener la sesión al recargar la página
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  // 🔍 Signals públicas expuestas como lectura (Read-Only)
  // Cualquier componente que use esto se repintará automáticamente al cambiar el estado
  readonly currentToken = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  private _authState = signal<AuthState | null>(null);

  public readonly authState = this._authState.asReadonly();

  /**
   * Envía las credenciales al backend para iniciar sesión
   */
  login(credentials: AuthCredentials) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(({ data }) => {
          console.log("Login successful, received token:", data.token);
          // Guardamos el token de forma persistente y reactiva
          this.setSession(data.token);
          // Actualizamos el estado de autenticación
          this._authState.set({
            token: data.token,
            username: data.username,
            rol: data.rol,
            nombreCompleto: data.nombreCompleto,
            tenant: data.tenant,
            client: data.client,
            agencias: data.agencias,
          });
        }),
      );
  }

  /**
   * Cierra la sesión del usuario limpiando estados y redirigiendo
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._authState.set(null); // Limpia el estado de autenticación
    this._token.set(null); // Actualiza la Signal, notificando a toda la app
    this.router.navigate(["/login"]);
  }

  /**
   * Obtiene el token crudo (útil para lógica interna síncrona si se requiere)
   */
  getToken(): string | null {
    return this._token();
  }

  /**
   * Método auxiliar privado para guardar el token
   */
  private setSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token); // Al hacer .set(), el computed 'isAuthenticated' se actualiza solo
  }

  /**
   * Valida el token almacenado contra el backend al iniciar la apap.
   * Retorna una Promesa para que APP_INITIALIZER pueda esperar su resolución.
   */
  verifyAuthentication(): Promise<boolean> {
    const token = this.getToken();

    // Si ni siquiera hay token guardado localmente, no hacemos petición
    if (!token) {
      this.logout(); // Asegura un estado limpio
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      // Llamamos a un endpoint de verificación en tu servidor
      this.http.get<ApiResponse<AuthResponse>>(`${this.baseUrl}/me`).subscribe({
        next: ({ data }) => {
          // console.log("Token verified successfully, user data:", response);
          // El servidor confirma que el token es válido y devuelve datos frescos del usuario
          // this.setSession(response.token);
          this._authState.set(data);
          resolve(true);
        },
        error: () => {
          // Si el token expiró o es inválido, el backend fallará.
          // Nuestro 'errorInterceptor' ya gestionará el logout, aquí solo resolvemos.
          this.logout();
          resolve(false);
        },
      });
    });
  }
}
