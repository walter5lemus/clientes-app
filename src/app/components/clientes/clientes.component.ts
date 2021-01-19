import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClientesServices } from '../../services/clientes.service';
import Swal from 'sweetalert2';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { URL_BACKEND } from '../../config/config';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  urlBackend = URL_BACKEND;

  constructor(
    private clienteService: ClientesServices,
    public modalService: ModalService,
    private activatedRouter: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }

      this.clienteService
        .getClientes(page)
        .pipe
        /* tap((response) => {
            this.clientes = response.content;
          }) */
        ()
        .subscribe((response) => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });

    this.modalService.notificarUpload.subscribe((cliente) => {
      this.clientes = this.clientes.map((clienteOriginal) => {
        if (cliente.id === clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe((response) => {
          this.clientes = this.clientes.filter((cli) => cli !== cliente);
          Swal.fire(
            '¡Cliente Eliminado!',
            `Cliente ${cliente.nombre} eliminado con éxito`,
            'success'
          );
        });
      }
    });
  }

  abrirModal(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
