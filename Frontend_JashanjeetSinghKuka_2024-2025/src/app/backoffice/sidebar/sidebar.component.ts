import {Component, OnInit} from '@angular/core';
import {SidebarStatusService} from '../../services/status/sidebar-status.service';
import {UseStateService} from '../../services/auth/use-state.service';
import {PopupService} from '../../services/utils/popup.service';
import {TokenService} from '../../services/auth/token.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  isActiveMenuHeader: boolean = true;
  // isSidebarOpenOnMobile: boolean = false; // New property for mobile toggle
  constructor(
    private sidebarStatusService: SidebarStatusService,
    private tokenService: TokenService,
    private popupService: PopupService,
    private userStateService: UseStateService,
    private router: Router,
    private cartService: CartService,
  )
  {}

  ngOnInit(): void {
    this.sidebarStatusService.status$.subscribe(status => {
      this.isActiveMenuHeader = status;
    })
  }

  closeSession(): void {
    this.popupService
      .showConfirmationWithActions(
        'Cerrar sesión',
        '¿Estás seguro de que deseas cerrar sesión?'
      )
      .then((confirmed) => {
        if (confirmed) {
          // User clicked "Seguro"
          this.popupService.loader('Cerrando sesión', 'Vuelva pronto');
  
          this.tokenService.removeToken();
          this.userStateService.removeSession();
  
          setTimeout(() => {
            this.popupService.close();
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          // User clicked "Cancelar"
          console.log('Session close canceled.'); // Optional: Add a log or other action
        }
      });
  }

  showUserProfile() {
    const userRole = this.userStateService.getRole(); // Get the user's role
  
    if (userRole === 'ADMIN') {
      this.router.navigate(['admin/user-profile']); // Navigate to admin profile
    } else if (userRole === 'STUDENT') {
      this.router.navigate(['client/user-profile']); // Navigate to client profile
    }  else if (userRole === 'TEACHER') {
      this.router.navigate(['seller/user-profile']); // Navigate to client profile
    }else {
      console.error('Unknown role:', userRole); // Handle unknown roles
      this.popupService.showMessage('Error', 'Unknown user role', 'error');
    }
  }

  navigateToChangePassword() {
    const userRole = this.userStateService.getRole(); // Get the user's role
  
    if (userRole === 'ADMIN') {
      this.router.navigate(['admin/change-password']); // Navigate to admin profile
    } else if (userRole === 'STUDENT') {
      this.router.navigate(['client/change-password']); // Navigate to client profile
    }  else if (userRole === 'TEACHER') {
      this.router.navigate(['seller/change-password']); // Navigate to client profile
    }else {
      console.error('Unknown role:', userRole); // Handle unknown roles
      this.popupService.showMessage('Error', 'Unknown user role', 'error');
    }
  }

  navigateToAddProduct() {
    const userRole = this.userStateService.getRole(); // Get the user's role
  
    if (userRole === 'ADMIN') {
      this.router.navigate(['admin/add-post']); // Navigate to admin profile
    }  else if (userRole === 'TEACHER') {
      this.router.navigate(['seller/add-post']); // Navigate to client profile
    } else {
      console.error(userRole," No tiene acceso"); // Handle unknown roles
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso. ` , 'error');
    }
  }

  navigateToAllProduct() {
    const userRole = this.userStateService.getRole();

    if (userRole === 'STUDENT') {
      this.router.navigate(['client/tienda']); // Navigate to admin profile
    }  else if (userRole === 'ADMIN') {
      this.router.navigate(['admin/tienda']); // Navigate to client profile
    }else if (userRole === 'TEACHER') {
      this.router.navigate(['seller/tienda']); // Navigate to client profile
    }else {
      console.error(userRole," No tiene acceso"); // Handle unknown roles
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso. ` , 'error');
    }
  }
  navigateToCart() {
    const userRole = this.userStateService.getRole();

    if (userRole === 'STUDENT') {
      this.router.navigate(['client/cart']); // Navigate to admin profile
    }  else if (userRole === 'ADMIN') {
      this.router.navigate(['admin/cart']); // Navigate to client profile
    }else {
      console.error(userRole," No tiene acceso"); // Handle unknown roles
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso. ` , 'error');
    }
  }
}

