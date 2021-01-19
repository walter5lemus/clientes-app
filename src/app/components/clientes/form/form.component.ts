import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClientesServices } from '../../../services/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from '../region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  cliente = new Cliente();
  regiones: Region[];
  titulo = 'Agregar Cliente';

  errores: string[];

  constructor(private clienteService: ClientesServices,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
                this.cargarCliente();
              }

  ngOnInit(): void {
  }

  cargarCliente(): any{
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id){
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente);
        }
    });
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones );
  }

  create(): void{
    this.clienteService.create(this.cliente)
    .subscribe( json => {
      console.log(json);
      this.router.navigate(['/clientes']);
      Swal.fire('Nuevo cliente', `El cliente  ${json.nombres} ha sido creado con éxito` , 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error(err.error.errors);
      }
    );
  }

  update(): void{
    this.cliente.factura = null;
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes']);
        Swal.fire('Cliente actualizado', `${json.mensaje}: ${json.cliente.nombres}`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error(err.error.errors);
      }
    );
  }

  compararRegion(o1: Region, o2: Region): boolean{
    if (o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null ? false : o1.id === o2.id;
  }

}
