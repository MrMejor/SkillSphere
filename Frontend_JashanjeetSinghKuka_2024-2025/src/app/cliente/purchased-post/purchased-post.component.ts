import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { UseStateService } from '../../services/auth/use-state.service';
import { UserService } from '../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupService } from '../../services/utils/popup.service';
import { Router } from '@angular/router';
import { PurchaseDto } from '../../services/interfaces/auth';

@Component({
  selector: 'app-purchased-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchased-post.component.html',
  styleUrls: ['./purchased-post.component.scss']
})
export class PurchasedPostsComponent implements OnInit {
  purchasedPosts: any[] = [];
  isLoading: boolean = true;
  currentUsername: string | null = null;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private userStateService: UseStateService,
    private sanitizer: DomSanitizer,
    private popupService: PopupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.userStateService.getUsername();
    this.loadPurchasedPosts();
  }

// Update the loadPurchasedPosts method
loadPurchasedPosts(): void {
  if (!this.currentUsername) {
    this.popupService.showMessage('Error', 'Please login to view purchased posts', 'error');
    this.isLoading = false;
    return;
  }

  this.userService.getPurchasedPosts(this.currentUsername).subscribe({
    next: (posts: PurchaseDto[]) => {
      this.purchasedPosts = posts.map(post => ({
        ...post,
        imageLoaded: false,
        imageError: false,
        image: null  // Initialize image as null
      }));
      
      // Load images for each post
      this.purchasedPosts.forEach(post => this.loadPostImage(post));
      
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading purchased posts:', err);
      this.popupService.showMessage('Error', 'Failed to load purchased posts', 'error');
      this.isLoading = false;
    }
  });
}

  loadPostImage(post: any): void {
    if (post.imageLoaded || post.imageError) return;
    
    this.postService.getPostImage(post.id).subscribe({
      next: (image) => {
        if (image) {
          post.image = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;
          post.imageLoaded = true;
        } else {
          post.imageError = true;
        }
      },
      error: (err) => {
        console.error('Error loading image for post:', post.id, err);
        post.imageError = true;
      }
    });
  }

  viewPost(post: any): void {
    const userRole = this.userStateService.getRole();
    let routePrefix = '';
    
    switch(userRole) {
      case 'STUDENT': routePrefix = 'student'; break;
      case 'ADMIN': routePrefix = 'admin'; break;
      case 'TEACHER': routePrefix = 'teacher'; break;
      default: 
        this.popupService.showMessage('Error', 'Invalid user role', 'error');
        return;
    }
    
    this.router.navigate([`${routePrefix}/ver-productos`, post.id]);
  }


navigateToCatalog(): void {
    const userRole = this.userStateService.getRole();
    let routePrefix = '';
    
    switch(userRole) {
      case 'STUDENT': 
        routePrefix = 'student'; 
        break;
      case 'ADMIN': 
        routePrefix = 'admin'; 
        break;
      case 'TEACHER': 
        routePrefix = 'teacher'; 
        break;
      default: 
        console.error('Invalid user role');
        this.popupService.showMessage('Error', 'Invalid user role', 'error');
        return;
    }
    
    this.router.navigate([`${routePrefix}/skillSphere`]);
}
}

