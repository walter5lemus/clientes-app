import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClientesServices } from '../../../services/clientes.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { FacturaService } from 'src/app/services/factura.service';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo = 'Detalle del cliente';
  fotoSeleccionada: File;
  progreso = 0;

  constructor(
    private clienteService: ClientesServices,
    public modalService: ModalService,
    public authService: AuthService,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {}

  seleccionarFoto(event): void {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);

    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error', 'Debe seleccionar una imagen valida', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(): void {
    if (!this.fotoSeleccionada) {
      Swal.fire('Error al carga', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService
        .subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            const response: any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);

            Swal.fire(
              'La imagen se ha cargado exitosamente',
              response.mensaje,
              'success'
            );
          }
        });
    }
  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void{ 
      Swal.fire({
        title: '¿Está seguro?',
        text: `¿Seguro que desea eliminar la factura ${factura.descripcion}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.facturaService.delete(factura.id).subscribe((response) => {
            this.cliente.factura = this.cliente.factura.filter((cli) => cli !== factura);
            Swal.fire(
              'Factura Eliminada!',
              `Factura ${factura.descripcion} eliminada con éxito`,
              'success'
            );
          });
        }
      });
  }
}
