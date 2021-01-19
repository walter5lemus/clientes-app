import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  router: any;
  constructor(private authService: AuthService, private route: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    return next.handle(req).pipe(
      catchError((e) => {
        if (e.status === 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
        if (e.status === 403) {
          Swal.fire(
            'Acceso denegado',
            `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`,
            'warning'
          );
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }
}
