import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { DirectivasComponent } from './components/directivas/directivas.component';
import { FormComponent } from './components/clientes/form/form.component';
import { DetalleComponent } from './components/clientes/detalle/detalle.component';
import { LoginComponent } from './components/usuarios/login.component';
import { AuthGuard } from './components/usuarios/guards/auth.guard';
import { RoleGuard } from './components/usuarios/guards/role.guard';
import { DetalleFacturaComponent } from './components/facturas/detalle/detalle.component';
import { FacturasComponent } from './components/facturas/facturas.component';


const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  // { path: '**', component: ClientesComponent},
  { path: 'directivas', component: DirectivasComponent},
  { path: 'clientes', component: ClientesComponent},
  { path: 'clientes/page/:page', component: ClientesComponent},
  { path: 'clientes/agregar', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  { path: 'clientes/editar/:id', component: FormComponent , canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  { path: 'login', component: LoginComponent},
  { path: 'facturas/:id', component: DetalleFacturaComponent , canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  { path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
