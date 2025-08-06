import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CredentialsService} from '../../services/auth/credentials.service';
import {LoginInterface} from '../../services/interfaces/auth';
import {TokenService} from '../../services/auth/token.service';
import {Router, ActivatedRoute} from '@angular/router';
import {UseStateService} from '../../services/auth/use-state.service';
import {PopupService} from '../../services/utils/popup.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private tokenService: TokenService,
    private router: Router,
    private useStateService: UseStateService,
    private popupService: PopupService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    // Retrieve username from query parameters
    this.route.queryParams.subscribe((params) => {
      if (params['username']) {
        this.loginForm.patchValue({ username: params['username'] });
      }
    });
  }
  
    submit() {
      if (this.loginForm.invalid) {
        return;
      }
  
      this.popupService.loader("Cargando...", "Espere un momento");
  
      this.credentialsService.login(this.loginForm.value as LoginInterface).subscribe({
        next: (data) => {
          this.tokenService.saveTokens(data.token, "234325423423");
          this.useStateService.save(data.username, data.role, data.userId);
  
          // Log saved data
          console.log('Access Token:', this.tokenService.getAccessToken());
          console.log('Username:', this.useStateService.getUsername());
          console.log('Role:', this.useStateService.getRole());
          console.log('User ID:', this.useStateService.getUserId());

          this.popupService.close();
  
          // Redirect based on role
          if (data.role === 'ADMIN') {
            this.router.navigate(['/admin/control-panel']);
          } else if (data.role === 'STUDENT') {
            this.router.navigate(['/student/skillSphere']);
          } else if (data.role === 'TEACHER') {
            this.router.navigate(['/teacher/add-post']);
          }else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.popupService.close();
          let message;
  
          if (err.error == "401") {
            message = "Contraseña incorrecta, inténtelo de nuevo.";
          } else if (err.error == 'User not found') {
            message = 'El usuario no existe. ¿Desea registrarse?';
            this.popupService.showErrorWithActions(
              'Ups, ha ocurrido un error',
              message,
              () => this.router.navigate(['/registro']), // Register callback
              () => { } // Try again callback (do nothing, stay on the same page)
            );
          } else {
            message = err.error;
            this.popupService.showMessage(
              'Ups ha ocurrido un error', message, 'error'
            );
          }
        },
      });
    }
  }
