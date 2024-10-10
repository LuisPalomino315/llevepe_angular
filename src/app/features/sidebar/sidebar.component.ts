import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { name: 'Inicio', icon: 'home', link: '/home' },
    { name: 'Usuarios', icon: 'user', link: '/user' },
    { name: 'Productos', icon: 'cog', link: '/product' },
    { name: 'Venta', icon: 'shopping-cart', link: '/sale' },
    // Agrega más elementos del menú según sea necesario
  ];

  constructor(private router: Router) { }

  navigate(link: string | undefined) {
    if (link) {
      this.router.navigate([link]);
    } else {
      console.error('Link is undefined');
    }
  }
}