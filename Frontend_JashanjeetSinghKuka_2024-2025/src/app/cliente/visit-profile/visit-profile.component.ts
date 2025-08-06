import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';
import { Post } from '../../services/interfaces/auth';

interface PostWithImage extends Post {
  _image: string | null; // Fixed: explicitly include null
  _imageLoaded: boolean;
  _imageError: boolean;
}

@Component({
  selector: 'app-visit-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-profile.component.html',
  styleUrls: ['./visit-profile.component.scss']
})
export class VisitProfileComponent implements OnInit {
  profileUsername: string = '';
  profileImage: SafeUrl | null = null;
  isLoading: boolean = true;
  userPosts: PostWithImage[] = [];
  currentUsername: string | null = null;
  isOwnProfile: boolean = false;
  loadingImages: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private popupService: PopupService,
    private userStateService: UseStateService
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.userStateService.getUsername();
    this.route.params.subscribe(params => {
      this.profileUsername = params['username'];
      this.isOwnProfile = this.currentUsername === this.profileUsername;
      this.loadProfileData();
    });
  }

  loadProfileData(): void {
    this.isLoading = true;
    
    // Load profile image
    this.userService.getProfilePicture(this.profileUsername).subscribe({
      next: (imageBlob: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          this.profileImage = this.sanitizer.bypassSecurityTrustUrl(
            result.startsWith('data:image') ? result : `data:image/jpeg;base64,${result}`
          );
        };
        reader.readAsDataURL(imageBlob);
      },
      error: (err) => {
        console.error('Error loading profile image:', err);
        this.profileImage = null;
      }
    });

    // Load user's posts
    this.postService.getPostsByUser(this.profileUsername).subscribe({
      next: (posts: Post[]) => {
        console.log("Fetched posts:", posts);
        this.userPosts = posts.map(post => ({
          ...post,
  title: (post as any).name,        // map name → title
  content: (post as any).description,
          _image: null, // Now matches the interface
          _imageLoaded: false,
          _imageError: false,
      } as PostWithImage));
        
        this.userPosts.forEach(post => {
          this.loadPostImage(post);
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user posts:', err);
        this.popupService.showMessage('Error', 'Failed to load user posts', 'error');
        this.isLoading = false;
      }
    });
  }

  loadPostImage(post: PostWithImage): void {
    if (post._imageLoaded || this.loadingImages[post.id] || post._imageError) return;
    
    this.loadingImages[post.id] = true;
    
    this.postService.getPostImage(post.id).subscribe({
      next: (image) => {
        if (image) {
          post._image = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;
          post._imageLoaded = true;
        } else {
          post._imageError = true;
        }
        this.loadingImages[post.id] = false;
      },
      error: (err) => {
        console.error('Error loading post image:', err);
        post._imageError = true;
        this.loadingImages[post.id] = false;
      }
    });
  }

  sendMessage(): void {
    this.popupService.showMessage('Info', 'Message feature coming soon!', 'info');
  }
}