import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-post-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-post-modal.component.html',
  styleUrls: ['./add-post-modal.component.scss']
})
export class AddPostModalComponent implements OnInit {
  postForm!: FormGroup;
  username: string | null = null;
  isFree: boolean = true; // Default to free post

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    public activeModal: NgbActiveModal,
    private useStateService: UseStateService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.username = this.useStateService.getUsername();
    if (!this.username) {
      console.error('Username not found in session storage.');
      return;
    }
    this.initializeForm();
  }

  initializeForm() {
    this.postForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      price: [{value: null, disabled: true}],
      currency: [{value: null, disabled: true}],
      username: [this.username, Validators.required]
    });
  }

  togglePricing() {
    this.isFree = !this.isFree;
    if (this.isFree) {
      this.postForm.get('price')?.disable();
      this.postForm.get('currency')?.disable();
      this.postForm.patchValue({
        price: null,
        currency: null
      });
    } else {
      this.postForm.get('price')?.enable();
      this.postForm.get('currency')?.enable();
      this.postForm.get('price')?.setValidators([Validators.required, Validators.min(0)]);
      this.postForm.get('currency')?.setValidators([Validators.required]);
    }
    this.postForm.get('price')?.updateValueAndValidity();
    this.postForm.get('currency')?.updateValueAndValidity();
  }

  submit() {
    if (this.postForm.invalid) return;
    
    const postData = this.postForm.value;
    
    // Ensure price/currency are null for free posts
    if (this.isFree) {
      postData.price = null;
      postData.currency = null;
    }

    this.popupService.loader("Guardando producto...", "Espere un momento");
  
    this.postService.addPost(postData).subscribe({
      next: (response) => {
        this.popupService.close();
        this.popupService.showMessage('Éxito', 'Producto agregado exitosamente', 'success');
        this.activeModal.close('refresh');
        setTimeout(() => this.activeModal.close(postData), 2000);
      },
      error: (error) => {
        this.popupService.close();
        let message = this.getErrorMessage(error.status);
        this.popupService.showMessage('Error', message, 'error');
      }
    });
  }

  private getErrorMessage(status: number): string {
    switch(status) {
      case 401: return "No autorizado. Por favor, inicie sesión nuevamente.";
      case 400: return "Datos inválidos. Revise los campos e inténtelo de nuevo.";
      default: return "Ocurrió un error inesperado. Inténtelo de nuevo más tarde.";
    }
  }

  dismiss() {
    this.activeModal.dismiss('Closed without saving');
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64 = (reader.result as string).split(',')[1]; // remove "data:image/png;base64,..."
  //       this.postForm.patchValue({ image: base64 });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // onFileChange(event: Event): void {
  //   const target = event.target as HTMLInputElement;
  //   if (target.files && target.files.length > 0) {
  //     const file = target.files[0];
  //     const reader = new FileReader();
  
  //     reader.onload = () => {
  //       // const base64 = (reader.result as string).split(',')[1]; // remove "data:image/png;base64,"
  //       // this.postForm.patchValue({ image: base64 });
  //       const rawBase64 = (reader.result as string).split(',')[1];
  //       const cleanBase64 = rawBase64.replace(/\s/g, '').replace(/\r?\n|\r/g, '');
  //       this.postForm.patchValue({ image: cleanBase64 });
  //     };
  
  //     reader.readAsDataURL(file);
  //   }
  // }
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
        const file = target.files[0];
        
        // Validate file type/size if needed
        if (!file.type.match('image.*')) {
            this.popupService.showMessage('Error', 'Solo se permiten imágenes', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.popupService.showMessage('Error', 'La imagen debe ser menor a 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            this.postForm.patchValue({ 
                image: result.split(',')[1] 
            });
        };
        reader.readAsDataURL(file);
    }
}
}