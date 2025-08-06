import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  showMessage(title: string, message: string,
              icon: 'success' | 'warning' | 'error' | 'info' | 'question' = 'info'): void {
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
      confirmButtonText: "Cerrar notificación"
    })
  }

  loader(title: string = "Cargando...", message: string = ''): void {
    Swal.fire({
      title: title,
      text: message,
      allowEscapeKey: false,
      didOpen() {
        Swal.showLoading(null);
      }
    })
  }

  async showConfirmation(
    title: string, message: string, confirmButtonText: string = "Aceptar", cancelButtonText: string = "Cancelar",
  ): Promise<boolean> {

    const result = await Swal.fire({
      title: title,
      text: message,
      icon: "question",
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    })

    return result.isConfirmed;
  }

  close(): void {
    Swal.close()
  }

    showErrorWithActions(
      title: string,
      message: string,
      registerCallback: () => void,
      tryAgainCallback: () => void
    ): void {
      Swal.fire({
        title: title,
        text: message,
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Registrar nuevo perfil',
        cancelButtonText: 'Intentar de nuevo',
      }).then((result) => {
        if (result.isConfirmed) {
          registerCallback(); // Call the register callback
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          tryAgainCallback(); // Call the try again callback
        }
      });
  }
    // New method to show a confirmation popup with two buttons
    showConfirmationWithActions(
      title: string,
      message: string,
      confirmButtonText: string = 'Seguro',
      cancelButtonText: string = 'Cancelar'
    ): Promise<boolean> {
      return Swal.fire({
        title: title,
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
      }).then((result) => {
        return result.isConfirmed; // Returns true if "Seguro" is clicked, false if "Cancelar" is clicked
      });
  }

  showLoading(message: string) {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }

  hideLoading() {
    Swal.close();
  }
}
