import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    const username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire('Logout', `¡${username} se ha cerrado sesión con éxito!`, 'success');
    this.router.navigate(['/login']);
  }
}
