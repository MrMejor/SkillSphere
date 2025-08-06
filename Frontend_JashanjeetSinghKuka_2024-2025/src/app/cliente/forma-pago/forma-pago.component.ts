import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forma-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import ReactiveFormsModule
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.scss'],
})
export class FormaPagoComponent implements OnInit {
  paymentForm!: FormGroup; // Define the form group

  constructor(private fb: FormBuilder) {} // Inject FormBuilder

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form
  }

  initializeForm() {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]], // 16-digit card number
      cardHolder: ['', [Validators.required]], // Cardholder name
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]], // MM/YY format
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]], // 3-digit CVV
    });
  }

  onSubmit() {
    if (this.paymentForm.invalid) {
      return; // Do not proceed if the form is invalid
    }

    // Handle form submission (e.g., send data to the server)
    console.log('Form submitted:', this.paymentForm.value);
  }
}