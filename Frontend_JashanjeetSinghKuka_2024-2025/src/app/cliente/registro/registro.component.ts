import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredentialsService } from '../../services/auth/credentials.service';
import { UserInterface } from '../../services/interfaces/auth';
import { Router } from '@angular/router';
import { PopupService } from '../../services/utils/popup.service';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private router: Router,
    private popupService: PopupService
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      roleName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.registerForm.invalid) {
      return;
    }

    // Show loader while processing the request
    this.popupService.loader('Registrando usuario...', 'Espere un momento');

    // Send registration request
    this.credentialsService.register(this.registerForm.value as UserInterface).subscribe({
      next: (data) => {
        this.popupService.close();

        // Show success message
        this.popupService.showMessage(
          'Registro exitoso',
          'El usuario ha sido registrado correctamente.',
          'success'
        );

        // Redirect to login page
        this.router.navigate(['/login'],{
          queryParams: { username: this.registerForm.value.username },
        });
      },
      error: (err) => {
        this.popupService.close();

        // Show error message
        this.popupService.showMessage(
          'Error en el registro',
          err.error || 'Ha ocurrido un error durante el registro.',
          'error'
        );
      },
    });
  }
}