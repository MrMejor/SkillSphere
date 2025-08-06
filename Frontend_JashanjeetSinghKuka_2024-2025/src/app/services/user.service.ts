import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './auth/token.service';
import { map } from 'rxjs/operators';
import { UserPostSummary } from '../services/interfaces/auth'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // Replace with your API endpoint

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  // Method to fetch user data
  getUserData(): Observable<any> {
    const token = this.tokenService.getAccessToken(); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 

    return this.http.get<any>(`${this.apiUrl}/profile`, { headers });
  }

  uploadProfilePicture(username: string, base64Image: string): Observable<{message: string}> {
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'text/plain');
    
    return this.http.post<{message: string}>(
        `${this.apiUrl}/${username}/profile-picture`,
        base64Image,
        { headers }
    );
}
  
  getProfilePicture(username: string): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/${username}/profile-picture`, {
      responseType: 'blob'
  });
}
  
  // In user.service.ts
  updateUserInfo(userData: any): Observable<any> {
  const token = this.tokenService.getAccessToken();
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  return this.http.put(`${this.apiUrl}/profile`, userData, { headers });
}
  
  checkIfPurchased(username: string, postId: number ): Observable<boolean> {
    const token = this.tokenService.getAccessToken();
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');
  const url = `${environment.apiUrl}/posts/purchases/check?&postId=${postId}`;
  return this.http.get<{ purchased: boolean }>(url,{headers}).pipe(
    map(response => response.purchased)
  );
}

  // Add to your UserService
  getPurchasedPosts(username: string): Observable<any[]> {
  const token = this.tokenService.getAccessToken();
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

  const url = `${environment.apiUrl}/users/${username}/purchases`;
  
  return this.http.get<any[]>(url, { headers });
}
  
  getAllUserPostSummaries(): Observable<UserPostSummary[]> {
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.get<UserPostSummary[]>(`${this.apiUrl}/admin/user-post-summaries`, { headers });
  }

  deleteUser(username: string): Observable<any> {
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    return this.http.delete(`${this.apiUrl}/delete/${username}`, { headers });
  }

getAllStats(): Observable<{
  totalPosts: number,
  totalUsers: number,
  totalStudents: number,
  totalTeachers: number
}> {
  const token = this.tokenService.getAccessToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  return this.http.get<{
    totalPosts: number,
    totalUsers: number,
    totalStudents: number,
    totalTeachers: number
  }>(`${this.apiUrl}/count`, { headers });
}
  
}