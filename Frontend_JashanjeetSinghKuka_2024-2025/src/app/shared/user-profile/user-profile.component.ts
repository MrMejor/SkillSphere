import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import

@Component({
  selector: 'app-user-profile',
  standalone: true, 
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {}; // Store user info
  profileImage: any = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private popupService: PopupService,
    private userStateService: UseStateService,
    private sanitizer: DomSanitizer
  ) { }
  
  // Add these properties
editingFirstName = false;
editingLastName = false;
editingAddress = false;

get isEditing(): boolean {
  return this.editingFirstName || this.editingLastName || this.editingAddress;
}

toggleEdit(field: string): void {
  switch(field) {
    case 'firstName':
      this.editingFirstName = !this.editingFirstName;
      break;
    case 'lastName':
      this.editingLastName = !this.editingLastName;
      break;
    case 'address':
      this.editingAddress = !this.editingAddress;
      break;
  }
}

// saveChanges(): void {
//   // Call your service to save the updated user info
//   this.userService.updateUserInfo(this.user).subscribe({
//     next: () => {
//       this.editingFirstName = false;
//       this.editingLastName = false;
//       this.editingAddress = false;
//       this.popupService.showMessage('Success', 'Profile updated successfully', 'success');
//     },
//     error: (err) => {
//       console.error('Error updating profile:', err);
//       this.popupService.showMessage('Error', 'Failed to update profile', 'error');
//     }
//   });
  // }
  
  // In your component
saveChanges(): void {
  const updateData = {
    firstName: this.user.firstName,
    lastName: this.user.lastName,
    address: this.user.address
  };

  this.userService.updateUserInfo(updateData).subscribe({
    next: () => {
      this.editingFirstName = false;
      this.editingLastName = false;
      this.editingAddress = false;
      this.popupService.showMessage('Success', 'Profile updated successfully', 'success');
      this.fetchUserDataAndThenLoadPicture();
    },
    error: (err) => {
      console.error('Error updating profile:', err);
      this.popupService.showMessage('Error', 'Failed to update profile', 'error');
    }
  });
}

ngOnInit(): void {
  this.fetchUserDataAndThenLoadPicture();
}

fetchUserDataAndThenLoadPicture() {
  this.userService.getUserData().subscribe(
    (data) => {
      this.user = data;
      console.log('User data fetched:', data);
      this.loadProfilePicture(); // ✅ only call after user is set
    },
    (error) => {
      console.error('Error fetching user data:', error);
    }
  );
}

  loadProfilePicture() {
    if (!this.user?.username) return;
    
    this.userService.getProfilePicture(this.user.username).subscribe({
        next: (blob: Blob) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.profileImage = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
            };
            reader.readAsDataURL(blob);
        },
        error: () => {
            this.profileImage = this.sanitizer.bypassSecurityTrustUrl('assets/default-avatar.png');
        }
    });
}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = (reader.result as string).split(',')[1];
        this.uploadProfilePicture(base64Image);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(base64Image: string): void {
    if (!this.user?.username) {
        console.error('Username is required');
        return;
    }
    
    this.userService.uploadProfilePicture(this.user.username, base64Image)
        .subscribe({
            next: (response) => {
                console.log('Upload successful:', response.message);
                this.loadProfilePicture();
                this.popupService.showMessage('Success', 'Profile picture updated', 'success');
            },
            error: (err) => {
                console.error('Upload failed:', err);
                this.popupService.showMessage('Error', 'Failed to upload profile picture', 'error');
            }
        });
}

  navigateToChangePassword() {
    const userRole = this.userStateService.getRole();
    if (userRole === 'ADMIN') {
      this.router.navigate(['admin/change-password']);
    } else if (userRole === 'STUDENT') {
      this.router.navigate(['student/change-password']);
    } else if (userRole === 'TEACHER') {
      this.router.navigate(['teacher/change-password']);
    } else {
      console.error('Unknown role:', userRole);
      this.popupService.showMessage('Error', 'Unknown user role', 'error');
    }
  }
  
}