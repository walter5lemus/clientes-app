import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from './usuario';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  titulo = 'Por favor Sing In!';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      console.log("entro al login");
      Swal.fire(
        'Login',
        `Hola ${this.authService.usuario.username} ya estas autenticado`,
        'info'
      );
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error Login', 'Username o password vacias!', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(
      (response) => {
        console.log(response);

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        this.router.navigate(['/clientes']);
        const usuario = this.authService.usuario;
        Swal.fire(
          'Login',
          'Hola ' + usuario.username + '  has iniciado sesión con éxito',
          'success'
        );
      },
      (err) => {
        if (err.status === 400) {
          Swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
        }
      }
    );
  }
}
