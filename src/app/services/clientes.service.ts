import { Injectable } from '@angular/core';
import { Cliente } from '../components/clientes/cliente';
import { Observable, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Region } from '../components/clientes/region';
import { AuthService } from './auth.service';

import {URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class ClientesServices {
  private urlEndPoint = URL_BACKEND + '/api/clientes';
  /*  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); */

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  /*   private agregarAuthorizationHeader(): HttpHeaders {
    const token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  } */

  /*   private isNoAutorizado(e): boolean {
    if (e.status === 401) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }

      this.router.navigate(['/login']);
      return true;
    }

    if (e.status === 403) {
      Swal.fire(
        'Acceso denegado',
        `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`,
        'warning'
      );
      this.router.navigate(['/clientes']);
      return true;
    }

    return false;
  } */

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      /*       tap((response: any) => {
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombres);
        });
      }), */
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          cliente.nombres = cliente.nombres.toUpperCase();
          cliente.createAt = cliente.createAt;
          /* const datePipe = new DatePipe('sv');
                 cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate'); */
          return cliente;
        });
        return response;
      })
      /* tap((response) => {
        console.log('tap 2');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombres);
        });
      }) */
    );
  }

  cargarCliente(): void {}

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError((e) => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }

        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente)
      .pipe(
        catchError((e) => {
          if (e.status === 400) {
            return throwError(e);
          }

          if (e.error.mensaje) {
            console.log(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  delete(id): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if (e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    /*     let httpHeaders = new HttpHeaders();
    const token = this.authService.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    } */

    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}/upload`,
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(req);
  }
}
