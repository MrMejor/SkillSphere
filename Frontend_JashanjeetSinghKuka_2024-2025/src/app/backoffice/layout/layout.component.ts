import { Component, OnInit } from '@angular/core';
import { HeaderBackofficeComponent } from '../header-backoffice/header-backoffice.component';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarStatusService } from '../../services/status/sidebar-status.service';
import { NgStyle } from '@angular/common';
import { CartComponent } from '../../cliente/cart/cart.component';
import { CartService } from '../../services/cart.service'; 

@Component({
  selector: 'app-layout',
  imports: [
    HeaderBackofficeComponent,
    RouterOutlet,
    SidebarComponent,
    NgStyle,

  ],
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutBackComponent implements OnInit {

  isActiveSidebar: boolean = true;
  isMobile: boolean = false; // Track if the screen is mobile size

  constructor(
    private sidebarStatusService: SidebarStatusService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.sidebarStatusService.status$.subscribe(valorProcedenteDelHeader => {
      this.isActiveSidebar = valorProcedenteDelHeader;
    });

    // Check if the screen is mobile size
    this.checkMobileSize();
    window.addEventListener('resize', () => this.checkMobileSize());
  }

  // Check if the screen is mobile size
  checkMobileSize(): void {
    this.isMobile = window.innerWidth <= 991.98; // Bootstrap's lg breakpoint
  }
  
  toggleCart() {
    this.cartService.toggleCart(); // Toggle cart visibility
  }
}