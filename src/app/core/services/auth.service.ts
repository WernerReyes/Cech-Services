import { HttpClient } from "@angular/common/http";
import { computed, inject, Service, signal } from "@angular/core";
import { Router } from "@angular/router";
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { APP_CONFIG } from "@core/config/app.config.tokens";
import { ApiResponse } from "@core/models/api.model";
import type {
  AuthCredentials,
  AuthResponse,
  AuthState,
} from "@core/models/auth.model";
import { tap } from "rxjs";
import { BrandingService } from "./branding.service";

@Service()
export class AuthService {
  private readonly brandingService = inject(BrandingService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly config = inject(APP_CONFIG);

  public readonly TOKEN_KEY = "auth_token";
  private readonly baseUrl = `${this.config.apiUrl}/auth`;

  
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _authState = signal<AuthState | null>(null);


  public readonly currentToken = this._token.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());
  public readonly authState = this._authState.asReadonly();
  public readonly decodeToken = computed<JwtPayload | null>(() => {
    const token = this._token();
    return token ? jwtDecode(token) : null;
  });

 
  login(credentials: AuthCredentials) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(({ data }) => {
          const primaryColor = "#EC111A"; // Color por defecto si no hay usuario
          this.brandingService.applyTenantColor(primaryColor);
       
          this.setSession(data.token);
          
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

  
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._authState.set(null);
    this._token.set(null);
    this.router.navigate(["/login"]);
    this.brandingService.applyTenantColor(); // Color por defecto si no hay usuario
  }

 
  getToken(): string | null {
    return this._token();
  }


  private setSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);
  }

  verifyAuthentication(): Promise<AuthResponse | null> {
    const token = this.getToken();

    if (!token) {
      this.logout();
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      this.http.get<ApiResponse<AuthResponse>>(`${this.baseUrl}/me`).subscribe({
        next: ({ data }) => {
          this._authState.set(data);
          resolve(data);
        },
        error: () => {
       
          this.logout();
          resolve(null);
        },
      });
    });
  }
}
