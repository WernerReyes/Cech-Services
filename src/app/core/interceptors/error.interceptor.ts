import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

interface ApiErrorPayload {
  message?: string;
}

function getBackendMessage(error: HttpErrorResponse): string | null {
  const payload = error.error as ApiErrorPayload | string | null;

  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (
    payload &&
    typeof payload === 'object' &&
    typeof payload.message === 'string' &&
    payload.message.trim()
  ) {
    return payload.message;
  }

  return null;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  


  // Pasamos la petición al siguiente paso y escuchamos el flujo de respuesta
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // 🌐 Error del lado del cliente o problemas de red
        errorMessage = `Error de red: ${error.error.message}`;
      } else {
        // 🖥️ El backend devolvió un código de respuesta fallido (4xx, 5xx)
        errorMessage = `Código de error ${error.status}: ${error.message}`;

        const backendMessage = getBackendMessage(error);

        switch (error.status) {
          case 400:
            errorMessage = backendMessage ?? 'Solicitud invalida.';
            break;

          case 401: // Unauthorized (No autorizado o Token expirado)
            // Ejecuta el logout automático: limpia localStorage, resetea el Signal y redirige a /login
            authService.logout();
            errorMessage = 'Sesión expirada o inválida. Por favor, inicia sesión de nuevo.';
            break;

          case 403: // Forbidden (No tienes permisos)
            errorMessage = 'No tienes permisos para acceder a este recurso.';
            break;

          case 404: // Not Found
            errorMessage = 'El recurso solicitado no fue encontrado.';
            break;

          case 500: // Internal Server Error
            errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
            break;
        }
      }

     

      // Reenviamos el error encapsulado para que el componente/servicio que hizo la llamada pueda manejarlo si quiere
      return throwError(() => {
        return new HttpErrorResponse({
          error: errorMessage,
          headers: error.headers,
          status: error.status,
          statusText: error.statusText
        });
      });
    })
  );
};
