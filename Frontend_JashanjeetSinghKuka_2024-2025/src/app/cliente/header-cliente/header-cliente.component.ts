import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-cliente',
  imports: [],
  standalone: true,
  templateUrl: './header-cliente.component.html',
  styleUrl: './header-cliente.component.scss'
})
export class HeaderClienteComponent {
  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['/registro']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
