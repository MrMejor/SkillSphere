import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CommentInterface, CreateCommentInterface } from '../../app/services/interfaces/auth';
import { TokenService } from './auth/token.service'; 

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;
  private likeUrl = `${environment.apiUrl}/likes`;
  private commentUrl = `${environment.apiUrl}/comments`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Post CRUD Operations
  addPost(post: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, post, { 
      headers: this.getHeaders(),
      responseType: 'text' 
    });
  }

  getPostsByUser(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`, { 
      headers: this.getHeaders() 
    });
  }

  // Updated getPosts to include loggedInUsername if available
  getPosts(loggedInUsername?: string): Observable<any[]> {
    const params: any = {};
    if (loggedInUsername) {
      params.loggedInUsername = loggedInUsername;
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Updated getPostById to include loggedInUsername if available
  getPostById(postId: string, loggedInUsername?: string): Observable<any> {
    const params: any = {};
    if (loggedInUsername) {
      params.loggedInUsername = loggedInUsername;
    }
    return this.http.get<any>(`${this.apiUrl}/${postId}`, { params });
  }

  // New method to get post image separately
  getPostImage(postId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${postId}/image`, { 
      responseType: 'text' 
    }).pipe(
      map(base64 => `data:image/jpeg;base64,${base64}`) // Add prefix for img tags
    );
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`, { 
      headers: this.getHeaders(),
      responseType: 'text' 
    });
  }

  // Like Operations
  toggleLike(postId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.likeUrl}`,
      { postId, username },
      { headers: this.getHeaders() }
    );
  }
  
  getLikeCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.likeUrl}/count/${postId}`);
  }

  checkIfLiked(postId: number, username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.likeUrl}/check/${postId}/${username}`, { 
      headers: this.getHeaders() 
    });
  }

  // Comment Operations
  getComments(postId: number): Observable<CommentInterface[]> {
    return this.http.get<CommentInterface[]>(
      `${this.commentUrl}/post/${postId}`
    );
  }

  addComment(commentData: { postId: number, username: string, text: string }) {
    return this.http.post<Comment>(
      `${this.commentUrl}/add`,
      commentData,
      { headers: this.getHeaders() }
    );
  }

  getTotalPosts(): Observable<number> {
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<number>(`${this.apiUrl}/posts/count`, { headers });
  }

}