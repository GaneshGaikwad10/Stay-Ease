

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { User } from '../../shared/model/data.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private userName: string = "";

  constructor(private http: HttpClient) { }

  // --- AUTHENTICATION ---

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('userId', res.data.id || res.data._id);
          sessionStorage.setItem('userRole', res.data.role);
          sessionStorage.setItem('userData', JSON.stringify(res.data));
        }
      })
    );
  }

  
  logout(): Observable<any> {
    const token = this.getToken();
    
    
    sessionStorage.clear();
    this.userName = "";

    if (token) {
      return this.http.post(`${this.apiUrl}/auth/logout`, {});
    }
    return of({ success: true });
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // --- SESSION GETTERS ---

  getLoggedUserId(): string {
    return sessionStorage.getItem('userId') || '';
  }

  getRole(): string {
    return sessionStorage.getItem('userRole') || '';
  }

  setName(name: string) { this.userName = name; }
  getName(): string { return this.userName; }

  
  setLoggedUser(id: string, role: string) {
    sessionStorage.setItem('userId', id);
    sessionStorage.setItem('userRole', role);
  }

  // --- USER API CALLS ---

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  getProfile(): Observable<any> {
    
    return this.http.get(`${this.apiUrl}/user/me`);
  }

  updateProfile(data: Partial<User>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/me`, data);
  }

  // --- ADMIN ACTIONS ---

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`);
  }

  updateUserById(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }
}