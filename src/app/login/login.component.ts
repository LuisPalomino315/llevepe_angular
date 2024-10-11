import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Ajusta la ruta según la ubicación de tu servicio
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  async login() {
    try {
      const response = await lastValueFrom(this.authService.login(this.username, this.password));
      // Maneja la respuesta de la API aquí

      console.log('Login exitoso:', response);
      localStorage.setItem('username', this.username);
      localStorage.setItem('id_usuario', response.id_usuario);
      this.router.navigate(['/home']);
    } catch (error) {
      // Maneja el error de la API aquí
      console.error('Error de login:', error);
      alert('Credenciales incorrectas');
    }
  }
}