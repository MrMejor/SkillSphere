import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UseStateService } from '../auth/use-state.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private useStateService: UseStateService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role']; // Get the required role from the route data
    const userRole = this.useStateService.getRole(); // Get the user's role

    if (userRole === requiredRole) {
      return true; // Allow access
    } else {
      // Redirect to a "no access" page or show a popup
      this.router.navigate(['/no-access']);
      return false; // Deny access
    }
  }
}