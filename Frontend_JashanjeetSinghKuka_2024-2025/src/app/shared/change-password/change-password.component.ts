import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../services/utils/popup.service';
import { TokenService } from '../../services/auth/token.service';
import { UseStateService } from '../../services/auth/use-state.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private popupService: PopupService,
    private tokenService: TokenService, // Inject TokenService
    private userStateService: UseStateService // Inject UseStateService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if new password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }
  
    const { oldPassword, newPassword } = this.changePasswordForm.value;
  
    // Show loader while processing
    this.popupService.loader('Cambiando contraseña', 'Espere un momento...');
  
    // Call the backend API to change the password
    this.http
      .post(`${environment.apiUrl}/users/change-password`, { oldPassword, newPassword })
      .subscribe({
        next: (response) => {
          this.popupService.close(); // Close the loader
  
          // Show success message
          this.popupService.showMessage(
            'Éxito', 
            'Contraseña cambiada exitosamente. Serás redirigido para iniciar sesión nuevamente.', 
            'success'
          );
  
          // Log out the user after a short delay
          setTimeout(() => {
            this.tokenService.removeToken(); // Delete the token
            this.userStateService.removeSession(); // Clear the session
            this.router.navigate(['/login']); // Redirect to login page
          }, 3000); // 3-second delay before logging out
        },
        error: (err) => {
          this.popupService.close(); // Close the loader
          console.error('Error cambiando la contraseña:', err);
          this.popupService.showMessage(
            'Error', 
            'Error cambiando la contraseña. Inténtalo de nuevo.', 
            'error'
          );
        },
      });
  }

}