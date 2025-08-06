import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SidebarStatusService } from '../../services/status/sidebar-status.service';
import { SettingsStatusService } from '../../services/status/settings-status.service';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/auth/token.service';
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header-backoffice',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './header-backoffice.component.html',
  styleUrls: ['./header-backoffice.component.scss']
})
export class HeaderBackofficeComponent implements OnInit {
  profileImage: SafeUrl | string = 'assets/default-avatar.png';
  isActiveMenuHeader = true;
  searchQuery = '';
  
  // Add type annotation for isActiveItems
  isActiveItems: {
    isActiveNotification: boolean;
    isActiveProfile: boolean;
    [key: string]: boolean; // Add index signature
  } = {
    isActiveNotification: false,
    isActiveProfile: false
  };

  user: any = {
    username: '',
    firstName: '',
    lastName: '',
    role: '',
    profileImage: null
  };

  constructor(
  public sidebarStatusService: SidebarStatusService,
  public settingsStatusService: SettingsStatusService,
  public userService: UserService,
  public router: Router,
  public tokenService: TokenService,
  public userStateService: UseStateService,
  public popupService: PopupService,
    public sanitizer: DomSanitizer,
    private searchService: SearchService
  ) { }

onSearchChange(event: Event) {
  const input = event.target as HTMLInputElement;
  this.searchService.updateSearch(input.value);
}


  ngOnInit(): void {
    this.sidebarStatusService.status$.subscribe((status: boolean) => {
      this.isActiveMenuHeader = status;
    });
  }

  toggleSettings(): void {
    this.settingsStatusService.toggleSettings();
  }

  toggleLogo(): void {
    this.isActiveMenuHeader = !this.isActiveMenuHeader;
    this.sidebarStatusService.changeStatus(this.isActiveMenuHeader);
  }

  toggleItem(option: 'isActiveNotification' | 'isActiveProfile'): void {
    if (this.isActiveItems[option]) {
      this.isActiveItems[option] = false;
    } else {
      Object.keys(this.isActiveItems).forEach((item: keyof typeof this.isActiveItems) => {
        this.isActiveItems[item] = false;
      });
      this.isActiveItems[option] = true;

      if (option === 'isActiveProfile') {
        this.fetchUserData();
      }
    }
  }

  fetchUserData(): void {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.user = data;
        this.loadProfilePicture();
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }

  loadProfilePicture(): void {
    if (!this.user?.username) return;

    this.userService.getProfilePicture(this.user.username).subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.user.profileImage = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
        };
        reader.readAsDataURL(blob);
      },
      error: () => {
        this.user.profileImage = this.sanitizer.bypassSecurityTrustUrl('assets/default-avatar.png');
      }
    });
  }

  closeSession(): void {
    this.popupService.showConfirmationWithActions(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?'
    ).then((confirmed) => {
      if (confirmed) {
        this.popupService.loader('Cerrando sesión', 'Vuelva pronto');
        this.tokenService.removeToken();
        this.userStateService.removeSession();
        
        setTimeout(() => {
          this.popupService.close();
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
  }

  navigateBasedOnRole(basePath: string): void {
    const userRole = this.userStateService.getRole();
    if (!userRole) {
      this.popupService.showMessage('Error', 'No se pudo determinar el rol del usuario', 'error');
      return;
    }

    const routes: Record<string, string> = {
      'ADMIN': `admin/${basePath}`,
      'STUDENT': `student/${basePath}`,
      'TEACHER': `teacher/${basePath}`
    };

    const route = routes[userRole];
    if (route) {
      this.router.navigate([route]);
    } else {
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso`, 'error');
    }
  }

  navigateToAllProduct(): void {
    this.navigateBasedOnRole('skillSphere');
  }

  navigateToCart(): void {
    this.navigateBasedOnRole('cart');
  }

  navigateToAddProduct(): void {
    const userRole = this.userStateService.getRole();
      if (userRole === 'STUDENT') {
    this.popupService.showMessage(
      'Acceso denegado',
       `${userRole} no tiene acceso a esta página.`,
      'warning'
    );
    return;
  }
    this.navigateBasedOnRole('add-post');
  }

  navigateToMiperfil(): void {
    this.navigateBasedOnRole('user-profile');
  }

  navigateToChangePassword(): void {
    this.navigateBasedOnRole('change-password');
  }

  navigateToPurchasedpost(): void {
    this.navigateBasedOnRole('purchased-posts');
  }

  closeProfileDropdown(): void {
    this.isActiveItems.isActiveProfile = false;
  }

  goToControlPanel(): void {
  const role = this.userStateService.getRole();
  if (role === 'ADMIN') {
    this.router.navigate(['/admin/control-panel']);
  } else {
    this.popupService.showMessage('Acceso denegado', 'Tu rol no tiene acceso al Panel de Control.', 'error');
  }
}

}