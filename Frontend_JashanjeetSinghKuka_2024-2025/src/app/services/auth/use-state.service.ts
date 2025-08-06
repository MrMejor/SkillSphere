import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UseStateService {
  private readonly USER_KEY = "tienda_online";

  constructor() { }

  save(username: string, role: string, userId: number): void {
    sessionStorage.setItem(
      this.USER_KEY, 
      JSON.stringify({ username, role, userId })
    );
  }

  getUsername(): string | null {
    const session = this.getSession();
    return session?.username || null;
  }

  getRole(): string | null {
    const session = this.getSession();
    return session?.role || null;
  }

  getUserId(): number | null {
    const session = this.getSession();
    return session?.userId || null;
  }

  removeSession(): void {
    sessionStorage.removeItem(this.USER_KEY);
  }

  private getSession(): any {
    try {
      const sessionData = sessionStorage.getItem(this.USER_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }
  getToken(): string | null {
  return localStorage.getItem('accessToken');
}

}