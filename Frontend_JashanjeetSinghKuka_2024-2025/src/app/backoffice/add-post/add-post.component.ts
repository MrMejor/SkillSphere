import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPostModalComponent } from '../add-post-modal/add-post-modal.component';
import { PostService } from '../../services/post.service';
import { UseStateService } from '../../services/auth/use-state.service';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../services/utils/popup.service';
import { Post } from '../../services/interfaces/auth';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {
  existingPosts: any[] = [];
  loadingImages: { [key: number]: boolean } = {};
  currencyMap: { [key: string]: string } = {
    USD: 'USD',
    EUR: 'EUR',
  };
  currentUsername: string | null = null;

  constructor(
    private modalService: NgbModal,
    private postService: PostService,
    private useStateService: UseStateService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.useStateService.getUsername();
    this.fetchExistingPosts();
  }

  openAddPostModal() {
    const modalRef = this.modalService.open(AddPostModalComponent, { centered: true });
    modalRef.closed.subscribe((result) => {
      if (result === 'refresh') {
        this.fetchExistingPosts();
      }
    });
  }

  fetchExistingPosts(): void {
    if (!this.currentUsername) return;
    
    // this.postService.getPosts(this.currentUsername).subscribe({
      this.postService.getPostsByUser(this.currentUsername!).subscribe({

      next: (data) => {
        // this.existingPosts = data.map(post => ({
          this.existingPosts = data.map((post: Post) => ({
          ...post,
          imageLoaded: false,
          imageError: false,
          image: null
        }));

        this.existingPosts.forEach(post => {
          this.loadImage(post.id);
        });
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.popupService.showMessage('Error', 'Failed to load posts', 'error');
      }
    });
  }

  loadImage(postId: number): void {
    const post = this.existingPosts.find(p => p.id === postId);
    if (!post || post.imageLoaded || this.loadingImages[postId] || post.imageError) return;

    this.loadingImages[postId] = true;

    this.postService.getPostImage(postId).subscribe({
      next: (image) => {
        if (image) {
          post.image = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;
          post.imageLoaded = true;
        } else {
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

  deletePostWithConfirmation(postId: number): void {
    this.popupService
      .showConfirmationWithActions(
        'Eliminar post',
        '¿Estás seguro de que deseas eliminar este post?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.popupService.loader('Eliminando post', 'Por favor espera...');
  
          // Convert number to string before sending to service
          this.postService.deletePost(postId.toString()).subscribe(
            (response) => {
              console.log('Post deleted:', response);
              this.popupService.close();
              this.popupService.showMessage('Éxito', 'Post eliminado correctamente', 'success');
              this.fetchExistingPosts();
            },
            (error) => {
              console.error('Error deleting post:', error);
              this.popupService.close();
              this.popupService.showMessage('Error', 'No se pudo eliminar el post.', 'error');
            }
          );
        } else {
          console.log('Post deletion canceled.');
        }
      });
  }
  
}
