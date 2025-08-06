import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { CommentInterface } from "../../services/interfaces/auth";
import { HeaderBackofficeComponent } from '../../backoffice/header-backoffice/header-backoffice.component';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-skillSphere',
  imports: [CommonModule, FormsModule, HeaderBackofficeComponent],
  standalone: true,
  templateUrl: './skillSphere.component.html',
  styleUrl: './skillSphere.component.scss'
})
export class SkillSphereComponent implements OnInit {
  user: any = {};
  posts: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  currencyMap: { [key: string]: string } = {
    "USD": '$',
    "EUR": '€'
  };
  loadingImages: { [key: number]: boolean } = {};
  currentUsername: string | null = null;
  allPosts: any[] = []; // keep original list
  searchQuery: string = '';

  constructor(
    private postService: PostService,
    private router: Router,
    private cartService: CartService,
    private userStateService: UseStateService,
    private popupService: PopupService,
        private userService: UserService,
    private sanitizer: DomSanitizer, 
  private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.userStateService.getUsername();
    this.loadUserProfile();
    this.fetchPosts();
      this.searchService.search$.subscribe(query => {
    this.filterPosts(query);
  });
}
  

fetchPosts(): void {
  this.isLoading = true;
  this.error = null;

    if (!this.currentUsername) {
    this.error = 'No username found. Please login.';
    this.isLoading = false;
    return;
  }

  this.postService.getPosts(this.currentUsername).subscribe({
    next: (data) => {
      this.posts = data.map(post => ({
        ...post,
        likes: 0,
        isLiked: false,
        showComments: false,
        comments: post.comments || [],
        newComment: '',
        imageLoaded: false,
        imageError: false,
        hasImage: post.image !== undefined && post.image !== null,
        profileImage: null // Add placeholder
      }));

      this.allPosts = [...this.posts];

      this.posts.forEach(post => {
        this.loadImage(post.id);

        // Fetch like count
        this.postService.getLikeCount(post.id).subscribe({
          next: (count) => post.likes = count,
          error: (err) => {
            console.error(`Failed to fetch like count for post ${post.id}`, err);
            post.likes = 0;
          }
        });

        // 🔥 Fetch profile image for each sellerUsername
this.userService.getProfilePicture(post.sellerUsername).subscribe({
  next: (imageBlob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      post.profileImage = result.startsWith('data:image')
        ? result
        : `data:image/jpeg;base64,${result}`;
    };
    reader.onerror = () => {
      console.error(`Failed to convert blob to data URL for ${post.sellerUsername}`);
    };
    reader.readAsDataURL(imageBlob);
  },
  error: (err) => {
    console.error(`Failed to load profile image for ${post.sellerUsername}`, err);
  }
});
 }); 

      if (this.currentUsername) {
        this.checkLikesStatus();
      }

      this.isLoading = false;
    },
    error: (err) => {
      this.error = 'Failed to fetch posts. Please try again later.';
      this.isLoading = false;
      console.error('Error fetching posts:', err);
    }
  });
}

  

  private checkLikesStatus(): void {
    this.posts.forEach(post => {
      this.postService.checkIfLiked(post.id, this.currentUsername!).subscribe({
        next: (isLiked) => post.isLiked = isLiked,
        error: (err) => console.error(`Error checking like status:`, err)
      });
    });
  }

filterPosts(query: string): void {
  if (!query || query.trim() === '') {
    this.posts = [...this.allPosts];
    return;
  }

  const searchTerm = query.toLowerCase().trim();
  this.posts = this.allPosts.filter(post => 
    (post.name && post.name.toLowerCase().includes(searchTerm)) ||
    (post.description && post.description.toLowerCase().includes(searchTerm)) ||
    (post.sellerUsername && post.sellerUsername.toLowerCase().includes(searchTerm))
  );
}

  loadImage(postId: number): void {
    console.log('Loading image for post:', postId);
    const post = this.posts.find(p => p.id === postId);
    if (!post || post.imageLoaded || this.loadingImages[postId] || post.imageError) return;
  
    this.loadingImages[postId] = true;
    
    this.postService.getPostImage(postId).subscribe({
      next: (image) => {
        if (image) {
          // Ensure the Base64 string is properly formatted
          post.image = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;
          post.imageLoaded = true;
        } else {
          console.warn('Empty image response for post', postId);
          post.imageError = true;
        }
        this.loadingImages[postId] = false;
      },
      error: (err) => {
        console.error('Error loading image:', err);
        post.image = null;
        post.imageError = true;
        this.loadingImages[postId] = false;
      }
    });
  }

  toggleLike(post: any): void {
    if (!this.currentUsername) {
      this.popupService.showMessage('Error', 'Please login to like posts', 'error');
      return;
    }

    this.postService.toggleLike(post.id, this.currentUsername).subscribe({
      next: () => {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      },
      error: (err) => {
        console.error('Error toggling like:', err);
        this.popupService.showMessage('Error', 'Failed to update like', 'error');
      }
    });
  }
  
toggleComments(post: any): void {
  post.showComments = !post.showComments;

  if (post.showComments && post.comments.length === 0) {
    this.postService.getComments(post.id).subscribe({
      next: (comments) => {
        post.comments = comments.map(comment => ({
          ...comment,
          profileImage: null // Placeholder
        }));

        // Now fetch profile pictures
        post.comments?.forEach((comment: CommentInterface) => {
          this.userService.getProfilePicture(comment.username).subscribe({
            next: (blob: Blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result as string;
                comment.profileImage = result.startsWith('data:image')
                  ? result
                  : `data:image/jpeg;base64,${result}`;
              };
              reader.onerror = () => {
                console.error(`Error reading image for ${comment.username}`);
              };
              reader.readAsDataURL(blob);
            },
            error: (err) => {
              console.error(`Error loading profile picture for ${comment.username}`, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.popupService.showMessage('Error', 'Failed to load comments', 'error');
      }
    });
  }
}


  addComment(post: any, commentText: string): void {
    if (!this.currentUsername) {
      this.popupService.showMessage('Error', 'Please login to comment', 'error');
      return;
    }
  
    if (commentText.trim()) {
      const commentData = {
        text: commentText,
        postId: post.id,
        username: this.currentUsername
      };
  
      this.postService.addComment(commentData).subscribe({
        next: (newComment) => {
          post.comments.unshift(newComment);
          post.newComment = '';
          post.commentCount = (post.commentCount || 0) + 1;
        },
        error: (err) => {
          console.error('Error adding comment:', err);
          this.popupService.showMessage('Error', 'Failed to add comment', 'error');
        }
      });
    }
  }

  viewPost(post: any): void {
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
    
    this.router.navigate([`${routePrefix}/ver-productos`, post.id]);
  }

addToCart(post: any): void {
  if (!this.currentUsername) {
    this.popupService.showMessage('Error', 'Please login to add to cart', 'error');
    return;
  }

  this.userService.checkIfPurchased(this.currentUsername, post.id).subscribe({
    next: (alreadyPurchased) => {
      if (alreadyPurchased) {
        this.popupService.showMessage('Info', 'You already purchased this course', 'info');
      } else {
        this.cartService.addToCart(post);
        this.popupService.showMessage('Success', `${post.name} added to cart`, 'success');
      }
    },
    error: (err) => {
      console.error('Purchase check error:', err);
      this.popupService.showMessage('Error', 
        err.status === 401 ? 'Please login' : 'Failed to verify purchase', 
        'error');
    }
  });
}


  handleImageError(post: any): void {
    // console.error('Image load error for post:', post.id);
    post.image = null; 
    post.imageError = true; 
  }

  // In your component class
logIntersection(postId: number): void {
  // console.log('Intersection observed for post', postId);
  this.loadImage(postId);
  }
  
loadUserProfile(): void {
  const username = this.userStateService.getUsername();
  if (!username) return;

  this.user.username = username;

  this.userService.getProfilePicture(username).subscribe({
    next: (response) => {
      const imageUrl = URL.createObjectURL(response);
      this.user.profileImage = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    },
    error: () => {
      this.user.profileImage = null;
    }
  });
}

  visitProfile(username: string): void {
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
  
  this.router.navigate([`${routePrefix}/profile`, username]);
}

}