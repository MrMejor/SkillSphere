import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../auth/token.service';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { UseStateService } from '../auth/use-state.service';

// export const authGuard: CanActivateFn = async (route, state) => {
//   const tokenService = inject(TokenService);
//   const userStateService = inject(UseStateService);
//   const router = inject(Router);
//   const http = inject(HttpClient);

//   const accessToken = tokenService.getAccessToken();
//   const refreshToken = tokenService.getRefreshToken();
//   const username = userStateService.getUsername();

//   if (!accessToken) {
//     router.navigate(['/login']);
//     return false;
//   }

//   try {
//     const response: any = await firstValueFrom(
//       http.post(`${environment.apiUrl}/users/check-token`, {
//         username: username,
//         token: accessToken,
//       })
//     );

//     // Redirect based on role
//     const userRole = userStateService.getRole();
//     if (userRole === 'ADMIN') {
//       router.navigate(['/admin']);
//     } else if (userRole === 'CLIENT') {
//       router.navigate(['/client']);
//     }

//     return true;
//   } catch (error) {
//     console.error('Token validation failed', error);
//     router.navigate(['/login']);
//     return false;
//   }
// };


export const authGuard: CanActivateFn = async (route, state) => {
  const tokenService = inject(TokenService);
  const userStateService = inject(UseStateService);
  const router = inject(Router);
  const http = inject(HttpClient);

  const accessToken = tokenService.getAccessToken();
  const username = userStateService.getUsername();

  console.log('AuthGuard - Access Token:', accessToken);
  console.log('AuthGuard - Username:', username);

  if (!accessToken) {
    console.log('No access token, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  try {
    console.log('Validating token with backend...');
    const response: any = await firstValueFrom(
      http.post(`${environment.apiUrl}/users/check-token`, {
        username: username,
        token: accessToken,
      })
    );

    console.log('Token validation successful');
    return true;
  } catch (error) {
    console.error('Token validation failed', error);
    router.navigate(['/login']);
    return false;
  }
};