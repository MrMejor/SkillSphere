import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.scss']
})
export class VerProductosComponent implements OnInit {
  product: any = {};
  isLoading: boolean = true;
  error: string | null = null;
  loadingImage: boolean = false;
  imageError: boolean = false;
  currencyMap: { [key: string]: string } = {
    "USD": '$',
    "EUR": '€'
  };
  comments: any[] = [];
showComments: boolean = false;
newComment: string = '';
currentUsername: string | null = null;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private userStateService: UseStateService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.userStateService.getUsername();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProductDetails(id);
    } else {
      this.error = 'Invalid product ID';
      this.isLoading = false;
    }
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
    if (this.showComments && this.comments.length === 0) {
      this.postService.getComments(this.product.id).subscribe({
        next: (comments) => this.comments = comments,
        error: (err) => {
          console.error('Error loading comments:', err);
          this.popupService.showMessage('Error', 'Failed to load comments', 'error');
        }
      });
    }
  }
  
  addComment(): void {
    if (!this.currentUsername) {
      this.popupService.showMessage('Error', 'Please login to comment', 'error');
      return;
    }
  
    if (this.newComment.trim()) {
      const commentData = {
        text: this.newComment,
        postId: this.product.id,
        username: this.currentUsername
      };
  
      this.postService.addComment(commentData).subscribe({
        next: (savedComment) => {
          this.comments.push(savedComment);
          this.newComment = '';
        },
        error: (err) => {
          console.error('Error adding comment:', err);
          this.popupService.showMessage('Error', 'Failed to add comment', 'error');
        }
      });
    }
  }  

  fetchProductDetails(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.postService.getPostById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loadProductImage(id);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch product details. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching product:', err);
      }
    });
  }

  loadProductImage(postId: string): void {
    this.loadingImage = true;
    this.imageError = false;
    
    this.postService.getPostImage(+postId).subscribe({
      next: (image) => {
        if (image) {
          // Ensure the Base64 string is properly formatted
          this.product.image = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;
        } else {
          console.warn('Empty image response for post', postId);
          this.imageError = true;
        }
        this.loadingImage = false;
      },
      error: (err) => {
        console.error('Error loading image:', err);
        this.product.image = null;
        this.imageError = true;
        this.loadingImage = false;
      }
    });
  }

  handleImageError(): void {
    this.product.image = null;
    this.imageError = true;
  }

  navigateToAllPost(): void {
    const userRole = this.userStateService.getRole();
    let routePrefix = '';
    
    switch(userRole) {
      case 'STUDENT': routePrefix = 'student'; break;
      case 'ADMIN': routePrefix = 'admin'; break;
      case 'TEACHER': routePrefix = 'teacher'; break;
      default: 
        console.error('Invalid user role');
        this.popupService.showMessage('Error', 'Invalid user role', 'error');
        return;
    }
    
    this.router.navigate([`${routePrefix}/skillSphere`]);
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    this.popupService.showMessage('Added to Cart', `${product.name} added to your cart`, 'success');
  }
}

