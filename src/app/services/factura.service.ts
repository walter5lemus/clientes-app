import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Factura } from '../components/facturas/models/factura';
import { Producto } from '../components/facturas/models/producto';
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private urlEndPoint = URL_BACKEND + '/api/facturas';

  constructor(private router: Router, private http: HttpClient) {}

  getFactura(id: number): Observable<Factura> {
    // return this.http.get<Factura>(this.urlEndPoint + '/' + id);
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(term: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${this.urlEndPoint}/filtrar-productos/${term}`
    );
  }

  create(factura: Factura): Observable<Factura>{
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }
}
